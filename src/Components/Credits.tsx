// AddFunds.tsx
import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { ToastContainer, toast } from 'react-toastify';
import { UserContext } from "../Context/UserContext";


export const Credits = ({ userId }: { userId: string }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [amount, setAmount] = useState(100);
    const [saveCard, setSaveCard] = useState(false);
    const [loading, setLoading] = useState(false);
    const { refreshData } = React.useContext(UserContext) || {};

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        if (!stripe || !elements) {
            return;
        }
        setLoading(true);

        const response = await fetch('http://127.0.0.1:5000/payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount, saveCard, user_id: userId }),
        });

        if (!response.ok) {
            setLoading(false);
            toast.error("Ha ocurrido un error al crear el intento de pago", {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: true,
            });
            return;
        }

        const { client_secret } = await response.json();

        console.log("Elements:", elements);
        console.log("CardElement:", elements?.getElement(CardElement));

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            setLoading(false);
            alert("Error al obtener el elemento de la tarjeta");
            return;
        }

        const result = await stripe.confirmCardPayment(client_secret, {
            payment_method: {
                card: cardElement,
            },
        });

        if (result.error) {
            toast.error("Error: " + result.error.message, {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: true,
            });
            setLoading(false);

        } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
            fetch('http://127.0.0.1:5000/create-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount, user_id: userId, intent_id: result.paymentIntent.id }),
            })
                .then(res => res.json())
                .then(data => {
                    if (data.status !== 'success') {
                        throw new Error(data.message || 'Error recording payment');
                    }

                    setLoading(false);
                    if (refreshData) {
                        refreshData(userId ? parseInt(userId, 10) : 0);
                    }

                    toast.success("Crédito agregado exitosamente", {
                        position: "top-right",
                        autoClose: 1000,
                        hideProgressBar: true,
                    });
                })
                .catch(err => {
                    console.error("Error recording payment:", err);
                    toast.error("Error al registrar el pago", {
                        position: "top-right",
                        autoClose: 1000,
                        hideProgressBar: true,
                    });
                    setLoading(false);
                });
        }

    }


    return (
        <>
            <ToastContainer />
            <div className="modal-generic-content" onClick={e => e.stopPropagation()}>
                <div className="modal-generic-header">
                    <h2>Agregar credito</h2>
                </div>
                <form className="credit-form" onSubmit={handleSubmit}>
                    <label>
                        Monto a agregar:
                        <input type="text" value={amount} onChange={(e) => { if (!isNaN(parseInt(e.target.value, 10))) setAmount(parseInt(e.target.value, 10)) }} required />
                    </label>
                    <label style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                        Número de tarjeta:
                        <CardElement options={{ hidePostalCode: false }} />
                    </label>
                    <label className="custom-checkbox-label">
                        <input
                            type="checkbox"
                            name="saveCard"
                            className="custom-checkbox-input"
                            checked={saveCard}
                            onChange={(e) => setSaveCard(e.target.checked)}
                        />
                        <span className="custom-checkbox-box"></span>
                        Guardar tarjeta para futuros pagos
                    </label>
                    <button type="submit" className="pay-btn" disabled={loading}>{loading ? 'Cargando...' : 'Agregar crédito'}</button>
                </form>
            </div>
        </>

    );
}