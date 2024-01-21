'use client';

import React, { Dispatch, SetStateAction, forwardRef, memo } from 'react';
import ReactPlayer from 'react-player';
import { OnProgressProps } from 'react-player/base';

interface Props {
  isPlaying: boolean;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  onProgress?: ({ playedSeconds }: OnProgressProps) => void;
}

export const Player = forwardRef<ReactPlayer, Props>(
  ({ isPlaying, onProgress, setIsPlaying }, playerRef) => {
    return (
      <ReactPlayer
        url={`/assets/workdol.mp4`}
        width='100%'
        height={'100%'}
        progressInterval={500}
        ref={playerRef}
        playing={isPlaying}
        muted
        controls
        className={'react-player'}
        onProgress={onProgress}
        onPause={() => {
          setIsPlaying(false);
        }}
        onPlay={() => {
          setIsPlaying(true);
        }}
      />
    );
  }
);

Player.displayName = 'Player';
