// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  form: document.querySelector('.form'),
};

const createNotification = (status, result) => {
  const isSuccess = status === STATUS.FULFILLED;

  const msg = {
    backgroundColor: isSuccess ? '#4CAF50' : '#FF5722',
    color: 'white',
    title: 'Notification',
    message: isSuccess
      ? `✅ Fulfilled promise in ${result}ms`
      : `❌ Rejected promise in ${result}ms`,
    position: 'topRight',
    timeout: 2000,
    close: false,
    pauseOnHover: false,
    drag: false,
  };

  iziToast.show(msg);
};

const STATUS = {
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected',
};

const onFormSubmit = event => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const state = formData.get('state');
  const delay = Number(formData.get('delay'));

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === STATUS.FULFILLED) {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });

  promise
    .then(result => {
      createNotification(STATUS.FULFILLED, result);
    })
    .catch(error => {
      createNotification(STATUS.REJECTED, error);
    });
};

refs.form.addEventListener('submit', onFormSubmit);
