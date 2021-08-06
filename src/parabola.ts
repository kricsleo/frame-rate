/** 坐标信息 */
export interface ICordinate {
  x: number;
  y: number;
  percent?: number;
}

/** 抛物线 */
export class Parabola {
  gravity: number;

  speedX: number;

  from: ICordinate;

  to: ICordinate;

  duration: number;

  constructor(from: ICordinate, to: ICordinate, gravity: number) {
    this.gravity = gravity;
    const { x: fromX, y: fromY } = from;
    const { x: toX, y: toY } = to;
    const deltX = Math.abs(fromX - toX);
    const deltY = Math.abs(fromY - toY);
    const duration = Math.sqrt((deltY * 2) / gravity);
    this.duration = duration;
    this.speedX = deltX / duration;
    this.from = from;
    this.to = to;
  }

  // 获取当前时刻位置
  now(moment: number): ICordinate {
    const { x: fromX, y: fromY } = this.from;
    const { x: toX, y: toY } = this.to;
    const momentDeltX = this.speedX * moment;
    const momentDeltY = fromY > toY
      ? moment * Math.sqrt(2 * this.gravity * Math.abs(fromY - toY)) - (this.gravity * (moment ** 2)) / 2
      : (this.gravity * (moment ** 2)) / 2;
    return {
      x: fromX > toX ? fromX - momentDeltX : fromX + momentDeltX,
      y: fromY > toY ? fromY - momentDeltY : fromY + momentDeltY,
      percent: this.duration ? moment / this.duration : 1
    };
  }
}

/** 动画 */
export function animate(
  { from, to, gravity }: { from: ICordinate; to: ICordinate; gravity?: number },
  { update, end }: { update: (cordinate: ICordinate) => void, end?: () => void }
) {
  const parabola = new Parabola(from, to, gravity || 9.8);
  let moment = 0;
  const run = () => {
    requestAnimationFrame(() => {
      // 帧时间是不定的，为了保证两帧之间运动时间一致，使用常量：1
      moment += 1;
      const current = parabola.now(moment);
      update(current);
      const going = (from.x > to.x && current.x > to.x) || (from.x < to.x && current.x < to.x);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      going ? run() : end?.();
    });
  };
  run();
}

/** 对指定元素开始高空抛物 */
export function boom(
  source: HTMLElement,
  target: HTMLElement,
  ball: HTMLElement,
  { end, minScale, transform, willChange, gravity = 0.98 }: { end?: () => void; minScale: number; willChange: boolean; transform: boolean; gravity?: number; }
): void {
  if (!source || !target || !ball) {
    end?.();
    return;
  }
  if(transform) {
    console.log('using transfrom')
    const [from, to, start] = [source, target, ball].map(t => t.getBoundingClientRect());
    const moveTo = ({ x: currentX, y: currentY, percent = 0 }: ICordinate) => {
      ball.style.transform = `translate3d(${currentX - start.x}px, ${currentY - start.y}px, 0) scale(${Math.max(0.2, 1 - percent)})`;
    };
    animate({ from, to, gravity}, { update: moveTo, end });
  } else {
    console.log('not using transfrom')
    const [from, to, start] = [source, target, ball].map(t => t.getBoundingClientRect());
    const moveTo = ({ x: currentX, y: currentY, percent = 0 }: ICordinate) => {
      ball.style.top = `${currentY + start.x}px`;
      ball.style.left = `${currentX + start.y}px`;
      ball.style.width = `${start.width * Math.max(0.2, 1 - percent)}px`;
      ball.style.height = `${start.height * Math.max(0.2, 1 - percent)}px`;
    };
    animate({ from, to, gravity}, { update: moveTo, end });
  }
}
