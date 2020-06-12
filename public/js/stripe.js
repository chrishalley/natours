import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

import { showAlert } from './alerts';

/* eslint-disable */

export const bookTour = async tourId => {
  try {
    const stripe = await loadStripe('pk_test_Q2uIPat3JzdBlAYwytp9OcaG');
    // 1) Get the checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (e) {
    showAlert('error', e);
  }
};
