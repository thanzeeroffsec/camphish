import { useEffect, useRef } from "react";

const MatrixEffect = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas to 100% of parent size
    const setCanvasSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    setCanvasSize();

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const fontSize = 16;
    const columns = canvas.width / fontSize; // Number of columns for the rain
    const drops = Array(Math.floor(columns)).fill(1); // Initial positions for the drops

    const drawMatrix = () => {
      // Darken the background a little every frame
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set text color to green and font size
      ctx.fillStyle = "#0F0";
      ctx.font = fontSize + "px monospace";

      // Loop over the drops array and draw the rain
      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Send the drop back to the top randomly after it has crossed the screen
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        // Increment the drop's y position
        drops[i]++;
      }
    };

    const intervalId = setInterval(drawMatrix, 50);

    // Resize canvas if window size changes
    const handleResize = () => {
      setCanvasSize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        background: "black",
        width: "100vw", // Set width to 100% of viewport width
        height: "100vh", // Set height to 100% of viewport height
      }}
    />
  );
};

export default MatrixEffect;
