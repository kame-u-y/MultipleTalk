import React, { useState, useEffect, createRef, useRef } from 'react';

export const AudioObject: React.FC<{
  imgSrc: string;
}> = ({ imgSrc }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlay, setVideoPlay] = useState<boolean>(true);

  useEffect(() => {}, [videoRef, isVideoPlay]);

  return (
    <>
      <div className="user-icon">
        <img src={imgSrc} />
      </div>
    </>
  );
};
