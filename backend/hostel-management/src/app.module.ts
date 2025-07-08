import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentsModule } from './students/students.module';
import { ComplaintsModule } from './complaints/complaints.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';



@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}),ScheduleModule.forRoot(),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/HostelManagementSystem'), StudentsModule, ComplaintsModule, AuthModule,
    JwtModule.register({
      secret:'your',
      signOptions:{expiresIn:'1h'}
    })
  ],
  
})
export class AppModule {}
