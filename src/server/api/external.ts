import axios from 'axios';
import { env } from '~/env';

export const external = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BOOK_URL,
});
