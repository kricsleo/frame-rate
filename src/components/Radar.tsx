import styled, { css } from 'styled-components';
import { hex2rgb, rgb2hex } from '@kricsleo/go-color';
import { useEffect, useMemo, useState } from 'react';
import { FrameRate, throttle } from '../utils';

const StyledRadar = styled.div<{ color: string; size?: string; }>`
  ${({ size = '100px', color }) => css`
    position: relative;
    width: ${size};
    height: ${size};

    .pointer {
      position: absolute;
      left: 10.5820106%;
      right: 10.5820106%;
      top: 10.5820106%;
      bottom: 50%;
      will-change: transform;
      transition: background-image 100ms linear;
      transform-origin: 50% 100%;
      border-radius: 50% 50% 0 0 / 100% 100% 0 0;
      background-image: linear-gradient(135deg,
        ${color} 0%,
        rgba(0, 0, 0, 0.02) 70%,
        rgba(0, 0, 0, 0) 100%
        );
      clip-path: polygon(100% 0,
        100% 10%,
        50% 100%, 0 100%, 0 0);
      animation: rotate360 3s infinite linear;
    }

    .pointer:after {
      content: "";
      position: absolute;
      width: 50%;
      bottom: -1px;
      border-top: 2px solid ${color};
      box-shadow: 0 0 3px ${color};
      border-radius: 9px;
      transition: all 100ms linear;
    }

    .shadow {
      position: absolute;
      left: 11%;
      top: 11%;
      right: 11%;
      bottom: 11%;
      margin: auto;
      border-radius: 9999px;
      color: ${color};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      box-shadow: 0 0 66px 6px ${color};
      animation: shadow 1s infinite ease alternate;
      font-weight: bold;
      transition: all 100ms linear;
    }

    @keyframes rotate360 {
      0% {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(-360deg);
      }
    }

    @keyframes shadow {
      0% {
        opacity: 0.4;
      }
      100% {
        opacity: 1;
      }
    }
  `}
`;

const colors = ['#ec4d1c', '#60d99b'].map(t => hex2rgb(t));
function rangeColor(range: number) {
  const rgb = colors[0].map((t, idx) => Math.round((colors[1][idx] - t) * Math.min(range, 1)) + t);
  return rgb2hex(rgb);
}

export default function Radar(props: { size?: string; className?: string }) {
  const { size, className } = props;
  const minRate = 40;
  const maxRate = 60;
  const [rate, setRate] = useState(30);
  const [frameRate] = useState<FrameRate>(() => new FrameRate());
  useEffect(() => {
    frameRate.start(true);
    const updateRate =  throttle(() => setRate(frameRate.getRate()), 300);
    const loop = () => requestAnimationFrame(() => {
      updateRate();
      loop();
    })
    loop();
  }, [frameRate]);
  const color = useMemo(() => rangeColor((Math.max(rate, minRate) - minRate) / (maxRate - minRate)), [rate, minRate, maxRate]);
  return (
    <StyledRadar className={className} size={size} color={color}>
      <div className="pointer" />
      <div className="shadow">{Math.round(rate)}fps</div>
    </StyledRadar>
  );
}