import { z } from 'zod';

export const create = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().default('default'),
});

export const getByIdOutput = z.object({});

export const clubSchema = { create, getByIdOutput };
