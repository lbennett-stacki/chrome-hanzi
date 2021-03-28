import hanzi from 'hanzi';
import HanziWriter from 'hanzi-writer';
import { debounce } from './modules/debounce';
import { clamp } from './modules/clamp';
import { timeout } from './modules/timeout';
import { findTextNode } from './modules/dom';

function isChildOf(el, to) {
  if (el === to) {
    return true;
  }

  if (el.parentNode) {
    return isChildOf(el.parentNode, to);
  }

  return false;
}

class Popup {
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

    return;
  }

  destroy() {
    this.popup && this.popup.remove();

    return;
  }
}

class Selection {
  create(event) {
    this.destroy();

    this.range = this.createRange(event);

    if (!this.range) return this;

    this.highlight = this.createHighlight(this.range);

    return this;
  }

  createRange(event) {
    const range = document.caretRangeFromPoint(event.clientX, event.clientY);

    if (!range) return;

    range.setEnd(
      range.endContainer,
      clamp(range.endOffset + 1, 0, range.endContainer.length)
    );

    return range;
  }

  createHighlight(range) {
    const highlight = document.createElement('div');
    document.body.appendChild(highlight);
    highlight.classList.add('chz-highlight');

    const box = this.getBox();

    const size = box.height < box.width ? box.height : box.width;
    highlight.style.height = size + 'px';
    highlight.style.width = size + 'px';

    highlight.style.top =
      document.scrollingElement.scrollTop +
      box.top -
      (size - box.height) / 2 +
      'px';
    highlight.style.left =
      document.scrollingElement.scrollLeft +
      box.left +
      (size - box.width) / 2 +
      'px';

    return highlight;
  }

  getBox() {
    return this.range.getBoundingClientRect();
  }

  destroy() {
    this.range && this.range.detach();
    this.highlight && this.highlight.remove();

    return;
  }

  get start() {
    return this.range.startOffset;
  }
}

const _selection = new Selection();
const _popup = new Popup();

function destroy() {
  _selection && _selection.destroy();
  _popup && _popup.destroy();

  return;
}

const debouncedMousemove = debounce(mousemove, 85);
async function mousemove(event) {
  if (
    isChildOf(event.target, _popup.popup) ||
    isChildOf(event.target, _selection.highlight)
  ) {
    return;
  }

  const node = findTextNode(event.target);
  if (!node) return destroy();

  const selection = _selection.create(event);
  if (!selection) return destroy();

  const character = node.textContent[selection.start];
  if (!character || !hanzi.ifComponentExists(character)) return destroy();

  const box = selection.getBox();
  const popup = await _popup.create({
    x: box.x + box.width,
    y: box.y,
    width: box.width,
    height: box.height,
  });

  await popup.setCharacter(character);

  return;
}

hanzi.start();

console.info('铬汉字。');

document.addEventListener('mousemove', debouncedMousemove, false);
