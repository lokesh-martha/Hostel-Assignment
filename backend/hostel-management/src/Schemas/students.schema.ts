import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type StudentDocument = Student & Document;

@Schema()
export class Student {
  @Prop()
  Name: string;
  @Prop()
  UserName: string;
  @Prop()
  RoomNumber: number;

  @Prop()
  TotalFee: number;

  @Prop()
  FeePaid: number;

  @Prop()
  FeeDue: number;

  @Prop()
  PhoneNumber: string;

  @Prop({ type: Date, default: Date.now })
  JoiningDate: Date;

  @Prop({ default: 'student' })
  role: string;

  @Prop({ default: true })
  IsActive: boolean;
  @Prop()
  Email:string
}

export const StudentSchema = SchemaFactory.createForClass(Student);

StudentSchema.pre<StudentDocument>('save', function (next) {
  this.FeeDue = this.TotalFee - this.FeePaid;
  next();
});
