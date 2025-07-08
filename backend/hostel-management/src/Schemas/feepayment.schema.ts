import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type FeepaymentDocument = Feepayment & Document;
@Schema()
export class Feepayment {
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  studentId: Types.ObjectId;

  @Prop()
  AmountPaid: number;
  @Prop({ type: Date, default: Date.now })
  PaymentDate: Date;
}

export const FeepaymentSchema = SchemaFactory.createForClass(Feepayment);
