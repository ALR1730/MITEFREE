import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UsePipes,
  BadRequestException,
  NotFoundException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import {
  CreateAppointmentSchema,
  type CreateAppointmentDto,
  type AppointmentResponseDto,
  type TimeSlotDto,
} from '@mitefree/shared-types';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe.js';
import { ScheduleAppointmentUseCase } from '../../application/appointments/schedule-appointment.use-case.js';
import { GetAppointmentUseCase } from '../../application/appointments/get-appointment.use-case.js';

@ApiTags('Appointments (Citas y Rutas)')
@Controller('appointments')
export class AppointmentsController {
  constructor(
    private readonly scheduleAppointmentUseCase: ScheduleAppointmentUseCase,
    private readonly getAppointmentUseCase: GetAppointmentUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Schedule a new appointment for a quotation' })
  @ApiResponse({ status: 201, description: 'Appointment successfully scheduled.' })
  @ApiResponse({ status: 400, description: 'Invalid schedule request or slot booked.' })
  @UsePipes(new ZodValidationPipe(CreateAppointmentSchema))
  async schedule(@Body() body: CreateAppointmentDto): Promise<AppointmentResponseDto> {
    const result = await this.scheduleAppointmentUseCase.execute(body);

    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }

    return result.value;
  }

  @Get('slots')
  @ApiOperation({ summary: 'Get active dispatch time slots' })
  @ApiResponse({ status: 200, description: 'List of available time slots.' })
  getSlots(): TimeSlotDto[] {
    return [
      {
        id: 'slot-morning-01',
        code: 'MORNING',
        startTime: '08:30',
        endTime: '11:30',
        zoneCode: 'DISTRITO_NACIONAL',
      },
      {
        id: 'slot-afternoon-02',
        code: 'AFTERNOON',
        startTime: '13:00',
        endTime: '16:00',
        zoneCode: 'DISTRITO_NACIONAL',
      },
      {
        id: 'slot-evening-03',
        code: 'EVENING',
        startTime: '16:30',
        endTime: '19:30',
        zoneCode: 'DISTRITO_NACIONAL',
      },
    ];
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get appointment details by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the appointment' })
  @ApiResponse({ status: 200, description: 'Appointment details found.' })
  @ApiResponse({ status: 404, description: 'Appointment not found.' })
  async getById(@Param('id') id: string): Promise<AppointmentResponseDto> {
    const result = await this.getAppointmentUseCase.execute(id);

    if (result.isFailure) {
      throw new NotFoundException(result.error);
    }

    return result.value;
  }
}
