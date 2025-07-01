import { Injectable, BadRequestException } from '@nestjs/common';
import { Student, StudentDocument } from 'src/Schemas/students.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from 'src/enums/roles.enum';
import { Room, RoomDocument } from 'src/Schemas/rooms.schema';
import {
  Application,
  ApplicationDocument,
} from 'src/Schemas/application.schema';
import { ApplicationDto } from 'src/dto/application.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name) private studentModule: Model<StudentDocument>,
    @InjectModel(Room.name) private roomModule: Model<RoomDocument>,
    @InjectModel(Application.name)
    private applicationModel: Model<ApplicationDocument>,
  ) {}

  async findAll(): Promise<Student[]> {
    return this.studentModule
      .find({ IsActive: true })
      .sort({ RoomNumber: 1 })
      .exec();
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
    return newStudent.save();
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
  async findOne(PhoneNumber: string): Promise<Boolean> {
    const existing = await this.studentModule.findOne({
      PhoneNumber,
      IsActive: true,
    });
    if (!existing) {
      return false;
    }
    return true;
  }
  async findOneByRoomNumber(RoomNumber: number): Promise<Boolean> {
    const existing = await this.studentModule.findOne({
      RoomNumber,
      IsActive: true,
    });
    if (!existing) {
      return false;
    }
    return true;
  }

  async findOneById(Id: any): Promise<Student | null> {
    return this.studentModule.findById(Id);
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
}
