window.addEventListener('DOMContentLoaded', () => {
  const minutesHtml = document.getElementById('minutes');
  const secondsHtml = document.getElementById('seconds');
  const startBtn = document.getElementById('start');

  let minutes = 1;
  let seconds = 0;
  let interval;
  let isInterval;
  let period = 1;

  const renderMinutes = () => {
    let minutesString = String(minutes);
    if (minutesString.length < 2) {
      minutesString = '0' + minutesString
    }
    minutesHtml.innerHTML = minutesString;
  }

  const renderSeconds = () => {
    let secondsString = String(seconds);
    if (secondsString.length < 2) {
      secondsString = '0' + secondsString
    }
    secondsHtml.innerHTML = secondsString;
  }

  const updateTimer = () => {
    if (seconds) {
      seconds--;
      renderSeconds();
    }
    else {
      if (minutes) {
        seconds = 59;
        minutes--;
        renderMinutes();
        renderSeconds();
      }
      else clearInterval(interval);
    }
  }

  const startTimer = () => {
    startBtn.innerHTML = 'Пауза'
    isInterval = true;
    interval = setInterval(updateTimer, 1000)
  }

  const pauseTimer = () => {
    startBtn.innerHTML = 'Старт'
    isInterval = false;
    clearInterval(interval)
  }

  const toggleTimer = () => {
    isInterval ? pauseTimer() : startTimer()
  }

  renderMinutes();
  renderSeconds();
  startBtn.addEventListener('click', toggleTimer);
})