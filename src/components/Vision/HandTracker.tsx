'use client';

import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { HandLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';
import { useHandStore } from '@/store/gameStore';
import { Camera, ChevronDown } from 'lucide-react';

const HandTracker = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webcamRunning, setWebcamRunning] = useState(false);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const requestRef = useRef<number | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
  
  const setHandData = useHandStore((state) => state.setHandData);

  useEffect(() => {
    const getDevices = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            setDevices(videoDevices);
            if (videoDevices.length > 0 && !selectedDeviceId) {
                setSelectedDeviceId(videoDevices[0].deviceId);
            }
        } catch (e) {
            console.error("Error identifying video devices", e);
        }
    };
    getDevices();
  }, []);

  const handleDeviceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedDeviceId(event.target.value);
  };

  useEffect(() => {
    const createHandLandmarker = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'
      );
      
      handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 1,
      });
      setWebcamRunning(true);
    };

    createHandLandmarker();

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      if (handLandmarkerRef.current) {
        handLandmarkerRef.current.close();
      }
    };
  }, []);

  const predictWebcam = () => {
    if (
      !handLandmarkerRef.current || 
      !webcamRef.current || 
      !webcamRef.current.video || 
      !webcamRef.current.video.readyState ||
      webcamRef.current.video.videoWidth <= 0 ||
      webcamRef.current.video.videoHeight <= 0
    ) {
      requestRef.current = requestAnimationFrame(predictWebcam);
      return;
    }

    const video = webcamRef.current.video;
    const canvas = canvasRef.current;

    if (video.currentTime > 0 && video.videoWidth > 0 && video.videoHeight > 0) {
        const results = handLandmarkerRef.current.detectForVideo(video, performance.now());
        
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                
                ctx.save();
                ctx.scale(-1, 1);
                ctx.translate(-canvas.width, 0);

                if (results.landmarks) {
                    const drawingUtils = new DrawingUtils(ctx);
                    for (const landmarks of results.landmarks) {
                        drawingUtils.drawConnectors(landmarks, HandLandmarker.HAND_CONNECTIONS, {
                            color: '#00FF00',
                            lineWidth: 5
                        });
                        drawingUtils.drawLandmarks(landmarks, {
                            color: '#FF0000',
                            lineWidth: 2
                        });

                        const wrist = landmarks[0];
                        const indexTip = landmarks[8];
                        const thumbTip = landmarks[4];
                        const middleMCP = landmarks[9];

                        const pinchDistance = Math.sqrt(
                            Math.pow(indexTip.x - thumbTip.x, 2) + 
                            Math.pow(indexTip.y - thumbTip.y, 2)
                        );
                        const isPinching = pinchDistance < 0.06;
                        
                        const handX = wrist.x; 
                        const handY = wrist.y;
                        
                        // Hand size for depth - exactly like original
                        const handSize = Math.sqrt(
                            Math.pow(wrist.x - middleMCP.x, 2) + 
                            Math.pow(wrist.y - middleMCP.y, 2)
                        );

                        setHandData(handX, handY, handSize, isPinching, true);
                    }
                } else {
                    setHandData(0.5, 0.5, 0.1, false, false);
                }
                ctx.restore();
            }
        }
    }

    requestRef.current = requestAnimationFrame(predictWebcam);
  };

  useEffect(() => {
    if (webcamRunning) {
      requestRef.current = requestAnimationFrame(predictWebcam);
    }
  }, [webcamRunning]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden rounded-xl border-4 border-zinc-800 group">
      <Webcam
        key={selectedDeviceId}
        ref={webcamRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        audio={false}
        mirrored={true}
        videoConstraints={{
             deviceId: selectedDeviceId,
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full object-cover" 
      />
      
      <div className="absolute top-15 left-4 bg-black/50 p-2 rounded text-white font-mono text-xs pointer-events-none z-10">
         HAND: {useHandStore.getState().isPresent ? 'TRACKING' : 'LOST'} <br/>
         PINCH: <span className={useHandStore.getState().isPinching ? 'text-green-500' : 'text-red-500'}>
            {useHandStore.getState().isPinching ? 'CLOSED' : 'OPEN'}
         </span>
      </div>

      {devices.length > 0 && (
          <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-center">
              <div className="relative bg-black/50 backdrop-blur-md rounded-full border border-white/20 px-3 py-1 flex items-center gap-2 hover:bg-black/70 transition-colors">
                  <Camera size={14} className="text-zinc-400" />
                  <select 
                    value={selectedDeviceId} 
                    onChange={handleDeviceChange}
                    className="bg-transparent text-xs text-white outline-none appearance-none min-w-[150px] cursor-pointer"
                  >
                      {devices.map(device => (
                          <option key={device.deviceId} value={device.deviceId} className="bg-black text-white">
                              {device.label || `Camera ${devices.indexOf(device) + 1}`}
                          </option>
                      ))}
                  </select>
                  <ChevronDown size={14} className="text-zinc-400 pointer-events-none" />
              </div>
          </div>
      )}
    </div>
  );
};

export default HandTracker;
