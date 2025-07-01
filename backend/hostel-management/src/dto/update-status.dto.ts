import { ApiProperty } from '@nestjs/swagger';
import { ComplaintStatus } from '../Schemas/complaints.schema';
import { IsEnum } from 'class-validator';

export class UpdateStatusDto {
  @ApiProperty({ enum: ComplaintStatus })
  @IsEnum(ComplaintStatus)
  Status: ComplaintStatus;
}
