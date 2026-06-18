import * as z from 'zod';


export const requeueDlqSchema = z.object({
    orderId: z.string().min(3)
});

