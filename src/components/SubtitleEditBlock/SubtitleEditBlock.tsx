import classNames from 'classnames/bind';
import styles from '../../containers/Main/Main.module.scss';
import {
  Dispatch,
  RefObject,
  SetStateAction,
  SyntheticEvent,
  forwardRef,
  memo,
  useRef,
} from 'react';

const cx = classNames.bind(styles);

interface Props {
  blockList: any;
  goToBlock: (blockId: number, intervalStart: string) => void;
  onInput?: (e: SyntheticEvent<HTMLSpanElement>) => void;
  currentBlockId: number | null;
  subTitleRef: RefObject<HTMLParagraphElement>;
}

function convertSecondsToHHMMSS(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  // 시, 분, 초를 두 자릿수 형식으로 표시
  const formatTime = (time: number) => String(time).padStart(2, '0');

  return `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(
    Math.floor(remainingSeconds)
  )}`;
}

export const SubtitleEditBlock = forwardRef<HTMLLIElement[], Props>(
  ({ blockList, goToBlock, currentBlockId, subTitleRef }, blockRef) => {
    const subtitleInputRef = useRef<HTMLSpanElement[]>([]);

    //자막 수정
    const handleEditSubtitle = (e: SyntheticEvent<HTMLSpanElement>) => {
      const subList = blockList.map((v: any) => v.sentenceList);
      let newContentData = [...subList];

      const newContent = e.currentTarget.textContent;
      const idToUpdate = Number(e.currentTarget.id);

      // subList를 순회하면서 해당 id를 가진 항목을 찾아 cont 값을 수정
      newContentData.forEach((block) => {
        block.forEach((sentence: any) => {
          if (sentence.sentenceId === idToUpdate) {
            sentence.cont = newContent;
          }
        });
      });

      const currentBlock = newContentData.find((block) =>
        block.some((sentence: any) => sentence.sentenceId === idToUpdate)
      );

      const joinedSubtitle = currentBlock
        .map((sentence: any) => sentence.cont)
        .join(' ');

      if (subTitleRef.current) {
        subTitleRef.current.textContent = joinedSubtitle;
      }
    };

    return (
      <>
        {blockList.map((block: any, blockIndex: number) => (
          <li
            className={cx('block-wrap', {
              active: currentBlockId === blockIndex,
            })}
            ref={(el) => {
              if (
                blockRef &&
                typeof blockRef !== 'function' &&
                blockRef.current &&
                el
              ) {
                blockRef.current[blockIndex] = el;
              }
            }}
            onClick={() => goToBlock(blockIndex, block.intervalStart)}
            key={block.blockId}
          >
            <div className={cx('timeline')}>
              <time>
                {convertSecondsToHHMMSS(parseFloat(block.intervalStart))} ~{' '}
                {convertSecondsToHHMMSS(parseFloat(block.intervalEnd))}
              </time>
            </div>
            <div className={cx('cont-wrap')}>
              {block.sentenceList.map((cont: any) => (
                <span
                  key={cont.sentenceId}
                  id={cont.sentenceId}
                  className={cx('text-editable')}
                  contentEditable={true}
                  dangerouslySetInnerHTML={{ __html: cont.cont }}
                  ref={(el) => {
                    if (el) {
                      subtitleInputRef.current[cont.id] = el;
                    }
                  }}
                  onInput={handleEditSubtitle}
                />
              ))}
            </div>
          </li>
        ))}
      </>
    );
  }
);

SubtitleEditBlock.displayName = 'SubtitleEditBlock';
