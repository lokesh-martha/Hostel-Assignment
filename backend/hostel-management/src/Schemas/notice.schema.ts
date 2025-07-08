import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type NoticeDocument = Notice & Document;
@Schema()
export class Notice {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: Date.now })
  date: Date;
}

export const NoticeSchema = SchemaFactory.createForClass(Notice);
