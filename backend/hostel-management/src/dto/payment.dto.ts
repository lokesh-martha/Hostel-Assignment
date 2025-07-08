import { ApiProperty } from '@nestjs/swagger';
import { StudentDto } from './student.dto';

export class PaymentDto {
  @ApiProperty()
  
  AmountPaid: number;
  
  @ApiProperty()
  PaymentDate: Date;
  
}