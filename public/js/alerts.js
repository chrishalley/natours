// type is either 'success' or 'error'
export const showAlert = (type, message, duration = 5000) => {
  hideAlert(duration);
  const markup = `<div class=\"alert alert--${type}\">${message}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
};

export const hideAlert = duration => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
  window.setTimeout(hideAlert, duration);
};
