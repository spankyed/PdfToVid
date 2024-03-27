/**
 * Scrolls an element into view or to a specified position and returns a promise that resolves when the scroll ends.
 * @param {Element} element - The DOM element to perform the scroll action on.
 * @param {Object} options - The options for scrolling.
 * @param {string} method - The method of scrolling, either 'scrollIntoView' or 'scrollTo'.
 * @returns {Promise<void>} A promise that resolves when the scrolling ends.
 */
export function scrollToElement({
  element, container = { current: null }, options, method = 'scrollIntoView',
}) {
  const scrollEl = container?.current || element;
  return new Promise((resolve, reject) => {
    if (!element) {
      reject('Element not provided or does not exist.');
      return;
    }

    const onScrollEnd = () => {
      console.log('onScrollEnd: ');
      scrollEl.removeEventListener('scrollend', onScrollEnd);
      resolve(true);
    };
    

    scrollEl.addEventListener('scrollend', onScrollEnd);

    if (method === 'scrollIntoView') {
      element.scrollIntoView(options);
    } else if (method === 'scrollTo') {
      element.scrollTo(options);
    } else {
      scrollEl.removeEventListener('scrollend', onScrollEnd);
      reject('Invalid scroll method specified.');
    }
  });
}
