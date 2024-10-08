// src/app/api/upload/route.ts
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const uploadDir = path.join(process.cwd(), "public", "images");

// Create the uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Ensure recursive for deep folders
}
export async function POST(req) {
  try {
    // Get the form data from the request
    const formData = await req.formData();
    const file = formData.get("image");

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    const filePath = path.join(
      uploadDir,
      `image-${Date.now()}${path.extname(file.name)}`
    );

    // Create a writable stream to save the file
    const writableStream = fs.createWriteStream(filePath);

    // Use the FileStream API to read the file and pipe it to the writable stream
    const reader = file.stream().getReader();

    let result;
    while (!(result = await reader.read()).done) {
      writableStream.write(Buffer.from(result.value));
    }

    writableStream.end();

    // Set file permissions to ensure it's accessible
    fs.chmodSync(filePath, "644"); // Readable by others

    return NextResponse.json({
      message: "File uploaded successfully",
      file: { path: `/images/${path.basename(filePath)}` }, // Accessible path from public folder
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { message: "Error uploading file" },
      { status: 500 }
    );
  }
}
// src/app/api/images/route.ts

export async function GET() {
  try {
    const files = fs.readdirSync(uploadDir);
    const imageFiles = files.filter((file) =>
      /\.(jpeg|jpg|png|gif)$/.test(file)
    ); // Filter for image files

    const imagePaths = imageFiles.map((file) => `/${file}`); // Create paths relative to the public directory

    return NextResponse.json(imagePaths);
  } catch (error) {
    console.error("Error reading image directory:", error);
    return NextResponse.json(
      { message: "Error fetching images" },
      { status: 500 }
    );
  }
}
