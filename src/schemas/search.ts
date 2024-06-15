import { z } from 'zod';

export const search = z.object({
  query: z.string().min(2),
});

export const searchSchema = { search };
