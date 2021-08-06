/** 节流 */
export function throttle<T extends (...rest: any[]) => any>(
  fn: T,
  delay = 50
): T {
  let lastCallTime: number;
  const throttledFn = function (...rest: any[]) {
    const now = Date.now();
    if (lastCallTime && now - lastCallTime <= delay) {
      return;
    }
    lastCallTime = now;
    return fn(...rest);
  };
  return throttledFn as T;
}

/** 计算帧率 */
export class FrameRate {
  rate: number;
  running = false;
  constructor() {
    this.rate = 60;
  }

  start(force?: boolean): void {
    if (!this.running && !force) {
      return;
    }
    this.running = true;
    const now = performance.now();
    requestAnimationFrame(() => {
      const interval = performance.now() - now;
      this.rate = 1000 / interval;
      this.start();
    });
  }

  stop(): void {
    this.running = false;
  }

  getRate(): number {
    return this.rate;
  }
}
