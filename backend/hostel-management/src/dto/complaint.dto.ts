import { ApiProperty } from '@nestjs/swagger';
import { ComplaintStatus } from '../Schemas/complaints.schema';

export class ComplaintDto {
  @ApiProperty()
  UserName: string;

  @ApiProperty()
  RoomNumber: number;

  @ApiProperty()
  Complaint: string;

  @ApiProperty({ enum: ComplaintStatus, default: ComplaintStatus.Pending })
  Status: ComplaintStatus;
  
}
