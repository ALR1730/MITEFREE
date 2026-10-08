import { z } from 'zod';

export const ZoneDiscountConfigSchema = z.object({
  zoneCode: z.string(),
  name: z.string(),
  enabled: z.boolean(),
  discountPercentage: z.number().min(0).max(100),
});

export const SlotDiscountConfigSchema = z.object({
  slotCode: z.string(),
  label: z.string(),
  time: z.string(),
  enabled: z.boolean(),
  discountPercentage: z.number().min(0).max(100),
});

export const DiscountPolicyConfigSchema = z.object({
  zones: z.array(ZoneDiscountConfigSchema),
  slots: z.array(SlotDiscountConfigSchema),
});

export type ZoneDiscountConfig = z.infer<typeof ZoneDiscountConfigSchema>;
export type SlotDiscountConfig = z.infer<typeof SlotDiscountConfigSchema>;
export type DiscountPolicyConfig = z.infer<typeof DiscountPolicyConfigSchema>;

export const DEFAULT_DISCOUNT_POLICY: DiscountPolicyConfig = {
  zones: [
    {
      zoneCode: 'ZONE-SPM',
      name: 'San Pedro de Macorís',
      enabled: false,
      discountPercentage: 0,
    },
    {
      zoneCode: 'ZONE-LR',
      name: 'La Romana',
      enabled: false,
      discountPercentage: 0,
    },
    {
      zoneCode: 'ZONE-SDE',
      name: 'Santo Domingo Este',
      enabled: false,
      discountPercentage: 0,
    },
    {
      zoneCode: 'ZONE-DN',
      name: 'Distrito Nacional',
      enabled: false,
      discountPercentage: 0,
    },
  ],
  slots: [
    {
      slotCode: 'MORNING',
      label: 'Bloque Mañana',
      time: '08:30 AM – 11:30 AM',
      enabled: false,
      discountPercentage: 0,
    },
    {
      slotCode: 'AFTERNOON',
      label: 'Bloque Tarde',
      time: '01:00 PM – 04:00 PM',
      enabled: false,
      discountPercentage: 0,
    },
    {
      slotCode: 'EVENING',
      label: 'Bloque Vespertino',
      time: '04:30 PM – 07:30 PM',
      enabled: false,
      discountPercentage: 0,
    },
  ],
};
