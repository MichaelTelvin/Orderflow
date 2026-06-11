export const legalAdapter = {
    async validateLegal() {
        if (Math.random() < 0.3) {
            throw new Error('Legal service unavailable');
        }
    }
};