import { clamp } from './clamp';

export class Selection {
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

    try {
      range.setEnd(
        range.endContainer,
        clamp(range.endOffset + 1, 0, range.endContainer.length)
      );
    } catch (error) {
      console.error(error);
    }

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
  }

  get start() {
    return this.range.startOffset;
  }
}
