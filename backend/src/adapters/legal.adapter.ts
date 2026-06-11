import { AdapterError } from "../errors/AdapterError.js";

export const legalAdapter = {
    async validateLegal() {
        if (Math.random() < 0.3) {
            throw new AdapterError('Legal service unavailable');
        }
    }
};