import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from 'src/Schemas/students.schema';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { Room, RoomSchema } from 'src/Schemas/rooms.schema';
import { Application, ApplicationSchema } from 'src/Schemas/application.schema';
import { Feepayment, FeepaymentSchema } from 'src/Schemas/feepayment.schema';
import { MailService } from 'src/mail.service';
import { Notice, NoticeSchema } from 'src/Schemas/notice.schema';

@Module({
    imports:[
        MongooseModule.forFeature([{name:Student.name,schema:StudentSchema},
            {name:Room.name,schema:RoomSchema},
            {name:Application.name,schema:ApplicationSchema},
            {name:Feepayment.name,schema:FeepaymentSchema},
            {name:Notice.name,schema:NoticeSchema}])
    ],
    controllers:[StudentsController],
    providers:[StudentsService,MailService],
    exports:[StudentsService]
})
export class StudentsModule {}
