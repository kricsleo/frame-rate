import { useMemo, useRef } from "react";
import { useState } from "react";
import styled from "styled-components";
import { boom } from '../parabola';

const StyledPlayground = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  .targets {
    flex-grow: 1;
    position: relative;
    overflow: hidden;
  }
  .from,
  .to {
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
  .from {
    background-color: #AFBFE2;
  }
  .to {
    background-color: #EDE1C4;
  }
  .ball {
    position: absolute;
    display: inline-block;
    width: 20px;
    height: 20px;
    background-color: #A6DCB0;
    border-radius: 50%;
  }
  .opt {
    padding: 60px 20px;
    text-align: center;
  }
  .animationJelly {
    animation: animationJelly 1s;
  }

  .animationWidth {
    animation: animationJelly 1s;
  }

  /** animation */
  @keyframes animationJelly {
    0% {
      transform: scale(1);
    }

    14.28% {
      transform: scale(1.3);
    }

    28.57% {
      transform: scale(0.72);
    }

    42.85% {
      transform: scale(1.1);
    }

    57.14% {
      transform: scale(0.92);
    }

    71.42% {
      transform: scale(1.03);
    }

    85.71% {
      transform: scale(0.99);
    }

    100% {
      transform: scale(1);
    }
  }

  /** animation */
  @keyframes animationWidth {
    0% {
      width: 20px;
      height: 20px;
    }

    14.28% {
      width: 26px;
      height: 26px;
    }

    28.57% {
      width: 36px;
      height: 36px;
    }

    42.85% {
      width: 14.4px;
      height: 14.4px;
    }

    57.14% {
      width:18.4px;
      height:18.4px;
    }

    71.42% {
      width: 20.6px;
      height: 20.6px;
    }

    85.71% {
      width: 19.8px;
      height: 19.8px;
    }

    100% {
      width: 20px;
      height: 20px;
    }
  }
`;

/** 创建球并抛出 */
export function createBallAndThrow(fromEl: HTMLElement, toEl: HTMLElement, {
  root = document.body,
  willChange = true,
  transform = true
}: {root: HTMLElement; willChange: boolean; transform: boolean;}) {
  const ballEl = document.createElement('span');
  ballEl.classList.add('ball');
  // requestAnimationFrame(() => ballEl.classList.add(transform ? 'transform' : 'width'));
  root.appendChild(ballEl);
  const animationName = transform ? 'animationJelly' : 'animationWidth';
  const toggleAnimation = (el: HTMLElement) => {
    el.classList.add(animationName);
    setTimeout(() => el.classList.remove(animationName), 1100);
  }
  // toggleAnimation(fromEl);
  return new Promise(rs => boom(fromEl, toEl, ballEl, {
    end: () => {
      toggleAnimation(toEl);
      ballEl.remove();
      rs(true);
    },
    minScale: 0.6,
    willChange,
    transform: transform,
    gravity: 0.098
  }));
}

export default function Playground() {
  const targetsElRef = useRef<HTMLElement | null | undefined>();
  const [min, max] = [1, 1000];
  const [fromKey, toKey] = ['from', 'to'];
  const elMap: Record<string, Array<HTMLElement>> = {[fromKey]: [], [toKey]: []};
  const [pairs, setPairs] = useState(1);
  const [willChange, setWillChange] = useState(true);
  const [transform, setTransform] = useState(true);

  const animate = () => {
    elMap[fromKey].forEach(fromEl => {
      const els = elMap[toKey];
      const toEl = els[Math.floor(Math.random() * els.length)]
      createBallAndThrow(fromEl, toEl, {
        root: targetsElRef.current as HTMLElement,
        willChange,
        transform
      })
    })
  }
  const pushEl = (key: string, el: HTMLElement) => elMap[key].push(el);
  const [fromNodes, toNodes] = useMemo(() => [fromKey, toKey].map(t =>
    new Array(pairs).fill(null).map((k, idx) => {
      let style;
      if(targetsElRef.current) {
        const { width, height } = targetsElRef.current.getBoundingClientRect();
        style = { top: Math.random() * (height - 20), left: Math.random() * (width - 20) };
      }
      return <div key={idx} style={style} className={t} ref={ref => ref && pushEl(t, ref as HTMLElement)} />;
    })
  ), [fromKey, toKey, pairs, pushEl]);
  return (
    <StyledPlayground>
      <div className="opt">
        <input type="number" value={pairs} min={min} max={max} onChange={e => setPairs(Number(e.target.value))} />
        <input style={{width: 400}} type="range" value={pairs} min={min} max={max} onChange={e => setPairs(Number(e.target.value))} />
        <input type="checkbox" checked={transform} onChange={e => setTransform(e.target.checked)} /> using transform
        <br />
        <button onClick={animate}>animate: {pairs}</button>
      </div>
      <div className="targets" ref={el => targetsElRef.current = el}>
        {fromNodes}
        {toNodes}
      </div>
    </StyledPlayground>
  )
}