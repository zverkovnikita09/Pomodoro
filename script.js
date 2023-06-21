window.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.container');
  const minutesHtml = document.querySelector('.minutes');
  const secondsHtml = document.querySelector('.seconds');
  const startBtn = document.querySelector('.startBtn');
  const nextStepButton = document.querySelector('.next-step');
  const settingsButton = document.querySelector('.settings-button');
  const settings = document.querySelector('.settings')
  const tasksBlock = document.querySelector('.tasks-container')

  const tasks = [{
    id: 1,
    task: 'babababa',
    isDone: true,
    pomodoros: 0
  }, {
    id: 2,
    task: 'bebebebe',
    isDone: false,
    pomodoros: 0
  }]

  let initialTimerValues = {
    workTime: 25 * 60,
    shortBreakTime: 5 * 60,
    LongBreakTime: 15 * 60,
  };

  let time = initialTimerValues.workTime; //in seconds
  let interval;
  let isInterval;
  let iteration = 1;

  const renderTime = () => {
    let minutes = String(Math.floor(time / 60));
    let seconds = String(time - minutes * 60)
    if (minutes.length < 2) {
      minutes = '0' + minutes
    }
    if (seconds.length < 2) {
      seconds = '0' + seconds
    }
    minutesHtml.innerHTML = minutes;
    secondsHtml.innerHTML = seconds;
  }

  const switchTimer = (timerType) => {
    if (timerType === 'workTime') {
      time = initialTimerValues.workTime;
      container.classList = 'container work'
    }
    if (timerType === 'shortBreak') {
      time = initialTimerValues.shortBreakTime;
      container.classList = 'container short-break'
    }
    if (timerType === 'longBreak') {
      time = initialTimerValues.LongBreakTime;
      container.classList = 'container long-break'
    }
    renderTime();
  }

  const stopTimer = () => {
    startBtn.innerHTML = 'Старт'
    isInterval = false;
    clearInterval(interval)
  }

  const nextPeriod = () => {
    iteration++;
    stopTimer();
    if ((iteration / 2) % 4 === 0) {
      switchTimer('longBreak')
      return
    }
    if (iteration % 2 === 0) {
      switchTimer('shortBreak')
      return
    }
    switchTimer('workTime')
  }

  const startTimer = () => {
    startBtn.innerHTML = 'Пауза'
    isInterval = true;
    interval = setInterval(() => {
      if (!time) {
        nextPeriod()
        return
      }

      time--;
      renderTime();
    }, 1000)
  }

  const toggleTimer = () => {
    isInterval ? stopTimer() : startTimer()
  }

  const renderTasks = () => {
    tasks.forEach(task=>{
      tasksBlock.innerHTML += `<li class="task ${task.isDone ? 'done' : ''}">
      ${task.task}
      </li>`
    })
  }

  const toggleSettings = () => {
    settings.classList.toggle('open');
    window.addEventListener('click', closeSettingByOutsideClick)
  }

  const closeSettingByOutsideClick = (e) => {
    if (e.target !== settings && e.target !== settingsButton) {
      settings.classList.remove('open')
      window.removeEventListener('click', closeSettingByOutsideClick)
    }
  }

  startBtn.addEventListener('click', toggleTimer);
  nextStepButton.addEventListener('click', nextPeriod);
  settingsButton.addEventListener('click', toggleSettings)
  renderTime();
  renderTasks();
})