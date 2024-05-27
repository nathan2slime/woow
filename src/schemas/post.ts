import { z } from 'zod';

export const create = z.object({
  title: z.string().min(1),
  description: z.string().min(1).max(300),
  club: z.string().uuid(),
});

export const club = z.object({ club: z.string().uuid() });

export const postSchema = { create, club };
