import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Complaint, ComplaintSchema } from '../Schemas/complaints.schema';
import { ComplaintsController } from './complaints.controller';
import { ComplaintsService } from './complaints.service';

@Module({
    imports :[MongooseModule.forFeature([{name:Complaint.name, schema:ComplaintSchema}])],
    controllers:[ComplaintsController],
    providers:[ComplaintsService]
})
export class ComplaintsModule {
}
