import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ComplaintDocument = Complaint & Document;

export enum ComplaintStatus {
  Pending = 'Pending',
  InProgress = 'InProgress',
  Resolved = 'Resolved',
  Closed = 'Closed'
}

@Schema()
export class Complaint {
  @Prop()
  UserName: string;

  @Prop()
  RoomNumber: number;

  @Prop()
  Complaint: string;

  @Prop({ enum: ComplaintStatus, default: ComplaintStatus.Pending })
  Status: ComplaintStatus;
  @Prop({default:true})
  IsActive:boolean;
}

export const ComplaintSchema = SchemaFactory.createForClass(Complaint);
