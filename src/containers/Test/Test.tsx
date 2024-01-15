'use client';

import React, { SyntheticEvent, useRef } from 'react';
import { content } from '../Main/content';

export const Test = () => {
  const editableRef = useRef<HTMLSpanElement[]>([]);
  const subTitleRef = useRef<HTMLHeadingElement | null>(null);

  const handleTitle = (e: SyntheticEvent<HTMLSpanElement>) => {
    if (subTitleRef.current) {
      subTitleRef.current.textContent = e.currentTarget.textContent || '';
    }
  };
  return (
    <section>
      <h2 style={{ display: 'none' }}>자막 파일 수정 섹션</h2>
      <h3 ref={subTitleRef}></h3>

      <div>----</div>
      <ol>
        {content.map((data, index) => (
          <li key={index}>
            <span
              contentEditable={true}
              dangerouslySetInnerHTML={{ __html: data.content }}
              id={`${data.id}`}
              ref={(el) => {
                if (!editableRef.current) {
                  return null;
                }
                if (el) {
                  editableRef.current[Number(data.id)] = el;
                }
              }}
              role={'textbox'}
              suppressContentEditableWarning
              onInput={handleTitle}
            />
          </li>
        ))}
      </ol>
    </section>
  );
};
