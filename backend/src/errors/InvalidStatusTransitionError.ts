import { AppError } from './AppError.js';

export class InvalidStatusTransitionError extends AppError {
    constructor(message: string) {
        super(message, 409);
    }
}