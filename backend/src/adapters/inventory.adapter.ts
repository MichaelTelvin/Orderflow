import { AdapterError } from "../errors/AdapterError.js";

export const inventoryAdapter = {
    async reserveInventory() {
        if (Math.random() < 0.3) {
            throw new AdapterError('Inventory service unavailable');
        }
    }
};