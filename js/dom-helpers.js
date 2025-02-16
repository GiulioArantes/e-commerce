// Function: Simplified element creation
export const createElement = (tag, className, content, attributes = {}) => {
  const element = document.createElement(tag);
  if (className) element.classList.add(className);
  if (content) element.textContent = content;
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }
  return element;
};

export const toggleElement = (element, displayStyle) => {
  element.style.display = displayStyle;
};
