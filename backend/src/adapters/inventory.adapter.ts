export const inventoryAdapter = {
    async reserveInventory() {
        if (Math.random() < 0.3) {
            throw new Error('Inventory service unavailable');
        }
    }
};