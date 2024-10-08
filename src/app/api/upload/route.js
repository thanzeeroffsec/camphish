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

    // Wait for the writable stream to finish before changing ownership and permissions
    writableStream.on("finish", () => {
      try {
        // Change ownership of the file (replace with the correct user and group IDs)
        fs.chownSync(filePath, 1000, 1000); // Adjust user and group IDs as needed

        // Set file permissions to be readable by others (644)
        fs.chmodSync(filePath, "644");

        console.log("File permissions and ownership updated.");
      } catch (permissionError) {
        console.error(
          "Error setting file permissions or ownership:",
          permissionError
        );
      }
    });

    writableStream.end();

    return NextResponse.json({
      message: "File uploaded successfully",
      file: { path: `/images/${path.basename(filePath)}` },
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { message: "Error uploading file" },
      { status: 500 }
    );
  }
}

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
