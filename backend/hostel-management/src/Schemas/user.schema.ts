import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  username: string;

  @Prop()
  password: string;
  @Prop({default:"student"})
  role:string
  @Prop()
  email:string;
}

export const UserSchema = SchemaFactory.createForClass(User);
