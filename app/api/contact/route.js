import sendMail from "@/utils/lib/sendMail";
import { client } from "@/utils/sanity/client";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, message, phone } = await req.json();
    const formattedEmail = email.toLowerCase();
    if (!name || !formattedEmail || !message || !phone) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // 1. Create a new contact document in Sanity
    const newContact = {
      _type: "contact",
      name,
      email: formattedEmail,
      message,
      phone,
      submittedAt: new Date().toISOString(),
    };

    await client.create(newContact);

    // 2. Send an email to the company
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://res.cloudinary.com/dj3zrsni6/image/upload/v1724296732/logo_nc1i4s.svg" alt="Euodia whole foods Logo" style="max-width: 150px;" />
        </div>

        <div style="padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">New Contact Form Submission</h2>
          <hr style="border: 1px solid #ddd; margin: 20px 0;" />
          <p style="font-size: 16px;"><strong>Name:</strong> ${name}</p>
          <p style="font-size: 16px;"><strong>Email:</strong> ${formattedEmail}</p>
          <p style="font-size: 16px;"><strong>Phone:</strong> ${phone}</p>
          <p style="font-size: 16px;"><strong>Message:</strong></p>
          <div style="background-color: #fff; padding: 15px; border-radius: 8px; border: 1px solid #ddd;">
            <p style="font-size: 14px;">${message}</p>
          </div>
          <p style="font-size: 14px; color: #999; margin-top: 20px; text-align: center;">
            Submitted at: ${new Date().toLocaleString()}
          </p>
        </div>

        <div style="text-align: center; margin-top: 20px; color: #999;">
          <p style="font-size: 14px;">&copy; ${new Date().getFullYear()} Euodia Whole Foods. All rights reserved.</p>
          <p style="font-size: 14px;">Lagos | Phone: +234 703 335 6847 | <a href="mailto:seuodiawholefoods.dish@gmail.com" style="color: #28a745;">euodiawholefoods.dish@gmail.com</a></p>
        </div>
      </div>
    `;

    await sendMail(formattedEmail, "New Contact Form Submission", htmlContent);

    return NextResponse.json(
      { message: "Contact form submitted successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
