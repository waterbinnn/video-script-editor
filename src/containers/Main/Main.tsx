'use client';
import classNames from 'classnames/bind';
import styles from './Main.module.scss';

const cx = classNames.bind(styles);

import { MouseEvent, useEffect, useRef, useState } from 'react';
import { content } from './content';
import ReactPlayer from 'react-player';
import { useRouter } from 'next/navigation';

export const Main = () => {
  const [isCSR, setIsCSR] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const router = useRouter();

  const playerRef = useRef<ReactPlayer>(null);

  const handleClickCaption = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsEditable(true);
  };

  useEffect(() => {
    setIsCSR(typeof window !== 'undefined');
    return () => setIsCSR(false);
  }, []);

  return (
    <div className={cx('container')}>
      <section className={cx('left-section')}>
        <h2 style={{ display: 'none' }}>text 확인</h2>
        <div className={cx('video-wrap')}>
          {isCSR && (
            <ReactPlayer
              url={`/assets/video.mp4`}
              config={{
                file: {
                  tracks: [
                    {
                      kind: 'subtitles',
                      src: '/assets/captions.vtt',
                      srcLang: 'ko',
                      default: true,
                      label: 'ko',
                    },
                  ],
                },
              }}
              width='100%'
              height={'100%'}
              ref={playerRef}
              playing={false}
              muted={true}
              controls={true}
              loop={true}
            />
          )}
        </div>
        <button
          className={cx('btn-add-subtitle')}
          onClick={() => router.push('/subtitle')}
        >
          자막 파일 생성하러 가기
        </button>
      </section>

      <section className={cx('right-section')}>
        <h2 style={{ display: 'none' }}>자막 파일 수정 섹션</h2>
        <ol className={cx('clip-wrap', 'scrollable')}>
          {content.map((data, index) => (
            <li key={index} className={cx('num-wrap')}>
              <span className={cx('num')}>{index + 1}</span>

              <div className={cx('clip-each-wrap')}>
                {/* 클립 텍스트  */}
                <ol className={cx('text-click-wrap')}>
                  {data.content.split(' ').map((word, index) => (
                    <li key={`w-${index}`} className={cx('text-click')}>
                      {word}
                    </li>
                  ))}
                </ol>

                {/* 편집 텍스트  */}
                <div
                  className={cx('text-editable')}
                  id={`${data.id}`}
                  onClick={handleClickCaption}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                >
                  {data.content}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
};
