import { ApiProperty } from '@nestjs/swagger';

export class StudentDto {
  @ApiProperty()
  Id:string;
  
  @ApiProperty()
  UserName: string;

  @ApiProperty()
  RoomNumber: number;

  @ApiProperty()
  TotalFee: number;

  @ApiProperty()
  FeePaid: number;

  @ApiProperty()
  FeeDue: number;

  @ApiProperty()
  PhoneNumber: string;

  @ApiProperty({ default: 'student' })
  role: string;
}