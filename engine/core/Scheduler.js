// engine/core/Scheduler.js

export class Scheduler {
  constructor() {
    this._tasks = [];
  }

  delay(ms, fn) {
    const id = setTimeout(fn, ms);
    this._tasks.push({ type: 'timeout', id });
    return id;
  }

  repeat(ms, fn) {
    const id = setInterval(fn, ms);
    this._tasks.push({ type: 'interval', id });
    return id;
  }

  cancelAll() {
    this._tasks.forEach(t => {
      if (t.type === 'timeout') clearTimeout(t.id);
      else clearInterval(t.id);
    });
    this._tasks = [];
  }

  // Schedule a chain of callbacks with progressive delays
  chain(steps) {
    // steps: [{ delay, fn }, ...]
    steps.forEach(({ delay, fn }) => this.delay(delay, fn));
  }

  // Promise-based delay
  after(ms) {
    return new Promise(resolve => this.delay(ms, resolve));
  }
}
