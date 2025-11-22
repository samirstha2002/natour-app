import axios from 'axios';
import { showAlert } from './alert';

export const bookTour = async (tourId) => {
  const stripe = Stripe(
    'pk_test_51SVpHG9DzqTWbDKcXssPn7oRfxdCdpfw4HuTQhGabXKWcDia9a2kBlKpqjXzDTx0d0KAplfejpBqN68h8ZkEatFS00I6ZcPuto',
  );
  try {
    //1 GET CHECKOUT SESSION FROM API
    const session = await axios(
      `http://127.0.0.1:8000/api/v1/bookings/checkout-session/${tourId}`,
    );
    //2) CREATE CHECKOUT +CHANRE CREDIT CARD
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
    console.log(session);
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
  //2) CREATE CHECKOUT +CHANRE CREDIT CARD
};
