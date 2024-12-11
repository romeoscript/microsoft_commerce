import { client } from "../sanity/client";

export async function getUserById(id) {
  const query = `*[_type == "user" && _id == $id][0]`;
  const params = { id };
  const user = await client.fetch(query, params);
  return user;
}
