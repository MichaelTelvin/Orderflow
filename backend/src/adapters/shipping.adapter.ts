export const shippingAdapter = {
    async calculateShipping() {
        if (Math.random() < 0.3) {
            throw new Error('Shipping service unavailable');
        }
    }
};