'use client';

import classNames from 'classnames/bind';
import styles from './SubtitleCreator.module.scss';
const cx = classNames.bind(styles);

const webVTT = require('node-webvtt');

import React, { ChangeEvent, useState } from 'react';

import DateTime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import moment from 'moment';

export const SubtitleCreator = () => {
  const [subtitles, setSubtitles] = useState<any>([]);
  const [startTime, setStartTime] = useState<string>('00:00:00');
  const [endTime, setEndTime] = useState<string>('');
  const [subtitleText, setSubtitleText] = useState<string>('');

  const handleSubtitleTextChange = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => {
    setSubtitleText(event.target.value);
  };

  const convertToSeconds = (timeString: string) => {
    const timeParts = timeString.split(':');
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const secs = parseInt(timeParts[2], 10);

    return hours * 3600 + minutes * 60 + secs;
  };

  const convertSecondsToTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedTime = `${String(hours).padStart(2, '0')}:${String(
      minutes
    ).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    return formattedTime;
  };

  const handleAddSubtitle = () => {
    const newSubtitle = {
      startTime: convertToSeconds(startTime),
      endTime: convertToSeconds(endTime),
      text: subtitleText,
    };
    setSubtitles([...subtitles, newSubtitle]);
    setStartTime(endTime);
    setSubtitleText('');
  };
  5;

  const handleGenerateSubtitleFile = () => {
    const parsedSubtitle = {
      cues: [],
      valid: true,
    };

    subtitles.forEach((subtitle: any, index: number) => {
      const cue = {
        identifier: (index + 1).toString(),
        start: subtitle.startTime,
        end: subtitle.endTime,
        text: subtitle.text,
        styles: '',
      };
      parsedSubtitle.cues.push(cue);
    });

    const modifiedSubtitleContent = webVTT.compile(parsedSubtitle);
    const modifiedSubtitleBlob = new Blob([modifiedSubtitleContent], {
      type: 'text/vtt',
    });
    const downloadLink = URL.createObjectURL(modifiedSubtitleBlob);
    const a = document.createElement('a');
    a.href = downloadLink;
    a.download = 'subtitles.vtt';
    a.click();
  };

  const handleStartTimeChange = (selectedTime: any) => {
    const formattedTime = moment(selectedTime).format('HH:mm:ss');
    setStartTime(formattedTime);
  };

  const handleEndTimeChange = (selectedTime: any) => {
    const formattedTime = moment(selectedTime).format('HH:mm:ss');
    setEndTime(formattedTime);
  };

  return (
    <div className={cx('container')}>
      <h1 className={cx('title')}>Subtitle Creator</h1>
      <div className={cx('inputs-wrap')}>
        <div className={cx('time-wrap')}>
          <div className={cx('time-input')}>
            <label>Start Time</label>
            <DateTime
              value={startTime}
              onChange={handleStartTimeChange}
              dateFormat={false}
              timeFormat='HH:mm:ss'
            />
          </div>
          <span>{`->`}</span>
          <div className={cx('time-input')}>
            <label>End Time</label>
            <DateTime
              value={endTime}
              onChange={handleEndTimeChange}
              dateFormat={false}
              timeFormat='HH:mm:ss'
            />
          </div>
        </div>
        <div className={cx('time-wrap')}>
          <label>Subtitles</label>
          <textarea
            className={cx('textarea')}
            rows={4}
            cols={30}
            placeholder='자막을 입력해 주세요.'
            value={subtitleText}
            onChange={handleSubtitleTextChange}
          />
        </div>
      </div>

      <button className={cx('btn-add')} onClick={handleAddSubtitle}>
        Add Subtitle
      </button>

      <div className={cx('subtitle-list')}>
        <h2>자막</h2>
        {subtitles.map((subtitle: any, index: number) => (
          <div className={cx('subtitle-item')} key={index}>
            <time className={cx('timeline')}>
              {convertSecondsToTime(subtitle.startTime)} -{' '}
              {convertSecondsToTime(subtitle.endTime)}
            </time>
            <p className={cx('sub-text')}>{subtitle.text}</p>
          </div>
        ))}
      </div>
      {subtitles.length > 0 && (
        <div className={cx('generate-button')}>
          <button onClick={handleGenerateSubtitleFile}>
            Generate Subtitle File
          </button>
        </div>
      )}
    </div>
  );
};
