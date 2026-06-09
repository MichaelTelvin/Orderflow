import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { createOrder } from '../api/orders.js';
import styles from '../assets/css/CreateOrderForm.module.css';

type OrderItemForm = {
    sku: string;
    quantity: number | '';
};

type OrderForm = {
    customerId: string,
    items: OrderItemForm[]
};

type OrderProps = {
    onOrderCreated: () => void;
};

export const CreateOrderForm = ({ onOrderCreated }: OrderProps) => {

    const initialState: OrderForm = {
        customerId: '',
        items: [{ sku: '', quantity: '' }]
    };

    const [form, setForm] = useState<OrderForm>(initialState);

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
            customerId: form.customerId,
            items: form.items.map(item => ({
                sku: item.sku,
                quantity: Number(item.quantity),
            })),
        };

        await createOrder(payload);
        onOrderCreated();

        setForm(initialState);
    }

    return (
        <form className={styles.formContainer} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="customerId">Customer ID</label>
                <input
                    className={styles.input}
                    name="customerId"
                    value={form.customerId}
                    onChange={handleChange}
                />
            </div>
            <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="sku">SKU</label>
                <input
                    className={styles.input}
                    name="sku"
                    value={form.items[0].sku}
                    onChange={handleItemChange}
                />
            </div>
            <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="quantity">Quantity</label>
                <input
                    className={styles.input}
                    name="quantity"
                    type="number"
                    value={form.items[0].quantity}
                    onChange={handleItemChange}
                />
            </div>
            <div className={styles.formGroup}>
                <button className={styles.submitButton} type="submit">Submit</button>
            </div>

        </form>
    )
}