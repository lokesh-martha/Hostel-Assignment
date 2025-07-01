import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type RoomDocument=Room & Document;
 @Schema()
 export class Room{
    @Prop({required:true})
    RoomNumber:Number;
   
    @Prop({default:true,required:true})
    IsAvailable:boolean
 }

 export const RoomSchema=SchemaFactory.createForClass(Room)