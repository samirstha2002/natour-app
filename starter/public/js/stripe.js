import axios from 'axios';

export const bookTour = async (tourId) => {
  const stripe = Stripe(
    'pk_test_51SVpHG9DzqTWbDKcXssPn7oRfxdCdpfw4HuTQhGabXKWcDia9a2kBlKpqjXzDTx0d0KAplfejpBqN68h8ZkEatFS00I6ZcPuto',
  );
  //1 GET CHECKOUT SESSION FROM API
  const session = await axios(
    `http://127.0.0.1:8000/api/v1/bookings/checkout-session/${tourId}`,
  );
  console.log(stripe)
  console.log(session);
  //2) CREATE CHECKOUT +CHANRE CREDIT CARD
};
