import { AppError } from './AppError.js';

export class AdapterError extends AppError {
    constructor(message: string) {
        super(message, 409);
    }
}