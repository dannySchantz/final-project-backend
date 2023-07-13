import  express from 'express';
// import dotenv from 'dotenv';
import Stripe from 'stripe';
import bodyParser from 'body-parser';
import prisma from '../utils/prisma.js';

// dotenv.config();
const router = express.Router()
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
let checkoutSessionData = []



router.post('/', async (req, res) => {
    checkoutSessionData = req.body

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
    console.log(session)
    // res.redirect(303, session.url);
    return res.json(session.url)
  });

  router.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (request, response) => {
    const event = request.body;
  

    switch (event.type) {
        case 'payment_intent.succeeded':
        // Update the post in the database to set featured to true
        await prisma.post.update({
          where: {
            file: checkoutSessionData.file
          },
          data: {
            featured: true
          },
        })
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
      }
  
    response.status(200).end();
  });



export default router