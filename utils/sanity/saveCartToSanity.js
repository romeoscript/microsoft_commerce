// import { client } from "./client";

// export const saveCartToSanity = async (cartItems, userId) => {
//   try {
//     // Check if the cart document already exists
//     const existingCart = await client.getDocument(userId);

//     if (existingCart) {
//       // If it exists, update the document using patch
//       const response = await client
//         .patch(userId)
//         .set({
//           items: cartItems.map((item) => ({
//             _type: 'cartItem',
//             dish: {
//               _type: 'reference',
//               _ref: item._id,
//             },
//             quantity: item.quantity,
//             price: item.price,
//           })),
//         })
//         .commit();
//       return response;
//     } else {
//       // If it doesn't exist, create a new document
//       const response = await client.create({
//         _type: 'cart',
//         _id: userId, // Use the logged-in user's ID
//         customer: {
//           _type: 'reference',
//           _ref: userId,
//         },
//         items: cartItems.map((item) => ({
//           _type: 'cartItem',
//           dish: {
//             _type: 'reference',
//             _ref: item._id,
//           },
//           quantity: item.quantity,
//           price: item.price,
//         })),
//       });
//       return response;
//     }
//   } catch (error) {
//     console.error('Error saving cart to Sanity:', error);
//   }
// };
import { client } from "./client";

export const saveCartToSanity = async (cartItems, userId) => {
  try {
    const response = await client.create({
                _type: 'cart',
                _id: userId, // Use the logged-in user's ID
                // customer: {
                //   _type: 'reference',
                //   _ref: userId,
                // },
                items: cartItems.map((item) => ({
                  _type: 'cartItem',
                  dish: {
                    _type: 'reference',
                    _ref: item._id,
                  },
                  quantity: item.quantity,
                  price: item.price,
                })),
              });
              return response;
  } catch (error) {
    console.error('Error saving cart to Sanity:', error);
  }
};
