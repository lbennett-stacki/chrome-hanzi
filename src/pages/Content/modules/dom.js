export function isTextNode(el) {
  return Boolean(el && el.nodeType === el.TEXT_NODE);
}

export function findTextNode(el, children = [], index = 0) {
  if (!el) {
    return;
  }

  if (isTextNode(el)) {
    return el;
  }

  let nextChildren =
    children.length > 0 && children.length > index ? children : el.childNodes;

  return findTextNode(el.childNodes[index], nextChildren, index + 1);
}

export function isChildOf(el, to) {
  if (el === to) {
    return true;
  }

  if (el.parentNode) {
    return isChildOf(el.parentNode, to);
  }

  return false;
}

