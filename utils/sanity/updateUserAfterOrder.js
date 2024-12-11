import { client } from "./client";
import { v4 as uuidv4 } from 'uuid';

export async function updateUserAfterOrder(userId, amount, order, isSuccess = true) {
  try {
    // Check if the user document exists
    const existingUser = await client.getDocument(userId);

    if (existingUser) {
      // If the user exists, update the document by appending the new order
 const updatedUser = await client
  .patch(userId)
  .setIfMissing({
    orders: [],
    orderCount: 0,
    totalSpent: 0,
  }) // Ensure the fields are present
  .append('orders', [{ _type: 'reference', _ref: order._id, _key: uuidv4() }]) // Append the order reference
  .inc({
    orderCount: 1, // Increment order count by 1
    totalSpent: isSuccess ? amount : 0, // Increment total spent by the amount if successful
  })
  .commit();

      return updatedUser;
    } else {
      // If the user does not exist, create a new user document with the provided data
     

      return null;
    }
  } catch (error) {
    console.error('Error updating or creating user:', error);
    throw new Error('Failed to update or create user after order');
  }
}


export async function updateTransaction(customerId, transaction) {
  try {
    const response = await client
      .patch(customerId) // ID of the customer to update
      .append('transactions', [{ _type: 'reference', _ref: transaction._id, _key: uuidv4()  }]) // Add transaction reference to the array
      .commit(); // Commit the changes
  } catch (error) {
    console.error('Error updating customer transactions:', error);
    throw error;
  }
}


// import { client } from "./client";
// import { v4 as uuidv4 } from 'uuid';

// export async function createOrUpdateUserAfterOrder(userId, amount, order, isSuccess = true) {
//   try {
//     // Check if the user document already exists
//     const existingUser = await client.fetch(`*[_type == "user" && _id == $userId][0]`, { userId });

//     if (existingUser) {
//       // If the user exists, update the document
//       const updatedUser = await client
//         .patch(userId)
//         .setIfMissing({ orders: [], orderCount: 0, totalSpent: 0 }) // Ensure fields are present
//         .append('user', [{ _type: 'reference', _ref: userId, _key: uuidv4() }]) // Append the user reference
//         .commit();

//       console.log('User document updated successfully:', updatedUser);
//       return updatedUser;
//     } else {
//       // If the user does not exist, create a new user document
//       const newUser = await client.create({
//         _id: userId, // Use the provided userId
//         _type: 'user',
//         orders: [{ _type: 'reference', _ref: order._id, _key: uuidv4() }], // Initialize orders array with the new order
//         orderCount: 1, // Set initial order count
//         totalSpent: isSuccess ? amount : 0, // Set initial total spent
//       });

//       console.log('User document created successfully:', newUser);
//       return newUser;
//     }
//   } catch (error) {
//     console.error('Error creating or updating user:', error);
//     throw new Error('Failed to create or update user after order');
//   }
// }
