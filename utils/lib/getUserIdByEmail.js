import { client } from "../sanity/client";

export async function getUserIdByEmail(email) {
  try {
    const query = `*[_type == "customer" && email == $email][0] {
      _id,
      email,
      password // Ensure you include password if stored
    }`;
    const params = { email };

    const user = await client.fetch(query, params);
    return user;
  } catch (error) {
    console.error('Error fetching user by email:', error);  // Log the error for debugging
    throw new Error('Error fetching user');
  }
}
export async function getAdminIdByEmail(email) {
  try {
    const query = `*[_type == "admin" && email == $email][0] {
      _id,
      email,
      password // Ensure you include password if stored
    }`;
    const params = { email };

    const user = await client.fetch(query, params);
    return user;
  } catch (error) {
    console.error('Error fetching user by email:', error);  // Log the error for debugging
    throw new Error('Error fetching user');
  }
}
