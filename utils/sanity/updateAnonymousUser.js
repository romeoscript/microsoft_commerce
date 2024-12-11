import { client } from "./client";

export async function updateAnonymousUserAfterOrder(userId, amount, order, success) {
  try {
    // Update order count and total spent for anonymous user
    if (success) {
      await client
        .patch(userId)
        .setIfMissing({ orderCount: 0, totalSpent: 0, orders: [] })
        .inc({ orderCount: 1, totalSpent: amount })
        .append('orders', [{ _type: 'reference', _ref: order._id }])
        .commit();
    } else {
      await client
        .patch(userId)
        .inc({ orderCount: 1 }) // Even if failed, increment order count
        .commit();
    }
  } catch (error) {
    console.error('Error updating anonymous user after order:', error);
  }
}
