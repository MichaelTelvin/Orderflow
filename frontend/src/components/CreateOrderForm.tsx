import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { createOrder } from '../api/orders.js';
import styles from '../assets/css/CreateOrderForm.module.css';

type OrderItemForm = {
    sku: string;
    quantity: number;
};

type OrderForm = {
    customerId: string,
    items: OrderItemForm[]
};

type OrderProps = {
    onOrderCreated: () => void;
};

export const CreateOrderForm = ({ onOrderCreated }: OrderProps) => {

    const initialState = {
        customerId: '',
        items: [{ sku: "TEST-SKU", quantity: 1 }]
    };

    const [form, setForm] = useState<OrderForm>(initialState);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setForm(prev => ({
            ...prev, [name]: value
        }));
    };

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        await createOrder(form);
        onOrderCreated();

        setForm(initialState);
    }

    return (
        <form className={styles.formContainer} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="email">Customer ID</label>
                <input
                    className={styles.input}
                    name="customerId"
                    value={form.customerId}
                    onChange={handleChange}
                />
            </div>
            <button className={styles.submitButton} type="submit">Submit</button>
        </form>
    )
}