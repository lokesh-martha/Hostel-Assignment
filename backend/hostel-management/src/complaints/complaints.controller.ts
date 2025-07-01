import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { Complaint } from '../Schemas/complaints.schema';
import { JwtAuthGuard } from 'src/gaurds/jwt-auth.gaurd';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ComplaintDto } from '../dto/complaint.dto';
import { UpdateStatusDto } from '../dto/update-status.dto';
import { RolesGuard } from 'src/gaurds/roles.guard';
import { Role } from 'src/enums/roles.enum';
import { Roles } from 'src/decorator/roles.decorator';
import { RequestWithUser } from 'src/express';

@ApiTags('complaints')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly complaintServices: ComplaintsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all complaints' })
  @ApiResponse({ status: 200, type: [ComplaintDto] })
  async findAll(@Req() req: RequestWithUser): Promise<Complaint[]> {
      return  this.complaintServices.findAll(req.user?.role , req.user?.username)
  }

  @Post()
  @ApiOperation({ summary: 'Create a new complaint' })
  @ApiResponse({ status: 201, type: ComplaintDto })
  async create(@Body() createComplaintDto: Complaint): Promise<Complaint> {
    
    return this.complaintServices.Create(createComplaintDto);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete all complaints' })
  async deleteAll() {
    return this.complaintServices.deleteAll();
  }
  
  @Delete(':id')
  @ApiOperation({ summary: 'Delete complaint by ComplaintID' })
  async deleteById(@Param('id') id: string) {
    return this.complaintServices.deleteById(id);
  }

  
  @Roles(Role.Admin)
  @Patch(':id/status')
  @ApiOperation({ summary: 'Update complaint status' })
  @ApiResponse({ status: 200, type: ComplaintDto })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ): Promise<Complaint | null> {
    return this.complaintServices.updateStatus(id, updateStatusDto.Status);
  }
}
