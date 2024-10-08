"use client";
import { useRouter } from "next/navigation";
// src/app/gallery/page.tsx
import React, { useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();
  // Function to fetch image filenames from the uploads directory
  const fetchImages = async () => {
    const response = await fetch("/api/upload"); // Create a new API route for fetching images
    if (!response.ok) {
      throw new Error("Failed to fetch images");
    }
    return await response.json(); // Assuming the response is a JSON array of image paths
  };

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const imagePaths = await fetchImages();
        setImages(imagePaths);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      window.location.reload();
    }, 2000); // 2000 milliseconds = 2 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  if (loading) {
    return <p>Loading images...</p>;
  }

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 font-sans">
      {images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((src, index) => (
            <div key={index} className="border rounded overflow-hidden">
              <img
                src={`images/${src}`}
                alt={`Uploaded Image ${index + 1}`}
                className="w-full h-auto object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <p>No images available.</p>
      )}
    </div>
  );
};

export default Page;
