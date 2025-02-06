const express = require('express');
const crypto = require('crypto');
const app = express();
require('dotenv').config();

app.use(express.json());

// Sample keys (Replace with actual secure keys in production)
const GST_PUBLIC_KEY = process.env.GST_PUBLIC_KEY;
const SECRET_KEY = process.env.SECRET_KEY; // Used for HMAC signing

// Function to simulate encryption
function encrypt(data, key) {
    return crypto.createHmac('sha256', key).update(data).digest('hex');
}

// OTP Request
app.post('/authenticate/otp', (req, res) => {
    if (req.body.action === 'OTPREQUEST') {
        return res.json({ status_cd: 1 });
    }
    res.status(400).json({ error: 'Invalid request' });
});

// Authenticate with OTP
app.post('/authenticate', (req, res) => {
    if (req.body.action === 'AUTHTOKEN') {
        return res.json({
            status_cd: 1,
            auth_token: encrypt('auth_token_value', SECRET_KEY),
            expiry: 120,
            SEK: encrypt('EK(32bit UUID)', GST_PUBLIC_KEY)
        });
    }
    res.status(400).json({ error: 'Invalid request' });
});

// GSTR1 Return Filing
app.put('/returns/gstr1', (req, res) => {
    const { token, action, data } = req.body;
    if (!token || action !== 'RETSAVE') {
        return res.status(400).json({ error: 'Invalid request' });
    }
    return res.json({
        status_cd: 1,
        data: encrypt(data, SECRET_KEY),
        rek: encrypt('rek_value', SECRET_KEY),
        hmac: encrypt('Base64_encoded_data', SECRET_KEY)
    });
});

// Refresh Token
app.post('/authenticate/refresh', (req, res) => {
    if (req.body.action === 'REFRESHTOKEN') {
        return res.json({
            status_cd: 1,
            auth_token: encrypt('new_auth_token_value', SECRET_KEY),
            expiry: 120,
            SEK: encrypt('EK(32bit UUID)', GST_PUBLIC_KEY)
        });
    }
    res.status(400).json({ error: 'Invalid request' });
});

module.exports = app;