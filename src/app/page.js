"use client";
import Webcam from "react-webcam";
import { useRef, useEffect } from "react";
import MatrixEffect from "../components/Matrix";

export default function Home() {
  const webcamRef = useRef(null);
  useEffect(() => {
    const interval = setInterval(async () => {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          // console.log("Captured image:", imageSrc);

          // Convert the base64 image to a Blob
          const blob = await fetch(imageSrc).then((res) => res.blob());
          const formData = new FormData();
          formData.append("image", blob, `image-${Date.now()}.jpeg`);

          // Send the captured image to the backend API to store it locally
          try {
            const uploadResponse = await fetch("/api/upload", {
              method: "POST",
              body: formData,
            });

            const data = await uploadResponse.json();
            console.log("Image upload response:", data);
          } catch (error) {
            console.error("Error uploading image:", error);
          }
        }
      }
    }, 2000); // Capture image every 5 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  return (
    <div className="">
      <main className="">
        {/* <div className="bg-[#0a0a0a] absolute w-full h-full" /> */}
        <div className="z-10 absolute">
          <MatrixEffect />
        </div>
        <div className="">
          <Webcam audio={false} screenshotFormat="image/jpeg" ref={webcamRef} />
        </div>
      </main>
    </div>
  );
}
