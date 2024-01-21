import classNames from 'classnames/bind';

import { forwardRef, SyntheticEvent, useRef } from 'react';

import styles from '../../containers/Main/Main.module.scss';
const cx = classNames.bind(styles);

interface Props {
  blockList: any[];
  currentBlockId: number | null;
  goToBlock: (blockId: number, intervalStart: string) => void;
}

export const BlockItemList = forwardRef<HTMLLIElement[], Props>(
  ({ blockList, currentBlockId, goToBlock }, blockRef) => {
    const sentenceRef = useRef<HTMLSpanElement[]>([]);
    const subTitleRef = useRef<HTMLParagraphElement | null>(null);

    return (
      <ul className={cx('block-list')}>
        {/* test */}
        <div
          ref={subTitleRef}
          style={{ background: '#000000', color: '#ffffff', width: '100%' }}
        />
        {/* ----------- */}

        {blockList.map((block, blockIndex) => (
          <li
            className={cx('stt-block', {
              active: blockIndex === currentBlockId,
            })}
            key={block.blockId}
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
          >
            <div className={cx('block-row')}>
              <span className={cx('block-id')}>{`구간 ${blockIndex + 1}`}</span>

              <div className={cx('side')}>
                <div className={cx('side-item')}></div>
              </div>
            </div>
            <div className={cx('block-row-second')}>
              <span className={cx('block-id')} />
              <div className={cx('sentence-list')}>
                {block.sentenceList.map((sentence, idx) => (
                  <span
                    className={cx('sentence')}
                    contentEditable
                    dangerouslySetInnerHTML={{ __html: sentence.cont }}
                    id={sentence.sentenceId.toString()}
                    key={sentence.sentenceId}
                    ref={(el) => {
                      if (el) {
                        sentenceRef.current[Number(sentence.sentenceId)] = el;
                      }
                    }}
                    onKeyDown={(event) => {
                      if (event.code === 'Enter') {
                        event.preventDefault();
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }
);

BlockItemList.displayName = 'BlockItemList';
