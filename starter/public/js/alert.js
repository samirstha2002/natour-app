// remove old alert if exist
export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// create newalert here type can be sucess or error
export const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class= "alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};
