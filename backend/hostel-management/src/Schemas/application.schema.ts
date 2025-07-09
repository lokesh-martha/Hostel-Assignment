import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ApplicationDocument = Application & Document;

@Schema({ timestamps: true })
export class Application {
  @Prop({ required: true })
  StudentName: string;

  @Prop({ required: true })
  PreviousRoom: Number;

  @Prop({ required: true })
  AppliedRoom: Number;

  @Prop({ default: 'Pending', enum: ['Pending', 'Accepted', 'Rejected'] })
  Status: string;
  @Prop({default:true})
  IsActive:boolean
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
