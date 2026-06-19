import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { createOrder } from '../api/orders.js';
import styles from '../assets/css/CreateOrderPanel.module.css';

type OrderItemForm = {
    sku: string;
    quantity: number | '';
};

type OrderForm = {
    customerId: string;
    items: OrderItemForm[];
};

type OrderProps = {
    onOrderCreated: () => void;
};

export const CreateOrderPanel = ({ onOrderCreated }: OrderProps) => {

    const initialState: OrderForm = {
        customerId: '',
        items: [{ sku: '', quantity: '' }]
    };

    const [form, setForm] = useState<OrderForm>(initialState);
    const [isOpen, setIsOpen] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setForm(prev => ({
            ...prev, [name]: value
        }));
    };

    const handleItemChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            items: prev.items.map((item, index) =>
                index === 0
                    ? { ...item, [name]: value }
                    : item
            )
        }));
    };

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        const payload = {
            idempotencyKey: crypto.randomUUID(),
            customerId: form.customerId,
            items: form.items.map(item => ({
                sku: item.sku,
                quantity: Number(item.quantity),
            })),
        };

        await createOrder(payload);
        onOrderCreated();

        setForm(initialState);
        setIsOpen(false);
    }

    return (
        <div className={styles.appContainer}>
            <button className={styles.openBtn} onClick={() => setIsOpen(true)}>
                {isOpen ? 'Close' : 'Create Order'}
            </button>
            {isOpen && (
                <div className={styles.modalBackdrop} onClick={() => setIsOpen(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Create Order</h2>
                            <button className={styles.closeX} onClick={() => setIsOpen(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className={styles.modalForm}>
                            <div className={styles.formGroup}>
                                <label htmlFor="customerId">Customer ID</label>
                                <input
                                    type="text"
                                    id="customerId"
                                    name="customerId"
                                    value={form.customerId}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="sku">SKU</label>
                                <input
                                    type="text"
                                    id="sku"
                                    name="sku"
                                    value={form.items[0].sku}
                                    onChange={handleItemChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="quantity">Quantity</label>
                                <input
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    value={form.items[0].quantity}
                                    onChange={handleItemChange}
                                    required
                                />
                            </div>
                            <div className={styles.modalFooter}>
                                <button type="button" className={styles.cancelBtn} onClick={() => setIsOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className={styles.submitBtn}>
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
