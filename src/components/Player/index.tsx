/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { useState, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { FaPlay, FaUndo, FaRedo, FaPause } from 'react-icons/fa';
import { useEffectOnce } from 'react-use';

export default function Player(props: {
  playBackSpeedOptions: number[];
  hideWave: any;
  waveStyles: WaveSurfer.WaveSurferParams;
  waveJson: (readonly number[] | readonly (readonly number[])[]) | undefined;
  getWaveSurferInstance: (arg0: null) => void;
  zoom: number | undefined;
  events: { [s: string]: unknown } | ArrayLike<unknown>;
  containerStyles: React.CSSProperties | undefined;
  hideImage: any;
  imageUrl: string | undefined;
  imgStyles: React.CSSProperties | undefined;
  audioUrl: string | undefined;
}) {
  const waveformRef: any = useRef();
  const trackRef: any = useRef(); // Separated track playing from waveplayer to support bigger audio files
  const [waveSurfer, setWaveSurfer] = useState<any>(null); // Holds the reference to created wavesurfer object

  const [playingAudio, setPlayingAudio] = useState<boolean>(false);
  const [playBackSpeed, setPlayBackSpeed] = useState<number>(1);
  const [playable, setPlayable] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const playBackSpeedOptions = props.playBackSpeedOptions ?? [
    0.5,
    1,
    1.2,
    1.5,
    2,
  ];

  const playAudio = () => {
    if (!props.hideWave) waveSurfer.play();
    else trackRef.current.play();
    setPlayingAudio(true);
  };

  const pauseAudio = () => {
    if (!props.hideWave) waveSurfer.pause();
    else trackRef.current.pause();
    setPlayingAudio(false);
  };

  const changePlaybackSpeed = () => {
    const newSpeed = playBackSpeed === 4 ? 0 : playBackSpeed + 1;
    setPlayBackSpeed(newSpeed);
    trackRef.current.playbackRate = playBackSpeedOptions[newSpeed];
  };

  const seekAudioFifteenSeconds = (ahead: boolean) => {
    if (ahead) trackRef.current.currentTime += 15;
    else trackRef.current.currentTime -= 15;
  };

  useEffectOnce(() => {
    if (waveformRef.current && trackRef.current && !props.hideWave) {
      const wavesurfer = props.waveStyles
        ? WaveSurfer.create({
            ...props.waveStyles,
            container: '#waveform',
            responsive: true,
            backend: 'MediaElement',
          })
        : WaveSurfer.create({
            container: '#waveform',
            responsive: true,
            backend: 'MediaElement',
          });
      // Load the waveForm json if provided
      props.waveJson
        ? wavesurfer.load(trackRef.current)
        : wavesurfer.load(trackRef.current, props.waveJson);

      wavesurfer.on('ready', () => {
        setWaveSurfer(wavesurfer);
        // Returns the instance to call methods on
        if (typeof props.getWaveSurferInstance === 'function') {
          props?.getWaveSurferInstance(waveSurfer);
        }
        wavesurfer.zoom(props.zoom);
      });

      if (props?.events) {
        Object.entries(props.events).map(([key, value]) => {
          waveSurfer.on(key, value);
        });
      }
    }
  });

  return (
    <div>
      <div
        style={
          props.containerStyles
            ? {
                display: 'flex',
                flexDirection: 'row',
                ...props.containerStyles,
              }
            : {
                display: 'flex',
                flexDirection: 'row',
                maxWidth: '50vh',
                marginLeft: 'auto',
                marginRight: 'auto',
              }
        }
      >
        {!props.hideImage && (
          <div>
            <img
              src={props.imageUrl}
              alt="Audio logo"
              style={
                props.imgStyles ? { ...props.imgStyles } : { maxWidth: '150px' }
              }
            />
          </div>
        )}
        <div
          style={{
            flexGrow: 7,
            justifyContent: 'space-around',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div>
            {!props.hideWave && <div ref={waveformRef} id="waveform" />}
            <audio
              onCanPlay={() => {
                setPlayable(true);
              }}
              onError={() => {
                setError(true);
              }}
              src={props.audioUrl}
              ref={trackRef}
            />
            {error && (
              <p className="text-center text-sm text-gray-500 -mt-5">
                音频无法加载/识别
              </p>
            )}
          </div>
          {playable && (
            <div
              style={{
                justifyContent: 'center',
                display: 'flex',
                flexDirection: 'row',
                marginLeft: '10px',
              }}
            >
              <FaUndo
                style={{ margin: '20px', cursor: 'pointer' }}
                onClick={() => seekAudioFifteenSeconds(false)}
              />{' '}
              {playingAudio ? (
                <FaPause
                  style={{ margin: '20px', cursor: 'pointer' }}
                  onClick={() => (playingAudio ? pauseAudio() : playAudio())}
                />
              ) : (
                <FaPlay
                  style={{ margin: '20px', cursor: 'pointer' }}
                  onClick={() => (playingAudio ? pauseAudio() : playAudio())}
                />
              )}
              <span
                style={{ margin: '20px', cursor: 'pointer' }}
                onClick={() => changePlaybackSpeed()}
              >
                {playBackSpeedOptions[playBackSpeed]}x
              </span>
              <FaRedo
                style={{ margin: '20px', cursor: 'pointer' }}
                onClick={() => seekAudioFifteenSeconds(true)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
