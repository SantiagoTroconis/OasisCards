import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './Router/router'
import { RouterProvider } from 'react-router-dom'
import { UserProvider } from './Context/UserContext'
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe('pk_test_51SAYedDKDJ3g0Pb4HxwNHyvU6WlSygoP3Vq81oz5zekh6ZbTETc8DFDOcy5LYCXH6S50VlZL71fAM06z8i8TL4Gb00zfx8kK2b');



createRoot(document.getElementById('root')!).render(
    <UserProvider>
        <Elements stripe={stripePromise}>
            <StrictMode>
                <RouterProvider router={router} />
            </StrictMode>
        </Elements>
    </UserProvider>
)
