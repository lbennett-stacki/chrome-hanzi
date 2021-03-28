import hanzi from 'hanzi';
import HanziWriter from 'hanzi-writer';
import { timeout } from './timeout';

export class Popup {
  constructor(voice) {
    this.voice = voice;
  }

  async create(box) {
    this.destroy();

    this.popup = await this.createPopup(box);

    return this;
  }

  async createPopup(box) {
    const popup = document.createElement('div');
    document.body.appendChild(popup);
    popup.classList.add('chz-popup');

    await timeout(1);

    const { x, y } = this.calculatePosition(box, popup);
    popup.style.left = x;
    popup.style.top = y;

    return popup;
  }

  calculatePosition(box, popup = this.popup) {
    let x = document.scrollingElement.scrollLeft + box.x;
    if (x + popup.clientWidth * 3 > document.body.clientWidth) {
      x -= popup.clientWidth * 3 + box.width;
    }

    return {
      x: x + 'px',
      y: document.scrollingElement.scrollTop + box.y + box.height + 'px',
    };
  }

  async setCharacter(character) {
    const definitions = hanzi.definitionLookup(character);

    if (!definitions) return;

    this.popup.innerHTML = `
    <div>
      <div class="strokes" id="chz-strokes"></div>
      <div class="info">
        ${definitions
          .map(
            (definition, index) => `
          <div><span>Definition:</span> ${definition.definition}</div>
          <div><span>Simplified:</span> ${definition.simplified}</div>
          <div><span>Traditional:</span> ${definition.traditional}</div>
          <div><span>Pinyin:</span> ${definition.pinyin}</div>
          ${index < definitions.length - 1 ? '<hr>' : ''}
        `
          )
          .join('')}
      </div>
    </div>
    `;

    await timeout();

    HanziWriter.create('chz-strokes', character, {
      width: 100,
      height: 100,
      padding: 5,
    }).loopCharacterAnimation();

    await this.voice.speak(character);
  }

  destroy() {
    this.popup && this.popup.remove();
  }
}
