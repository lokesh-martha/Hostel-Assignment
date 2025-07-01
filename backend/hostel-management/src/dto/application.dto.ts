import { ApiProperty } from '@nestjs/swagger';

export class ApplicationDto {
  @ApiProperty()
  StudentName: string;

  @ApiProperty()
  PreviousRoom: string;

  @ApiProperty()
  AppliedRoom: string;
}
