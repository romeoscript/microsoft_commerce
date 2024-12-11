import { verifyPaystackPayment } from "@/utils/lib/verify";
import { updateTransactionStatus } from "@/utils/sanity/client";

export const dynamic = "force-dynamic";
export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const trxref = searchParams.get('trxref');

    const isPaymentVerified = await verifyPaystackPayment(trxref);
    const newStatus = isPaymentVerified ? 'success' : 'failure';

    await updateTransactionStatus(trxref, newStatus);

    if (!isPaymentVerified) {
      return new Response(JSON.stringify({ error: 'Payment verification failed' }), { status: 400 });
    }

    return new Response(JSON.stringify({ success: true, message: "Payment verified" }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
