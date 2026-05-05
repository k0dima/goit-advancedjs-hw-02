// Описаний в документації
import flatpickr from 'flatpickr';
// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';

// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate = null;
let timerId = null;

const refs = {
  startBtn: document.querySelector('[data-start]'),
  datetimePicker: document.querySelector('#datetime-picker'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    clearInterval(timerId);
    setData(0);

    userSelectedDate = selectedDates[0];

    const today = Date.now();

    if (today > userSelectedDate) {
      iziToast.show({
        message: 'Please choose a date in the future',
        color: 'orange',
        position: 'center',
        closeOnClick: true,
      });

      refs.startBtn.disabled = true;
    } else {
      refs.startBtn.disabled = false;
    }
  },
};

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

const addLeadingZero = value => `${value}`.padStart(2, '0');

const setData = time => {
  const { days, hours, minutes, seconds } = convertMs(time);

  refs.days.textContent = addLeadingZero(days);
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
};

flatpickr(refs.datetimePicker, options);

refs.startBtn.disabled = true;

refs.startBtn.addEventListener('click', () => {
  refs.startBtn.disabled = true;
  refs.datetimePicker.disabled = true;

  const startInterval = () => {
    const deltaTime = userSelectedDate - Date.now();

    if (deltaTime <= 0) {
      clearInterval(timerId);
      setData(0);
      refs.datetimePicker.disabled = false;
      return;
    }

    setData(deltaTime);
  };

  startInterval();
  timerId = setInterval(startInterval, 1000);
});
