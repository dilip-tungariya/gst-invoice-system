const axios = require("axios");
require("dotenv").config();

// Function to simulate encryption
function encrypt(data, key) {
  return crypto.createHmac("sha256", key).update(data).digest("hex");
}

// get otp
async function getOTP() {
  return new Promise((resolve, reject) => {
    try {
      axios.post(
        `${process.env.GST_API_URL}/authenticate/otp`,
        {
          action: "OTPREQUEST",
          username: process.env.API_KEY,
          app_key: encrypt("EK(32bit UUID)", process.env.GST_PUBLIC_KEY),
        },
      ).then((response) => {
        resolve(response.data.status_cd);
      });
    } catch (error) {
      reject("Failed to authenticate");
    }
  });
}

// Authenticate and get access token
async function getAuthToken(otp) {
  return new Promise((resolve, reject) => {
    try {
      getOTP()
        .then(async (result) => {
          if (result === 1) {
            const response = await axios.post(
              `${process.env.GST_API_URL}/authenticate`,
              {
                action: "AUTHTOKEN",
                username: process.env.API_KEY,
                app_key: encrypt("EK(32bit UUID)", process.env.GST_PUBLIC_KEY),
                otp: encrypt(otp, process.env.API_SECRET),
              },
            );
            resolve(response.data.auth_token);
          } else {
            reject("Failed to authenticate");
          }
        })
        .catch((error) => {
          reject("Failed to authenticate");
        });
    } catch (error) {
      reject("Failed to authenticate");
    }
  });
}

async function fileGST(invoiceData) {
  try {
    const authToken = await getAuthToken();
    const gstData = {
      bookingId: invoiceData.bookingId,
      name: invoiceData.name,
      totalAmount: invoiceData.totalAmount,
      gstAmount: invoiceData.gstDetails.gstAmount,
      IGST: invoiceData.gstDetails.IGST,
      CGST: invoiceData.gstDetails.CGST,
      SGST: invoiceData.gstDetails.SGST,
      grandTotal: invoiceData.gstDetails.grandTotal,
    };
    const response = await axios.post(
      `${process.env.GST_API_URL}/returns/gstr1`,
      gstData,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    return error;
  }
}

module.exports = { fileGST };
