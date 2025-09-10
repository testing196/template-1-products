import { NextResponse } from 'next/server';

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';
const PAYPAL_API_URL = process.env.NEXT_PUBLIC_PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';

// Generate an access token for PayPal API
async function generateAccessToken() {
  try {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${auth}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error(`PayPal token request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Failed to generate PayPal access token:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { items, total, intent = 'CAPTURE' } = await request.json();

    // Create order data using the Orders API format
    const orderData = {
      intent: intent === 'AUTHORIZE' ? 'AUTHORIZE' : 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: total.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: total.toFixed(2),
              },
            },
          },
          items: items.map((item: any) => ({
            name: item.product.name,
            description: item.product.description.substring(0, 127), // PayPal limits description to 127 chars
            quantity: item.quantity.toString(),
            unit_amount: {
              currency_code: 'USD',
              value: item.product.price.toFixed(2),
            },
          })),
        },
      ],
      application_context: {
        brand_name: 'Your Store',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/order-success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout`,
      },
    };

    try {
      const accessToken = await generateAccessToken();
      const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('PayPal API error:', errorData);
        return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 });
      }

      const order = await response.json();
      return NextResponse.json({ id: order.id });
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in create-order API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}