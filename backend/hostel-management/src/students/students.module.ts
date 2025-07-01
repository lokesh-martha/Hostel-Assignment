import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from 'src/Schemas/students.schema';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { Room, RoomSchema } from 'src/Schemas/rooms.schema';
import { Application, ApplicationSchema } from 'src/Schemas/application.schema';

@Module({
    imports:[
        MongooseModule.forFeature([{name:Student.name,schema:StudentSchema},
            {name:Room.name,schema:RoomSchema},
            {name:Application.name,schema:ApplicationSchema}])
    ],
    controllers:[StudentsController],
    providers:[StudentsService]
})
export class StudentsModule {}
