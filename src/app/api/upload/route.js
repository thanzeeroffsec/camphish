// src/app/api/upload/route.ts
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const uploadDir = path.join(process.cwd(), "public", "images");

// Create the uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Ensure recursive for deep folders
}
// export async function POST(req) {
//   try {
//     // Get the form data from the request
//     const formData = await req.formData();
//     const file = formData.get("image");

//     if (!file) {
//       return NextResponse.json(
//         { message: "No file uploaded" },
//         { status: 400 }
//       );
//     }

//     const filePath = path.join(
//       uploadDir,
//       `image-${Date.now()}${path.extname(file.name)}`
//     );

//     // Create a writable stream to save the file
//     const writableStream = fs.createWriteStream(filePath);

//     // Use the FileStream API to read the file and pipe it to the writable stream
//     const reader = file.stream().getReader();

//     let result;
//     while (!(result = await reader.read()).done) {
//       writableStream.write(Buffer.from(result.value));
//     }

//     // Wait for the writable stream to finish before changing ownership and permissions
//     writableStream.on("finish", () => {
//       try {
//         // Change ownership of the file (replace with the correct user and group IDs)
//         fs.chownSync(filePath, 1000, 1000); // Adjust user and group IDs as needed

//         // Set file permissions to be readable by others (644)
//         fs.chmodSync(filePath, "644");

//         console.log("File permissions and ownership updated.");
//       } catch (permissionError) {
//         console.error(
//           "Error setting file permissions or ownership:",
//           permissionError
//         );
//       }
//     });

//     writableStream.end();

//     return NextResponse.json({
//       message: "File uploaded successfully",
//       file: { path: `/images/${path.basename(filePath)}` },
//     });
//   } catch (error) {
//     console.error("Error uploading file:", error);
//     return NextResponse.json(
//       { message: "Error uploading file" },
//       { status: 500 }
//     );
//   }
// }

// export async function GET() {
//   try {
//     const files = fs.readdirSync(uploadDir);
//     const imageFiles = files.filter((file) =>
//       /\.(jpeg|jpg|png|gif)$/.test(file)
//     ); // Filter for image files

//     const imagePaths = imageFiles.map((file) => `/${file}`); // Create paths relative to the public directory

//     return NextResponse.json(imagePaths);
//   } catch (error) {
//     console.error("Error reading image directory:", error);
//     return NextResponse.json(
//       { message: "Error fetching images" },
//       { status: 500 }
//     );
//   }
// }
const requestQueue = [];
const RATE_LIMIT_TIME = 2000; // 2 seconds in milliseconds
const MAX_REQUESTS = 5;

export async function POST(req) {
  try {
    // Rate limiting logic
    const currentTime = Date.now();

    // Remove outdated requests from the queue (older than 2 seconds)
    while (
      requestQueue.length &&
      requestQueue[0] < currentTime - RATE_LIMIT_TIME
    ) {
      requestQueue.shift();
    }

    if (requestQueue.length >= MAX_REQUESTS) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    // Add current request time to the queue
    requestQueue.push(currentTime);

    // Handle form data and file upload
    const formData = await req.formData();
    const file = formData.get("image");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "No valid image file provided." },
        { status: 400 }
      );
    }

    // Prepare formData to send to Discord webhook
    const discordFormData = new FormData();
    discordFormData.append("file", file, file.name); // Make sure to send the file with its name
    discordFormData.append("content", `New image uploaded: ${file.name}`);

    const response = await fetch(
      "https://discord.com/api/webhooks/1293438586250592279/-_D6GJBPGWpvcl3dbv-gGrrFzN9ndzoW3ExscuCU2wp5R1JjMFCtrIK2_QG9zsGCwwzk",
      {
        method: "POST",
        body: discordFormData, // Automatically sets multipart/form-data
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to send image to Discord." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Image successfully uploaded to Discord.",
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
