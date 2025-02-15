import './style.css'
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Create a Klarna payment session
app.post('/create-klarna-session', async (req, res) => {
    const response = await axios.post(
        'https://api.playground.klarna.com/payments/v1/sessions',
        {
            purchase_country: 'SE',
            purchase_currency: 'SEK',
            locale: 'sv-SE',
            order_amount: 10000, // 100 SEK
            order_tax_amount: 2000, // 20 SEK
            order_lines: [
                {
                    name: 'Product Name',
                    quantity: 1,
                    unit_price: 10000,
                    tax_rate: 2500, // 25%
                    total_amount: 10000,
                    total_tax_amount: 2000,
                }
            ]
        },
        {
            auth: {
                username: 'YOUR_USERNAME',
                password: 'YOUR_PASSWORD'
            }
        }
    );

    res.json({
        client_token: response.data.client_token,
        payment_session_id: response.data.session_id
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));