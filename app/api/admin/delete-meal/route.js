import { NextResponse } from 'next/server';
import { client } from '@/utils/sanity/client';
import { isAdmin } from '@/utils/lib/auth';

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId'); // Get productId from query parameters

    // Check if the user is an admin (authentication/authorization)
    if (!isAdmin(req.headers)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Step 1: Find all documents referencing the product using the `references()` function
    const references = await client.fetch(
      `*[references($productId)]{_id, _type}`, // Find all documents that reference the product
      { productId }
    );

    // Step 2: Unset the reference in each document
    if (references.length > 0) {
      await Promise.all(
        references.map(ref => {
          // Unset the reference field
          return client
            .patch(ref._id)
            .unset([`...[_ref == "${productId}"]`]) // Adjust this line based on your schema structure
            .commit();
        })
      );
    }

    // Step 3: Delete the target product
    await client.delete(productId);

    // Return a success response
    return NextResponse.json({ message: `Product with ID ${productId} deleted successfully.` }, { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    // Return an error response
    return NextResponse.json({ error: 'Failed to delete the product' }, { status: 500 });
  }
}
