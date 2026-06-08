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

export const CreateOrderForm = () => {
    const [form, setForm] = useState<OrderForm>({
        customerId: '',
        items: [{ sku: "TEST-SKU", quantity: 1 }]
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setForm(prev => ({
            ...prev, [name]: value
        }));
    };

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        await createOrder(form);
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