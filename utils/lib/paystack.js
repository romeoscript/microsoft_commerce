import axios from "axios";

const generateTransactionRef = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};
export const initializePaystack = async (email, amount) => {
  
  try {
    if (!amount) {
      throw new Error("Amount is required.");
    }

    if (isNaN(amount) || parseInt(amount, 10) !== amount) {
      throw new Error("Amount must be a valid number.");
    }

    if (amount <= 0) {
      throw new Error("Amount must be a positive number.");
    }

    // Ensure amount is in kobo (smallest currency unit)
    const amountInKobo = parseInt(amount, 10) * 100;
    const transactionRef = generateTransactionRef(7);

    // Log for potential debugging

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100,
        reference: `Euodia-${transactionRef}`,
        // callback_url: callbackUrl,

      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = response.data.data;
    return { data };
  } catch (error) {
    console.error("Paystack initialization error:", error);
    throw error; // Re-throw for handling in your application
  }
};
