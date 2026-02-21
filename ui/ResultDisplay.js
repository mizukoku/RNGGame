// ui/ResultDisplay.js

export class ResultDisplay {
  constructor(container) {
    this.container = container;
    this.el = null;
    this._render();
  }

  _render() {
    this.el = document.createElement('div');
    this.el.className = 'result-display';
    this.el.innerHTML = `
      <div class="result-card" id="result-card">
        <div class="result-card__idle">
          <div class="result-card__orb"></div>
          <p class="result-card__prompt">Your fate awaits...</p>
        </div>
        <div class="result-card__result" hidden>
          <div class="result-card__icon" id="result-icon"></div>
          <div class="result-card__rarity" id="result-rarity"></div>
          <div class="result-card__name" id="result-name"></div>
          <div class="result-card__badge" id="result-badge"></div>
        </div>
      </div>
    `;
    this.container.appendChild(this.el);
  }

  showResult(rarity, item) {
    const idle = this.el.querySelector('.result-card__idle');
    const result = this.el.querySelector('.result-card__result');
    const card = this.el.querySelector('.result-card');

    idle.setAttribute('hidden', '');
    result.removeAttribute('hidden');

    // Set content
    this.el.querySelector('#result-icon').textContent = item.icon;
    this.el.querySelector('#result-rarity').textContent = rarity.label;
    this.el.querySelector('#result-rarity').style.color = rarity.color;
    this.el.querySelector('#result-rarity').style.textShadow = rarity.textShadow;
    this.el.querySelector('#result-name').textContent = item.name;

    const badge = this.el.querySelector('#result-badge');
    badge.textContent = rarity.id;
    badge.style.borderColor = rarity.color;
    badge.style.color = rarity.color;
    badge.style.boxShadow = `0 0 12px ${rarity.glowColor}`;

    // Animate card in
    card.style.setProperty('--rarity-color', rarity.color);
    card.style.setProperty('--rarity-glow', rarity.glowColor);
    card.classList.remove('result-card--show');
    void card.offsetWidth; // force reflow
    card.classList.add('result-card--show');
  }

  reset() {
    const idle = this.el.querySelector('.result-card__idle');
    const result = this.el.querySelector('.result-card__result');
    const card = this.el.querySelector('.result-card');
    idle.removeAttribute('hidden');
    result.setAttribute('hidden', '');
    card.classList.remove('result-card--show');
    card.style.removeProperty('--rarity-color');
    card.style.removeProperty('--rarity-glow');
  }
}
