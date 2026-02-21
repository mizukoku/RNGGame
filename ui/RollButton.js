// ui/RollButton.js

export class RollButton {
  constructor(container, onRoll) {
    this.container = container;
    this.onRoll = onRoll;
    this.disabled = false;
    this.el = null;
    this.rippleContainer = null;
    this._render();
  }

  _render() {
    this.el = document.createElement('div');
    this.el.className = 'roll-btn-wrapper';
    this.el.innerHTML = `
      <button class="roll-btn" id="roll-btn">
        <span class="roll-btn__inner">
          <span class="roll-btn__glow"></span>
          <span class="roll-btn__text">ROLL</span>
          <span class="roll-btn__sub">tap to summon fate</span>
        </span>
        <div class="roll-btn__ring roll-btn__ring--1"></div>
        <div class="roll-btn__ring roll-btn__ring--2"></div>
        <div class="roll-btn__ring roll-btn__ring--3"></div>
      </button>
    `;
    this.container.appendChild(this.el);

    const btn = this.el.querySelector('.roll-btn');
    btn.addEventListener('click', () => this._handleClick(btn));
    btn.addEventListener('mousemove', (e) => this._handleHover(e, btn));
    btn.addEventListener('mouseleave', () => this._handleLeave(btn));
  }

  _handleClick(btn) {
    if (this.disabled) return;
    this._spawnRipple(btn);
    if (this.onRoll) this.onRoll();
  }

  _handleHover(e, btn) {
    const rect = btn.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    btn.style.transform = `perspective(600px) rotateX(${-y}deg) rotateY(${x}deg) scale(1.05)`;
  }

  _handleLeave(btn) {
    btn.style.transform = '';
  }

  _spawnRipple(btn) {
    const ripple = document.createElement('span');
    ripple.className = 'roll-btn__ripple';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 800);
  }

  setDisabled(disabled) {
    this.disabled = disabled;
    const btn = this.el.querySelector('.roll-btn');
    btn.classList.toggle('roll-btn--disabled', disabled);
    if (disabled) {
      btn.querySelector('.roll-btn__sub').textContent = 'rolling...';
    } else {
      btn.querySelector('.roll-btn__sub').textContent = 'tap to summon fate';
    }
  }

  pulse() {
    const btn = this.el.querySelector('.roll-btn');
    btn.classList.add('roll-btn--pulse');
    setTimeout(() => btn.classList.remove('roll-btn--pulse'), 600);
  }
}
