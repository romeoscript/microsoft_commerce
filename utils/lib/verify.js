import axios from "axios";
import { updateTransactionStatus } from "../sanity/client";
// import { updateTransactionStatus } from "./client";

export const verifyPaystackPayment = async (trxref) => {
  try {
    const paystackApiUrl = `https://api.paystack.co/transaction/verify/${trxref}`;
    const response = await axios.get(paystackApiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY}`,
      },
    });

    const responseData = response.data;
    // console.log('Paystack Verification Response:', trxref, response.data);

    // Handle specific error cases
    if (!responseData.status || !responseData.data) {
      console.error('Invalid response from Paystack:', responseData);
      return false;
    }

    if (responseData.data.status === 'success') {
      await updateTransactionStatus(trxref, "success");
      return true; // Payment is successfully verified
    } else if (responseData.data.status === 'failed') {
      await updateTransactionStatus(trxref, "success");

      console.error('Payment verification failed:', responseData.data.gateway_response);
      return false;
    } else {
      console.error('Unexpected status from Paystack:', responseData.data.status);
      return false;
    }
  } catch (error) {
    if (error.response) {
      // The request was made, but the server responded with an error status
      console.error('Paystack server error:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from Paystack');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up the request:', error.message);
    }

    return false; // Payment verification failed
  }
};
