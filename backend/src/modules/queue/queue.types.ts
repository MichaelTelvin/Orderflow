import * as z from 'zod';
import type {
    requeueDlqSchema
} from './queue.schemas.js';

export type RequeueDlqRequest = z.infer<typeof requeueDlqSchema>;

