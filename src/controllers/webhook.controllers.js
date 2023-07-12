import express from 'express'
import bcrypt from "bcryptjs"
import prisma from "../utils/prisma.js"
import Stripe from 'stripe';
import bodyParser from 'body-parser';
import { EventEmitter } from 'events';

const router = express.Router()
const endpointSecret = 'whsec_da741a95d3ec738358fe817682cd5aaba76151639e2da4d77023b9f4d8104fa2';
const eventEmitter = new EventEmitter();



const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const fulfillOrder = (lineItems) => {
    // TODO: fill me in
    console.log("Fulfilling order", lineItems);
  }

router.post('/webhook', bodyParser.raw({type: 'application/json'}), async (request, response) => {
const payload = request.body;
const sig = request.headers['stripe-signature'];

let event;

try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
} catch (err) {
    return response.status(400).send(`Webhook Error: ${err.message}`);
}

// Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
    // Retrieve the session. If you require line items in the response, you may include them by expanding line_items.
    const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
    event.data.object.id,
    {
        expand: ['line_items'],
    }
    );
    const lineItems = sessionWithLineItems.line_items;

    eventEmitter.emit('checkoutCompleted', sessionWithLineItems);
    // document.dispatchEvent(new Event('checkoutCompleted'));

    fulfillOrder(lineItems);
    }

    response.status(200).end();
});

export { router as default, eventEmitter };