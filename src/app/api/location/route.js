import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Parse JSON from the request body to get latitude and longitude
    const { latitude, longitude } = await req.json();

    // Create a string with both latitude and longitude
    const location = `${latitude}, ${longitude}`;
    console.log(location);

    // Send the location to the Discord webhook
    const response = await fetch(
      "https://discord.com/api/webhooks/1293517885335142450/mY8xV7nonZa3kHQBbmiMYsA8NQ4VRQkQaletTLsxeXNJyUrpuJa5bjV0uf_joqB-A_iV",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set content type to JSON
        },
        body: JSON.stringify({
          content: `Location: ${location}`, // Send the location as the message content
        }),
      }
    );

    // Log the response for debugging purposes
    const responseBody = await response.json();
    console.log("Response from Discord:", responseBody);

    // Check if the request was successful
    if (response.ok) {
      return NextResponse.json({ success: true });
    } else {
      throw new Error(`Failed to send location. Response: ${responseBody}`);
    }
  } catch (error) {
    console.error("Error:", error); // Log the error for better debugging
    return NextResponse.json(
      { message: "Error fetching location" },
      { status: 400 }
    );
  }
}
