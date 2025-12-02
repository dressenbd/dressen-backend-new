import { z } from 'zod';

export const createStoreSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(50),
    contact_name: z.string().min(3).max(50),
    contact_number: z.string().length(11),
    secondary_contact: z.string().optional(),
    otp_number: z.string().optional(),
    address: z.string().min(10).max(120),
    city_id: z.number().int().positive(),
    zone_id: z.number().int().positive(),
    area_id: z.number().int().positive(),
  }).or(z.object({
    storeData: z.object({
      name: z.string().min(3).max(50),
      contact_name: z.string().min(3).max(50),
      contact_number: z.string().length(11),
      secondary_contact: z.string().optional(),
      otp_number: z.string().optional(),
      address: z.string().min(10).max(120),
      city_id: z.number().int().positive(),
      zone_id: z.number().int().positive(),
      area_id: z.number().int().positive(),
    })
  })),
});

export const createOrderSchema = z.object({
  body: z.object({
    store_id: z.number().int().positive(),
    merchant_order_id: z.string().optional(),
    recipient_name: z.string().min(3).max(100),
    recipient_phone: z.string().length(11),
    recipient_secondary_phone: z.string().length(11).optional(),
    recipient_address: z.string().min(10).max(220),
    recipient_city: z.number().int().positive().optional(),
    recipient_zone: z.number().int().positive().optional(),
    recipient_area: z.number().int().positive().optional(),
    delivery_type: z.union([z.literal(12), z.literal(48)]),
    item_type: z.union([z.literal(1), z.literal(2)]),
    special_instruction: z.string().optional(),
    item_quantity: z.number().int().positive(),
    item_weight: z.number().min(0.5).max(10),
    item_description: z.string().optional(),
    amount_to_collect: z.number().int().min(0),
  }),
});

export const bulkOrderSchema = z.object({
  body: z.object({
    orders: z.array(createOrderSchema.shape.body).min(1).max(50),
  }),
});

export const calculatePriceSchema = z.object({
  body: z.object({
    store_id: z.number().int().positive(),
    item_type: z.union([z.literal(1), z.literal(2)]),
    delivery_type: z.union([z.literal(12), z.literal(48)]),
    item_weight: z.number().min(0.5).max(10),
    recipient_city: z.number().int().positive(),
    recipient_zone: z.number().int().positive(),
  }),
});