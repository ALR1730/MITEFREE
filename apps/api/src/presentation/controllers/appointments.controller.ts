import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UsePipes,
  BadRequestException,
  NotFoundException,
  HttpStatus,
  HttpCode,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import {
  CreateAppointmentSchema,
  TransitionAppointmentStatusSchema,
  AssignTechnicianSchema,
  type CreateAppointmentDto,
  type AppointmentResponseDto,
  type TimeSlotAvailabilityDto,
  type GetAvailableSlotsQueryDto,
  type TransitionAppointmentStatusDto,
  type AssignTechnicianDto,
} from '@mitefree/shared-types';
import type { IAppointmentRepository } from '@mitefree/domain-core';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe.js';
import { ScheduleAppointmentUseCase } from '../../application/appointments/schedule-appointment.use-case.js';
import { GetAppointmentUseCase } from '../../application/appointments/get-appointment.use-case.js';
import { GetAvailableSlotsUseCase } from '../../application/appointments/get-available-slots.use-case.js';
import { TransitionAppointmentStatusUseCase } from '../../application/appointments/transition-status.use-case.js';
import { AssignTechnicianUseCase } from '../../application/appointments/assign-technician.use-case.js';
import { APPOINTMENT_REPOSITORY } from '../../infrastructure/database/database.tokens.js';

@ApiTags('Appointments (Citas & Logística por Zonas)')
@Controller('appointments')
export class AppointmentsController {
  constructor(
    private readonly scheduleAppointmentUseCase: ScheduleAppointmentUseCase,
    private readonly getAppointmentUseCase: GetAppointmentUseCase,
    private readonly getAvailableSlotsUseCase: GetAvailableSlotsUseCase,
    private readonly transitionStatusUseCase: TransitionAppointmentStatusUseCase,
    private readonly assignTechnicianUseCase: AssignTechnicianUseCase,
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepo: IAppointmentRepository,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all appointments for Kanban dispatch board' })
  @ApiResponse({ status: 200, description: 'List of all appointments.' })
  async listAll(): Promise<AppointmentResponseDto[]> {
    const list = await this.appointmentRepo.findAll();
    return list.map((apt) => ({
      id: apt.id,
      quotationId: apt.quotationId,
      clientId: apt.clientId,
      technicianId: apt.technicianId,
      timeSlotId: apt.timeSlotId,
      scheduledDate: apt.scheduledDate.toISOString().split('T')[0]!,
      status: apt.status,
      createdAt: apt.createdAt.toISOString(),
      updatedAt: apt.updatedAt.toISOString(),
    }));
  }

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
  @ApiOperation({
    summary: 'Get active dispatch time slots with dynamic Route Promotion detection',
  })
  @ApiQuery({ name: 'zoneCode', required: false, example: 'ZONE-DN' })
  @ApiQuery({ name: 'date', required: false, example: '2026-10-15' })
  @ApiResponse({ status: 200, description: 'List of evaluated time slots.' })
  async getSlots(
    @Query('zoneCode') zoneCode?: string,
    @Query('date') date?: string,
  ): Promise<TimeSlotAvailabilityDto[]> {
    const defaultZone = (zoneCode || 'ZONE-DN') as any;
    const defaultDate = date || new Date().toISOString().split('T')[0]!;

    const queryDto: GetAvailableSlotsQueryDto = {
      zoneCode: defaultZone,
      date: defaultDate,
    };

    const result = await this.getAvailableSlotsUseCase.execute(queryDto);

    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }

    return result.value;
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Transition appointment state (Confirmed -> EnRoute -> InProgress -> Completed)',
  })
  @ApiParam({ name: 'id', description: 'UUID of the appointment' })
  @ApiResponse({ status: 200, description: 'Appointment status transitioned.' })
  @ApiResponse({ status: 400, description: 'Invalid status transition invariant.' })
  @UsePipes(new ZodValidationPipe(TransitionAppointmentStatusSchema))
  async transitionStatus(
    @Param('id') id: string,
    @Body() body: TransitionAppointmentStatusDto,
  ): Promise<AppointmentResponseDto> {
    const result = await this.transitionStatusUseCase.execute({
      appointmentId: id,
      nextStatus: body.nextStatus as any,
    });

    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }

    return result.value;
  }

  @Patch(':id/assign')
  @ApiOperation({ summary: 'Assign technician crew to appointment with anti-double-booking check' })
  @ApiParam({ name: 'id', description: 'UUID of the appointment' })
  @ApiResponse({ status: 200, description: 'Technician assigned successfully.' })
  @ApiResponse({ status: 400, description: 'Technician has schedule collision.' })
  @UsePipes(new ZodValidationPipe(AssignTechnicianSchema))
  async assignTechnician(
    @Param('id') id: string,
    @Body() body: AssignTechnicianDto,
  ): Promise<AppointmentResponseDto> {
    const result = await this.assignTechnicianUseCase.execute({
      appointmentId: id,
      technicianId: body.technicianId,
    });

    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }

    return result.value;
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
