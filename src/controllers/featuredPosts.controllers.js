import  express from 'express';
// import dotenv from 'dotenv';
import Stripe from 'stripe';
// import auth from '../middlewares/auth.js';

// dotenv.config();
const router = express.Router()
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: "Feature Your Post!",
            },
            unit_amount: 1000
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      payment_method_types: ['card'],
      success_url: 'http://localhost:5173/featured/success',   
      cancel_url: 'http://localhost:5173/featured/cancel',
    });
  
    // res.redirect(303, session.url);
    return res.json(session.url)
  });

export default router