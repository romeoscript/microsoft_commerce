import { isAdmin } from "@/utils/lib/auth";
import { client } from "@/utils/sanity/client";
import { NextResponse } from "next/server";

export async function POST(req) {
  if (!isAdmin(req.headers)) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { location, fee } = await req.json();

    // Check if the location name already exists
    const existingServiceFee = await client.fetch(
      `*[_type == "serviceFee" && location == $location][0]`,
      { location }
    );

    if (existingServiceFee) {
      return new Response(
        JSON.stringify({ error: "Location name already exists" }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Create the new service fee
    const newServiceFee = await client.create({
      _type: "serviceFee",
      location,
      fee,
    });

    return NextResponse.json(newServiceFee);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create service fee" },
      { status: 500 }
    );
  }
}
