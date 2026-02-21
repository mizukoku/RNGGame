// engine/core/Timeline.js

export class Timeline {
  constructor() {
    this.events = [];
    this.elapsed = 0;
    this.running = false;
    this.onComplete = null;
    this._interval = null;
  }

  at(time, fn) {
    this.events.push({ time, fn, fired: false });
    return this;
  }

  wait(ms) {
    return new Promise(resolve => this.at(this.elapsed + ms, resolve));
  }

  sequence(steps) {
    // steps: array of { delay, fn }
    let cursor = 0;
    for (const step of steps) {
      cursor += step.delay;
      this.at(cursor, step.fn);
    }
    return this;
  }

  then(fn) {
    this.onComplete = fn;
    return this;
  }

  play() {
    this.elapsed = 0;
    this.running = true;
    this.events.forEach(e => e.fired = false);
    const tick = 16;
    this._interval = setInterval(() => {
      if (!this.running) return;
      this.elapsed += tick;
      const due = this.events.filter(e => !e.fired && this.elapsed >= e.time);
      due.forEach(e => { e.fired = true; e.fn(); });
      const allFired = this.events.every(e => e.fired);
      if (allFired) {
        this.stop();
        if (this.onComplete) this.onComplete();
      }
    }, tick);
    return this;
  }

  stop() {
    this.running = false;
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }

  static fromSteps(steps, onComplete) {
    const tl = new Timeline();
    tl.sequence(steps);
    tl.onComplete = onComplete;
    return tl;
  }
}
