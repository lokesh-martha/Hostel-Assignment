import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type StudentDocument=Student & Document;
 @Schema()
 export class Student{
    @Prop()
    UserName:string;
    @Prop()
    RoomNumber:number;
    @Prop()
    TotalFee:number;
    @Prop()
    FeePaid:number;
    @Prop()
    FeeDue:number;
    @Prop()
    PhoneNumber:string;
    @Prop({ default: 'student' })
    role:string;
    @Prop({default:true})
    IsActive:boolean
 }

 export const StudentSchema=SchemaFactory.createForClass(Student)