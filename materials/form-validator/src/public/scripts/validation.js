const form = document.getElementById('searchForm');

function customValidate(ev) {
  const form = ev.target;
  const input = form.querySelector('#email');
  const errorMsg = document.getElementById('error-msg');

  if (!input.checkValidity()) {
    ev.preventDefault();
    errorMsg.textContent = input.validationMessage;
    return false;
  }

  errorMsg.textContent = '';
  return true;
}

form.addEventListener('submit', customValidate);
