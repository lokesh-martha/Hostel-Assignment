import { Injectable, BadRequestException } from '@nestjs/common';
import { Student, StudentDocument } from 'src/Schemas/students.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from 'src/enums/roles.enum';
import { Room, RoomDocument } from 'src/Schemas/rooms.schema';
import {
  Application,
  ApplicationDocument,
} from 'src/Schemas/application.schema';
import { ApplicationDto } from 'src/dto/application.dto';
import { Feepayment, FeepaymentDocument } from 'src/Schemas/feepayment.schema';
import { PaymentDto } from 'src/dto/payment.dto';
import { Cron } from '@nestjs/schedule';
import { MailService } from 'src/mail.service';
import { Notice, NoticeDocument } from 'src/Schemas/notice.schema';
import { CreateNoticeDto } from 'src/dto/createNotice.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name) private studentModule: Model<StudentDocument>,
    @InjectModel(Room.name) private roomModule: Model<RoomDocument>,
    @InjectModel(Notice.name) private noticeModule: Model<NoticeDocument>,
    @InjectModel(Feepayment.name)
    private feepaymentModule: Model<FeepaymentDocument>,
    @InjectModel(Application.name)
    private applicationModel: Model<ApplicationDocument>,
    private mailService: MailService,
  ) {}

  async findAll(): Promise<Student[]> {
    return this.studentModule
      .find({ IsActive: true })
      .sort({ RoomNumber: 1 })
      .exec();
  }
  async findUsernameOrEmail({ username, email }: { username?: string; email?: string }): Promise<any> {
    const query: any = { $or: [] };
  
    if (username) query.$or.push({ UserName: username });
    if (email) query.$or.push({ Email: email });
  
    if (query.$or.length === 0) {
      console.log('No username or email provided to query.');
      return null;
    }
  
    // console.log('Query being executed:', JSON.stringify(query));
  
    const user = await this.studentModule.findOne(query);
    // console.log('User found:', user);
  
    return user;
  }
  
  async findAllNotices(): Promise<Notice[]> {
    return this.noticeModule.find().sort({ date: -1 }); 
  }
  
  async create(createStudentDto: Student): Promise<Student> {
    const room = await this.roomModule.findOne({
      RoomNumber: createStudentDto.RoomNumber,
      IsAvailable: true,
    });

    if (!room) {
      throw new BadRequestException('Room is not available for allocation');
    }


    await this.roomModule.findOneAndUpdate(
      { RoomNumber: createStudentDto.RoomNumber },
      { IsAvailable: false },
    );

    const student = await this.studentModule.findOneAndUpdate(
      { PhoneNumber: createStudentDto.PhoneNumber },
      { IsActive: true },
    );

    if (student) {
      return student;
    }

    const newStudent = new this.studentModule(createStudentDto);
    const savedStudent = await newStudent.save();

    if (createStudentDto.FeePaid && createStudentDto.FeePaid > 0) {
      const feePayment = new this.feepaymentModule({
        studentId: savedStudent._id,
        AmountPaid: createStudentDto.FeePaid,
        PaymentDate: createStudentDto.JoiningDate || new Date(),
      });
      await feePayment.save();
    }


    return savedStudent;
  }

  async delete(id: string): Promise<any> {
    const student = await this.studentModule.findByIdAndUpdate(id, {
      IsActive: false,
    });
    await this.roomModule.findOneAndUpdate(
      { RoomNumber: student?.RoomNumber },
      { IsAvailable: true },
    );
    return student;
  }
  async findOneByField(field:string,value:any ,options:{isActive?:boolean}):Promise<any>
  {
    const query:any={[field]:value};
    if(options.isActive)
      {
        query.IsActive=true;
      }
      return this.studentModule.findOne(query);
  }
  
  async findPaymentById(id: string): Promise<PaymentDto[] | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ObjectId: ${id}`);
    }
    console.log(id);
    console.log(
      await this.feepaymentModule
        .find({
          studentId: new Types.ObjectId(id),
        })
        .exec(),
    );
    return await this.feepaymentModule
      .find({
        studentId: new Types.ObjectId(id),
      })
      .exec();
  }

  async recordPayment(
    studentId: string,
    amountPaid: number,
    paymentDate: string,
  ) {
    const studentObjectId = new Types.ObjectId(studentId);
    await this.feepaymentModule.create({
      studentId: studentObjectId,
      AmountPaid: amountPaid,
      PaymentDate: new Date(paymentDate),
    });

    const result = await this.studentModule.findByIdAndUpdate(studentId, {
      $inc: { FeePaid: amountPaid, FeeDue: -amountPaid },
    });

    // if (result.modifiedCount === 0) {
    //   throw new BadRequestException('Failed to update student fee total.');
    // }

    return { message: 'Payment recorded and student updated successfully.' };
  }

  async update(_id: string, updateStudentDto: Student): Promise<Student> {
    const { RoomNumber: newRoomNumber, ...updateData } = updateStudentDto;

    // Fetch the existing student
    const existingStudent = await this.studentModule.findById(_id);
    if (!existingStudent) {
      throw new Error(`Student with ID ${_id} not found`);
    }

    const oldRoomNumber = existingStudent.RoomNumber;

    // If the room number has changed, update room availability
    if (oldRoomNumber !== newRoomNumber) {
      // Mark old room as available
      await this.roomModule.updateOne(
        { RoomNumber: oldRoomNumber },
        { $set: { IsAvailable: true } },
      );

      // Mark new room as unavailable
      await this.roomModule.updateOne(
        { RoomNumber: newRoomNumber },
        { $set: { IsAvailable: false } },
      );
    }

    // Update the student
    const updatedStudent = await this.studentModule.findByIdAndUpdate(
      _id,
      { ...updateData, RoomNumber: newRoomNumber },
      { new: true },
    );

    if (!updatedStudent) {
      throw new Error(`Student with ID ${_id} not found after update`);
    }

    return updatedStudent;
  }

  async GetStudentsCount(): Promise<number> {
    return this.studentModule.countDocuments({ IsActive: true });
  }

  async addRoom(room: Room) {
    return this.roomModule.create(room);
  }
  async getActiveRoomsForUser(studentName: string) {
    const allActiveRooms = await this.roomModule
      .find({ IsAvailable: true })
      .sort({ RoomNumber: 1 });

    const pendingApplications = await this.applicationModel.find({
      StudentName: studentName,
      Status: 'Pending',
    });

    const appliedRoomNumbers = pendingApplications.map(
      (app) => app.AppliedRoom,
    );

    const filteredRooms = allActiveRooms.filter(
      (room) => !appliedRoomNumbers.includes(room.RoomNumber),
    );

    return filteredRooms;
  }

  async getinactiverooms() {
    return this.roomModule.find({ IsAvailable: false }).sort({ RoomNumber: 1 });
  }

  async createApplication(
    data: ApplicationDto,
  ): Promise<Application | { success: boolean; message: string }> {
    const existingApplications = await this.applicationModel
      .find({
        StudentName: data.StudentName,
        IsActive: true,
        Status: { $regex: /^pending$/i },
      })
      .countDocuments();

    if (existingApplications >= 3) {
      return {
        success: false,
        message: 'You cannot apply for more than 3 rooms.',
      };
    } else {
      const application = new this.applicationModel(data);
      await application.save();

      return application;
    }
  }

  async getApplications(): Promise<Application[]> {
    return this.applicationModel
      .find({ Status: 'Pending', IsActive: true })
      .exec();
  }

  async updateApplicationStatus(
    id: string,
    status: string,
  ): Promise<Application | null> {
    const application = await this.applicationModel.findByIdAndUpdate(
      id,
      { Status: status },
      { new: true },
    );

    if (!application) return null;

    if (status === 'Accepted') {
      await this.studentModule.findOneAndUpdate(
        { UserName: application.StudentName },
        { RoomNumber: application.AppliedRoom },
      );
      await this.roomModule.findOneAndUpdate(
        { RoomNumber: application.AppliedRoom },
        { IsAvailable: false },
      );
      await this.roomModule.findOneAndUpdate(
        { RoomNumber: application.PreviousRoom },
        { IsAvailable: true },
      );

      await this.applicationModel.updateMany(
        {
          _id: { $ne: application._id },
          StudentName: application.StudentName,
          PreviousRoom: application.PreviousRoom,
          Status: { $ne: 'Rejected' },
        },
        { $set: { Status: 'Rejected' } },
      );
    }

    return application;
  }

  async DeleteApplication(
    studentName: string,
    appliedRoom: string,
  ): Promise<any> {
    await this.applicationModel.updateOne(
      { AppliedRoom: appliedRoom, StudentName: studentName, Status: 'Pending' },
      { $set: { IsActive: false } },
    );

    return { message: 'Application cancelled and room updated.' };
  }
  async getFeeDueForUser(username: string) {
    const result = await this.studentModule.findOne(
      { UserName: username },
      { FeeDue: 1, _id: 0 } 
    );
    return result?.FeeDue ?? null; 
  }
  
async addNotice(createNoticeDto: CreateNoticeDto): Promise<Notice> {
      const newNotice = new this.noticeModule({
        ...createNoticeDto,
        date: new Date(),
      });
      return newNotice.save();
    }
  
  
  @Cron('*/1 * * * *')
  async handlePendingFeeUpdate() {
    try {
      const students = await this.studentModule.find({ IsActive: true });
      const currentDate = new Date();
      const monthlyFee = 5000;
  
      for (const student of students) {
        let monthsPassed =
          (currentDate.getFullYear() - student.JoiningDate.getFullYear()) * 12 +
          (currentDate.getMonth() - student.JoiningDate.getMonth());
  
        if (currentDate.getDate() >= student.JoiningDate.getDate()) {
          monthsPassed += 1;
        }
  
        const expectedTotalFee = monthsPassed * monthlyFee;
  
        if (expectedTotalFee > student.TotalFee) {
          const newTotalFee = expectedTotalFee;
          const newFeeDue = newTotalFee - student.FeePaid;
  
          await this.studentModule.updateOne(
            { _id: student._id },
            {
              $set: {
                TotalFee: newTotalFee,
                FeeDue: newFeeDue,
              },
            },
          );
  
          await this.mailService.sendMail(
            student.Email,
            'Pending Fee Reminder',
            `Dear ${student.UserName}, your pending fee is ₹${newFeeDue}. Please pay it soon.`,
          );
        }
      }
    } catch (error) {
      console.error('Error in handlePendingFeeUpdate:', error);
    }
  }
  
}

// async findOne(PhoneNumber: string): Promise<Boolean> {
  //   const existing = await this.studentModule.findOne({
  //     PhoneNumber,
  //     IsActive: true,
  //   });
  //   if (!existing) {
  //     return false;
  //   }
  //   return true;
  // }
  // async findOneByRoomNumber(RoomNumber: number): Promise<Boolean> {
  //   const existing = await this.studentModule.findOne({
  //     RoomNumber,
  //     IsActive: true,
  //   });
  //   if (!existing) {
  //     return false;
  //   }
  //   return true;
  // }

  // async findOneById(Id: any): Promise<Student | null> {
  //   return this.studentModule.findById(Id);
  // }