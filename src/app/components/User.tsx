import React, { useState, useEffect, useRef } from 'react';
import Moveable from 'react-moveable';
import { RoomStream } from 'skyway-js';
import { UserOffset } from '../interfaces/UserOffset';

export const RemoteUser: React.FC<{
  imgSrc: string;
  stream: MediaStream;
  userOffset: UserOffset;
}> = ({ imgSrc, stream, userOffset }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlay, setVideoPlay] = useState<boolean>(true);

  useEffect(() => {
    console.log('videoRef');
    if (!videoRef) return;
    if (videoRef.current === null) return;
    if (videoRef.current.srcObject) return;
    videoRef.current.srcObject = stream;
    videoRef.current.play();
  }, [videoRef, isVideoPlay]);

  return (
    <>
      <div
        className="user-icon"
        style={{ left: `${userOffset.x}px`, top: `${userOffset.z}px` }}
      >
        {isVideoPlay ? <video ref={videoRef} muted/> : <img src={imgSrc} />}
      </div>
    </>
  );
};

export const MySelf: React.FC<{
  imgSrc: string;
  stream: MediaStream | RoomStream;
  getXZ: ({ x, z }: UserOffset) => void;
}> = ({ imgSrc, stream, getXZ }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlay, setVideoPlay] = useState<boolean>(true);
  const [dragTarget, setDragTarget] = useState<HTMLDivElement>(null);
  const [userOffset, setUserOffset] = useState<UserOffset>(null);

  useEffect(() => {
    console.log('videoRef');
    if (!videoRef) return;
    if (videoRef.current === null) return;
    if (videoRef.current.srcObject) return;
    videoRef.current.srcObject = stream;
    videoRef.current.play();
  }, [videoRef, isVideoPlay]);

  useEffect(() => {
    setDragTarget(document.querySelector<HTMLDivElement>(`.draggable`));
  }, []);

  useEffect(() => {
    if (!userOffset) return;
    // const myIcon: HTMLDivElement = document.querySelector('#my-icon');
    getXZ(userOffset);
  }, [userOffset]);

  // useEffect(() => {
  //   console.log(videoRef);
  //   console.log(videoRef.current.srcObject);
  // }, [isVideoPlay]);

  return (
    <>
      <div className="user-icon draggable" id="my-icon">
        <button
          onClick={() => setVideoPlay(!isVideoPlay)}
          onTouchEnd={() => setVideoPlay(!isVideoPlay)}
        >
          {isVideoPlay ? '🎥' : '❌'}
        </button>
        {isVideoPlay ? <video ref={videoRef} muted /> : <img src={imgSrc} />}
      </div>
      <Moveable
        target={dragTarget}
        draggable={true}
        origin={false}
        onDrag={(ev) => {
          const target = ev.target as HTMLElement;
          const rect = target.getBoundingClientRect();
          target.style.transform = ev.transform;
          setUserOffset({
            x: rect.left,
            z: rect.top,
          });
        }}
      />
    </>
  );
};
