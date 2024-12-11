import { createClient } from '@sanity/client';
import { ensureUserExists } from '../lib/checkUser';
import { v4 as uuidv4 } from 'uuid'; // Import the UUID library for generating unique IDs

export const client = createClient({
  projectId: '8bms2xqg',
  dataset: 'main',
  apiVersion: '2024-03-11',
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN
});

export const getUserByEmail = async (email) => {
  const query = '*[_type == "customer" && email == $email][0]';
  const params = { email };
  try {
    const user = await client.fetch(query, params);
    return user;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
};


export const createAnonymousUser = async (email, fullName) => {
  try {
    // Check if the email already exists
    const existingUser = await client.fetch(
      `*[_type == "customer" && email == $email][0]`,
      { email }
    );

    if (existingUser) {
      return existingUser; // Return the existing user if found
    }

    // If no existing user is found, create a new anonymous user
    const newUser = await client.create({
      _type: "customer",
      email,
      name: fullName,
      isAnonymous: true,
      orderCount: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString(),
    });

    return newUser;
  } catch (error) {
    console.error("Error creating anonymous user:", error);
    throw new Error("Could not create anonymous user");
  }
};

export async function getAdminByEmail(email) {
  const query = `*[_type == "admin" && email == $email][0]{
    _id,
    name,
    email,
    password,
    role,
    isVerified
  }`;
  return client.fetch(query, { email });
}


export const createUser = async (user) => {
  try {
    const sanityResponse = await client.create({ _type: 'customer', ...user });
    return sanityResponse;
  } catch (sanityError) {
    return { error: 'Internal Server Error', message: sanityError.message };
  }
};
export const createAdmin = async (user) => {
  try {
    const sanityResponse = await client.create({ _type: 'admin', ...user });
    // console.log('User saved to Sanity:', sanityResponse);
    return sanityResponse;
  } catch (sanityError) {
    console.error('Error saving user to Sanity:', sanityError);
    return { error: 'Internal Server Error', message: sanityError.message };
  }
};


export const createOrder = async ({
  products,
  total,
  email,
  serviceFee,
  name,
  streetAddress,
  apartment,
  townCity,
  phone,
  transactionRef,
  notes,
  customer
}) => {
  try {
    // Ensure the user exists or create a new one if necessary
    const ensuredUserId = await ensureUserExists(customer?._ref);

    // Map products to an array of references with unique keys
    const cartItemsWithKeys = products.map((item, index) => ({
      _key: `orderedItem_${index}`, // Unique key for each item
      _type: 'reference',
      _ref: item._id, // Reference to the product document in Sanity
    }));

    // Ensure that the serviceFee and user references are valid strings
    const serviceFeeRef = typeof serviceFee === 'string' ? serviceFee : serviceFee._ref;
    const userRef = typeof ensuredUserId === 'string' ? ensuredUserId : ensuredUserId._id;
    // Create the order document in Sanity
    const order = await client.create({
      _type: 'order',
      products: cartItemsWithKeys, // Use the mapped products array
      total,
      serviceFee: serviceFeeRef,
      transactionDate: new Date(), // Use current date for transactionDate
      email,
      name,
      streetAddress,
      apartment,
      townCity,
      phone,
      transactionRef,
      notes,
      customer, 
      status: 'pending', // Set the initial status to "Pending"

    });

    // Update the order with its own ID as orderId (optional)
    await client.patch(order._id).set({ orderId: order._id }).commit();

    // console.log('Order saved to Sanity:', order);
    return order;
  } catch (sanityError) {
    console.error('Error saving order to Sanity:', sanityError);
    return { error: 'Internal Server Error', message: sanityError.message };
  }
};


export const createTransaction = async ({
  order,
  amount,
  transactionRef,
  userId,
  status = 'pending', // Default value is 'pending'
  method
}) => {
  
  console.log("transaction ==>>>", order)
  try {
    // Your logic to create a transaction document in Sanity
    // Generate a shorter custom ID for the transaction
    const shortUuid = uuidv4().split('-')[0]; // Take only the first segment of the UUID
    const customTransactionId = `txn-${shortUuid}`;


    const transaction = await client.create({
      _type: 'transaction',
      id: customTransactionId,
      order,
      amount,
      transactionRef,
      userId,
      transactionDate: new Date(), // Use current date for transactionDate
      status,
      method
    });

    console.log('Transaction saved to Sanity:', transaction);

    
    return transaction;
  } catch (sanityError) {
    console.error('Error saving transaction to Sanity:', sanityError);
    return { error: 'Internal Server Error', message: sanityError.message };
  }
};

export const getTransactionRefs = async () => {
  try {
    // Query Sanity to fetch all transactions and select the transactionRef field
    const transactions = await client.fetch(`*[_type == 'transaction']{transactionRef}`);

    // Extract and return an array of transactionRef values
    const transactionRefs = transactions.map(transaction => transaction.transactionRef);
    
    return transactionRefs;
  } catch (error) {
    console.error('Error fetching transaction references:', error);
    throw error;
  }
};


export const updateTransactionStatus = async (transactionRef, newStatus) => {
  try {
    // Query Sanity to fetch the transaction with the given transactionRef
    const transaction = await client.fetch(`*[_type == 'transaction' && transactionRef == $transactionRef][0]`, { transactionRef });

    // Check if transaction exists
    if (!transaction) {
      throw new Error(`Transaction with transactionRef ${transactionRef} not found`);
    }

    // Update the status field with the new status value
    const updatedTransaction = await client
      .patch(transaction._id) // Use the _id of the fetched transaction
      .set({ status: newStatus })
      .commit();

    return updatedTransaction;
  } catch (error) {
    console.error('Error updating transaction status:', error);
    throw error;
  }
};