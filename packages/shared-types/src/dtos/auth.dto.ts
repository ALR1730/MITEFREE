import { z } from 'zod';

export const RegisterClientDtoSchema = z.object({
  fullName: z.string().min(3, 'El nombre completo debe tener al menos 3 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  phone: z.string().min(10, 'El teléfono debe contener al menos 10 dígitos'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  zoneCode: z.string().optional().default('ZONE-SPM'),
  address: z.string().optional().default(''),
});

export type RegisterClientDto = z.infer<typeof RegisterClientDtoSchema>;

export const LoginDtoSchema = z.object({
  identifier: z.string().min(3, 'Ingresa tu correo o número de teléfono'),
  password: z.string().min(4, 'Ingresa tu contraseña'),
});

export type LoginDto = z.infer<typeof LoginDtoSchema>;

export const WhatsAppOtpLoginDtoSchema = z.object({
  phone: z.string().min(10, 'Ingresa tu número de WhatsApp válido (+1 809/829/849)'),
  otpCode: z.string().length(6, 'El código de verificación debe tener 6 dígitos'),
});

export type WhatsAppOtpLoginDto = z.infer<typeof WhatsAppOtpLoginDtoSchema>;

export const UserProfileDtoSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  role: z.enum(['CLIENT', 'TECHNICIAN', 'ADMIN']),
  zoneCode: z.string().optional(),
  address: z.string().optional(),
  walletBalance: z.number().default(0),
  createdAt: z.string(),
});

export type UserProfileDto = z.infer<typeof UserProfileDtoSchema>;

export const AuthResponseDtoSchema = z.object({
  token: z.string(),
  user: UserProfileDtoSchema,
});

export type AuthResponseDto = z.infer<typeof AuthResponseDtoSchema>;

export const ClientDirectoryItemDtoSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string(),
  email: z.string(),
  phone: z.string(),
  role: z.string(),
  zoneCode: z.string().optional(),
  address: z.string().optional(),
  isActive: z.boolean().default(true),
  appointmentsCount: z.number().default(0),
  totalSpent: z.number().default(0),
  walletBalance: z.number().default(0),
  createdAt: z.string(),
});

export type ClientDirectoryItemDto = z.infer<typeof ClientDirectoryItemDtoSchema>;
