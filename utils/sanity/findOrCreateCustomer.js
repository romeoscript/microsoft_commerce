import { client } from "./client";
import { v4 as uuidv4 } from 'uuid';

export async function findOrCreateCustomerByEmail(email, customerDetails) {

  try {
    // Step 1: Check if the customer already exists by email
    const query = `*[_type == "customer" && email == $email][0]`;
    const existingCustomer = await client.fetch(query, { email });
    // Step 2: If the customer exists, return the customer
    if (existingCustomer) {
      return existingCustomer;
    }

    // Step 3: If no customer exists, create a new customer document
    const newCustomer = {
      _type: "customer",
      _id: uuidv4(),
      email,
      ...customerDetails, // Spread other customer details if needed
    };

    const createdCustomer = await client.create(newCustomer);
    return createdCustomer;
  } catch (error) {
    console.error('Error finding or creating customer:', error);
    throw new Error('Error finding or creating customer');
  }
}
