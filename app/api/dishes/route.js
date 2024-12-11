import { NextResponse } from 'next/server';
import { client } from '@/utils/sanity/client';

export async function GET(req) {
  try {
    // Define the query to fetch all dishes
    const query = `*[_type == "dish" && !(_id in path("drafts.*"))] | order(sortOrder asc) {
        _id,
        title,
        slug,
        description,
        price,
        category->{
          title
        },
        status,
        sortOrder,
        image {
          asset->{
            url
          }
        }
      }`;
  

    // Fetch dishes from Sanity
    const dishes = await client.fetch(query);
    return new NextResponse(JSON.stringify({ data: dishes }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching dishes:', error); // Improved error logging
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
