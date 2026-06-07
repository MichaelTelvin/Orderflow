import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { createOrder } from '../api/orders.js';

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
        const response = await createOrder(form);
        console.log(response)
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                name="customerId"
                value={form.customerId}
                onChange={handleChange}
            />
            <button type="submit">Submit</button>
        </form>
    )

}