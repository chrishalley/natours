import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

import { showAlert } from './alerts';

/* eslint-disable */

export const bookTour = async tourId => {
  try {
    const stripe = await loadStripe('pk_test_Q2uIPat3JzdBlAYwytp9OcaG');
    // 1) Get the checkout session from API
    const session = await axios(
      `http://localhost:8000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log({ session });
    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (e) {
    console.log(e);
    showAlert('error', err);
  }
};
