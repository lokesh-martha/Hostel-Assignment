import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  BadRequestException,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { Student } from '../Schemas/students.schema';
import { JwtAuthGuard } from 'src/gaurds/jwt-auth.gaurd';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { StudentDto } from '../dto/student.dto';
import { RolesGuard } from 'src/gaurds/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { Room } from 'src/Schemas/rooms.schema';
import { ApplicationDto } from 'src/dto/application.dto';

@ApiTags('students')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('GetStudentDetails')
  @ApiOperation({ summary: 'Get all students' })
  @ApiResponse({ status: 200, type: [StudentDto] })
  async findAll(): Promise<Student[]> {
    return this.studentsService.findAll();
  }

  @Get('GetTotalStudents')
  @ApiOperation({ summary: 'Get total number of students' })
  @ApiResponse({ status: 200, type: Number })
  async GetTotalStudents(): Promise<number> {
    return this.studentsService.GetStudentsCount();
  }
  @Get('activerooms')
  @ApiOperation({ summary: 'Get list of active rooms' })
  @ApiResponse({ status: 200, type: Room })
  async getActiveRooms(@Query('username') username: string): Promise<Room[]> {
    return this.studentsService.getActiveRoomsForUser(username);
  }

  @Get('inactiverooms')
  @ApiOperation({ summary: 'Get list of inactive rooms' })
  @ApiResponse({ status: 200, type: Room })
  async getinactiverooms(): Promise<Room[]> {
    return this.studentsService.getinactiverooms();
  }
  @Get('applications')
  @ApiOperation({ summary: 'Get all room applications' })
  async getApplications() {
    return this.studentsService.getApplications();
  }
  @Get(':Id')
  @ApiOperation({ summary: 'Get student by ID' })
  @ApiResponse({ status: 200, type: StudentDto })
  async findOneById(@Param('Id') Id: string): Promise<Student> {
    const student = await this.studentsService.findOneById(Id);
    if (!student) {
      throw new Error(`Student with ID ${Id} not found`);
    }
    return student;
  }
  @Post('applyRoom')
  @ApiOperation({ summary: 'Apply for a room' })
  @ApiResponse({
    status: 201,
    description: 'Application submitted successfully',
  })
  async applyRoom(@Body() body: ApplicationDto) {
    return this.studentsService.createApplication(body);
  }
  @Put('applications/DeleteApplication')
  @ApiOperation({ summary: 'Update application status' })
  async updateApplicationValidity(
    @Body() body: { StudentName: string; AppliedRoom: string },
  ) {
    return this.studentsService.DeleteApplication(
      body.StudentName,
      body.AppliedRoom,
    );
  }

  @Put('applications/:id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Update application status' })
  async updateApplicationStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.studentsService.updateApplicationStatus(id, status);
  }

  @Post('addroom')
  @ApiOperation({ summary: 'add a new room' })
  @ApiResponse({ status: 201, type: Room })
  async createroom(@Body() room: Room): Promise<Room> {
    return this.studentsService.addRoom(room);
  }
  @Post()
  @ApiOperation({ summary: 'Create a new student' })
  @ApiResponse({ status: 201, type: StudentDto })
  async create(@Body() createStudentDto: Student): Promise<Student> {
    let student = await this.studentsService.findOne(
      createStudentDto.PhoneNumber,
    );
    if (student) {
      throw new BadRequestException(
        'Student with this phone number already exists',
      );
    }
    student = await this.studentsService.findOneByRoomNumber(
      createStudentDto.RoomNumber,
    );
    if (student) {
      throw new BadRequestException(
        'Student with this Room number already exists',
      );
    }
    return this.studentsService.create(createStudentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a student by ID' })
  async deleteStudent(@Param('id') id: string) {
    return this.studentsService.delete(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a student by ID' })
  @ApiResponse({ status: 200, type: StudentDto })
  async updateStudent(
    @Param('id') id: string,
    @Body() updateStudentDto: Student,
  ): Promise<Student | any> {
    const student = await this.studentsService.findOneByRoomNumber(
      updateStudentDto.RoomNumber,
    );
    if (student) {
      throw new BadRequestException(
        'Student with this Room number already exists',
      );
    }
    return this.studentsService.update(id, updateStudentDto);
  }
}
