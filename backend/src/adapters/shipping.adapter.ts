import { AdapterError } from "../errors/AdapterError.js";

export const shippingAdapter = {
    async calculateShipping() {
        if (Math.random() < 0.3) {
            throw new AdapterError('Shipping service unavailable');
        }
    }
};