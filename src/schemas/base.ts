import { z } from 'zod';

export const findById = z.object({
  id: z.string(),
});

export const baseSchema = { findById };
