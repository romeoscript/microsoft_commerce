// pages/api/categories.js
import { client } from "@/utils/sanity/client";
import { isAdmin } from "@/utils/lib/auth";
import slugify from "slugify";

export async function POST(req) {
  const { title, description } = await req.json();

  if (!isAdmin(req.headers)) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Generate slug
  const slug = typeof title === 'string' ? { _type: 'slug', current: slugify(title, { lower: true }) } : { _type: 'slug', current: 'default-slug' };

  try {
    // Check if category with the same title or slug already exists
    const existingCategory = await client.fetch(
      `*[_type == "category" && (title == $title || slug.current == $slug)]`,
      { title, slug: slug.current }
    );

    if (existingCategory.length > 0) {
      return new Response(JSON.stringify({ error: "Category already exists" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create new category
    const newCategory = await client.create({
      _type: "category",
      title,
      description,
      slug,
      status: true
    });

    return new Response(JSON.stringify({ data: newCategory }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET() {
  try {
    const categories = await client.fetch(`*[_type == "category" && status == true]{
      _id,
      title,
      description,
      slug,
    }`);

    return new Response(JSON.stringify({ categories }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
