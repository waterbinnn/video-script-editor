'use client';
import classNames from 'classnames/bind';
import styles from './Main.module.scss';

const cx = classNames.bind(styles);

import { useEffect, useRef, useState } from 'react';
import { blockList } from './content';
import ReactPlayer from 'react-player';
import { OnProgressProps } from 'react-player/base';
import { Duration, SubtitleEditBlock } from '@/components';
import Image from 'next/image';

export const Main = () => {
  const [isCSR, setIsCSR] = useState<boolean>(false);

  const [isPlaying, setIsPlaying] = useState<boolean>(true); //play 여부
  const [duration, setDuration] = useState<number>(0); //총 길이

  const currentPlaying = useRef<number>(0); //현재 플레이 되는 시간

  const [currentBlockId, setCurrentBlockId] = useState<number | null>(0); //현재 재생 블록

  const playerRef = useRef<ReactPlayer>(null);
  const blockRef = useRef<HTMLLIElement[]>([]);
  const subTitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsCSR(true);
    }
  }, []);

  //클릭한 block으로 이동
  const goToBlock = (blockIndex: number, intervalStart: string): void => {
    playerRef.current?.seekTo(Number(intervalStart));
    setCurrentBlockId(blockIndex);
  };

  //현재 재생되는 구간으로 이동
  const handleCurrentPlay = ({ playedSeconds }: OnProgressProps) => {
    currentPlaying.current = playedSeconds;

    const findCurrentBlockId = () => {
      blockList.forEach((block, blockIndex) => {
        if (
          currentPlaying.current >= Number(block.intervalStart) &&
          currentPlaying.current <= Number(block.intervalEnd)
        ) {
          setCurrentBlockId(blockIndex);
        }
      });
    };
    findCurrentBlockId();
  };

  return (
    <div className={cx('container')}>
      <section className={cx('left-section')}>
        <h2 style={{ display: 'none' }}>text 확인</h2>
        <div
          className={cx('video-wrap')}
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isCSR && (
            <ReactPlayer
              url={`/assets/workdol.mp4`}
              width='100%'
              height={'100%'}
              ref={playerRef}
              playing={isPlaying}
              muted
              className={'react-player'}
              onProgress={handleCurrentPlay}
              onDuration={(duration) => setDuration(duration)}
            />
          )}
          <div className={cx('subtitle-inline')}>
            <p ref={subTitleRef} />
          </div>
        </div>
        <div className={cx('player-controller')}>
          <Image
            src={isPlaying ? '/assets/icon-pause.png' : '/assets/icon-play.png'}
            alt='play button'
            width={30}
            height={30}
            onClick={() => setIsPlaying(!isPlaying)}
            className={cx('btn-play')}
          />
          <div className={cx('duration-wrap')}>
            <Duration
              seconds={currentPlaying.current}
              className={cx('duration')}
            />
            <span>/</span>
            <Duration seconds={duration} className={cx('duration')} />
          </div>
        </div>
      </section>

      <section className={cx('right-section')}>
        <h2 style={{ display: 'none' }}>자막 파일 수정 섹션</h2>
        <ol className={cx('clip-wrap', 'scrollable')}>
          <SubtitleEditBlock
            goToBlock={goToBlock}
            blockList={blockList}
            ref={blockRef}
            subTitleRef={subTitleRef}
            currentBlockId={currentBlockId}
          />
        </ol>
      </section>
    </div>
  );
};
