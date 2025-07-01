import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Complaint, ComplaintDocument } from '../Schemas/complaints.schema';
import { Model } from 'mongoose';

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectModel(Complaint.name)
    private complaintModule: Model<ComplaintDocument>,
  ) {}

  async findAll(role: string, UserName: string): Promise<Complaint[]> {
    const result = await this.complaintModule.find({ IsActive: true }).exec();
    if (role === 'admin') {
      return result;
    }

    return result.filter(
      (complaint) =>
        complaint.UserName?.toLowerCase() === UserName?.toLowerCase(),
    );
  }

  async findById(Id: number): Promise<any> {
    return this.complaintModule.findById(Id);
  }
  async Create(createComplaintDto: Complaint): Promise<Complaint> {
    const newComplaint = new this.complaintModule(createComplaintDto);
    return newComplaint.save();
  }

  async deleteAll(): Promise<{ deletedCount: number }> {
    const result = await this.complaintModule.deleteMany({});
    return { deletedCount: result.deletedCount };
  }

  async deleteById(id: string): Promise<{ message: string }> {
    const result = await this.complaintModule.findById(id);
    if (!result) {
      return { message: 'Complaint not found' };
    }
    await this.complaintModule.findByIdAndUpdate(id, { IsActive: false });
    return { message: 'Complaint deleted successfully' };
  }
  async updateStatus(
    id: string,
    status: Complaint['Status'],
  ): Promise<Complaint | null> {
    return this.complaintModule.findByIdAndUpdate(
      id,
      { Status: status },
      { new: true },
    );
  }
}
