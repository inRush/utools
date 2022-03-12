export function outerHeight(elm: HTMLElement) {
  let elmHeight = parseInt(window.getComputedStyle(elm, '').getPropertyValue('height'));
  let elmMargin = parseInt(window.getComputedStyle(elm, '').getPropertyValue('margin-top')) + parseInt(window.getComputedStyle(elm, '').getPropertyValue('margin-bottom'));
  return (elmHeight + elmMargin);
}
