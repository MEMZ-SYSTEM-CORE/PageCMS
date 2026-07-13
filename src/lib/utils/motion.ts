import { animate, inView, stagger, spring } from '@motionone/dom';

export function fadeInUp(node: HTMLElement, opts: { delay?: number; duration?: number } = {}) {
  const { delay = 0, duration = 0.5 } = opts;
  const controls = inView(node, () => {
    node.classList.add('mo-ready');
    animate(node, { opacity: [0, 1], transform: ['translateY(20px)', 'translateY(0px)'] }, { duration, delay, easing: spring() });
  });
  return { destroy() { controls(); } };
}

export function fadeIn(node: HTMLElement, opts: { delay?: number; duration?: number } = {}) {
  const { delay = 0, duration = 0.5 } = opts;
  const controls = inView(node, () => {
    node.classList.add('mo-ready');
    animate(node, { opacity: [0, 1] }, { duration, delay });
  });
  return { destroy() { controls(); } };
}

export function staggerChildren(node: HTMLElement, opts: { delay?: number; duration?: number } = {}) {
  const { delay = 0.1, duration = 0.4 } = opts;
  let hasAnimated = false;
  function animateNewChildren() {
    const children = Array.from(node.children).filter((child): child is HTMLElement => child instanceof HTMLElement && !child.classList.contains('mo-ready'));
    if (children.length === 0) return;
    children.forEach((child) => child.classList.add('mo-ready'));
    animate(children, { opacity: [0, 1], transform: ['translateY(15px)', 'translateY(0px)'] }, { duration, delay: stagger(delay), easing: spring() });
  }
  const controls = inView(node, () => { hasAnimated = true; animateNewChildren(); });
  const observer = new MutationObserver(() => { if (hasAnimated) animateNewChildren(); });
  observer.observe(node, { childList: true });
  return { destroy() { controls(); observer.disconnect(); } };
}

export { animate, inView, stagger, spring };
