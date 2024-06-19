import React, { useRef, useEffect } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import "./App.css";
import { drawHand } from "./uitls";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  // const cursorRef = useRef(null);

  const runHandpose = async () => {
    const net = await handpose.load();
    console.log("Handpose model loaded.");
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 100);
  };

  const detect = async (net) => {
    // Check if data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const hand = await net.estimateHands(video);
      console.log(hand);

      const ctx = canvasRef.current.getContext("2d");
      drawHand(hand, ctx);

      // Handle fingertip cursor
      // if (hand.length > 0) {
      //   const indexFingerTip = hand[0].landmarks[8];
      //   console.log(indexFingerTip);

      //   const ctx = canvasRef.current.getContext("2d");
      //   ctx.beginPath();
      //   ctx.arc(indexFingerTip[0], indexFingerTip[1], 5, 0, 2 * Math.PI);
      //   ctx.fillStyle = "red";
      //   ctx.fill();
      //   // moveCursor(indexFingerTip[0], indexFingerTip[1]);
      // }
    }
  };

  // const moveCursor = (x, y) => {
  //   cursorRef.current.style.left = `${x}px`;
  //   cursorRef.current.style.top = `${y}px`;
  // };

  useEffect(() => {
    runHandpose();
  }, []);

  return (
    <div className="relative w-screen h-screen">
      <Webcam
        ref={webcamRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      {/* <div
        ref={cursorRef}
        className="absolute w-4 h-4 bg-red-500 rounded-full pointer-events-none"
        style={{ transition: "left 0.1s, top 0.1s" }}
      /> */}
    </div>
  );
}

export default App;
