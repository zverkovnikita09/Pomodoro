window.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('.wrapper');
  const minutesHtml = document.querySelector('.minutes');
  const secondsHtml = document.querySelector('.seconds');
  const startBtn = document.querySelector('.startBtn');
  const nextStepButton = document.querySelector('.next-step');
  const tasksBlock = document.querySelector('.tasks-container');
  const periodsBlock = document.querySelector('.period');
  const resetBtn = document.querySelector('.reset');

  //settings
  const settings = document.querySelector('.settings-block');
  const settingsButton = settings.querySelector('.settings-button');
  const workTimeValueHtml = settings.querySelector('.work-value');
  const shortBreakValueHtml = settings.querySelector('.short-break-value');
  const longBreakValueHtml = settings.querySelector('.long-break-value');
  const periodValueHtml = settings.querySelector('.period-value');
  const settingChangeablesBlocks = settings.querySelectorAll('.settings-changeable')

  const addTaskBlock = document.querySelector('.task-add-block');
  const addTaskButton = addTaskBlock.querySelector('.task-add-button');
  const addTaskInput = addTaskBlock.querySelector('.task-add-input');
  const addTaskCancelButton = addTaskBlock.querySelector('.task-add-cancel');
  const addTaskChangeable = addTaskBlock.querySelector('.changeable');
  const addTaskSubmit = addTaskBlock.querySelector('.task-add-submit')

  let activeTask = 0;
  let tasks = []

  let initialTimerValues = {
    workTime: 25 * 60,
    shortBreakTime: 5 * 60,
    LongBreakTime: 15 * 60,
  };

  let time = initialTimerValues.workTime; //in seconds
  let interval;
  let isInterval;
  let iteration = 1;
  let periodsToLong = 4;

  function renderTime() {
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

  function renderPeriod() {
    periodsBlock.innerHTML = 'Период #' + Math.ceil(iteration / 2)
  }

  function renderTasks() {
    console.log(activeTask);
    tasksBlock.innerHTML = '';
    const sortedTasks = [...tasks.filter((item) => !item.isDone), ...tasks.filter((item) => item.isDone)]
    sortedTasks.forEach((task, index) => {
      tasksBlock.innerHTML += `<li class="task ${index === activeTask && !task.isDone ? 'active' : ''} ${task.isDone ? 'done' : ''}" data-id=${task.id}>
        <button type="button" class="task-done-button">
          <i class="fa-solid fa-check"></i>
        </button>
        <p class="task-text">${task.task}</p>
        <div class="task-right-block">
          <p class="task-pomodoros">${Math.floor(task.pomodorosDone)} / ${task.pomodoros}</p>
          <button type="button" class="task-delete-button">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </li>`
    })
    document.querySelectorAll('.task')?.forEach(el => {
      el.addEventListener('click', () => {
        makeTaskActive(el.dataset.id)
      })
      el.querySelector('.task-delete-button').addEventListener('click', () => {
        deleteTask(el.dataset.id)
      })
      el.querySelector('.task-done-button').addEventListener('click', () => {
        makeTaskDone(el.dataset.id)
      })
    })
  }

  function renderSettingsInput() {
    workTimeValueHtml.innerHTML = initialTimerValues.workTime / 60;
    shortBreakValueHtml.innerHTML = initialTimerValues.shortBreakTime / 60;
    longBreakValueHtml.innerHTML = initialTimerValues.LongBreakTime / 60;
    periodValueHtml.innerHTML = periodsToLong;
    settingChangeablesBlocks.forEach(el => initChangeableEvents(el, 99, 1));
  }

  function initChangeableEvents(element, max, min) {
    const valueSpan = element.querySelector('.changeable-value');
    let value = Number(valueSpan.innerText);
    element.querySelector('.increase').addEventListener('click', () => {
      if (value + 1 > max) {
        value = max;
      }
      else value = value + 1;
      valueSpan.innerText = value;
    })
    element.querySelector('.decrease').addEventListener('click', () => {
      if (value - 1 < min) {
        value = min;
      }
      else value = value - 1;
      valueSpan.innerText = value;
    })
  }

  function addTask() {
    if (!addTaskInput.value) return

    const newTask = {
      id: Date.now(),
      task: addTaskInput.value,
      isDone: false,
      pomodoros: Number(addTaskChangeable.querySelector('.changeable-value').innerHTML),
      pomodorosDone: 0,
    }

    addTaskInput.value = '';
    tasks.push(newTask);
    renderTasks();
    closeAddTaskBlock()
  }

  function deleteTask(id) {
    const elemPosition = tasks.findIndex(el => el.id === Number(id));
    tasks = [...tasks.slice(0, elemPosition), ...tasks.slice(elemPosition + 1)]
    if (activeTask === elemPosition) {
      activeTask = 0;
    }
    renderTasks()
  }

  function makeTaskActive(id) {
    const elemPosition = tasks.findIndex(el => el.id === Number(id));
    if (tasks[elemPosition]?.isDone) return
    activeTask = elemPosition;
    renderTasks()
  }

  function makeTaskDone(id) {
    const elemPosition = tasks.findIndex(el => el.id === Number(id));
    if (activeTask === elemPosition) {
      activeTask = 0
    }
    const itemUpdated = { ...tasks[elemPosition], isDone: true }
    tasks = [...tasks.slice(0, elemPosition), itemUpdated, ...tasks.slice(elemPosition + 1)]
    renderTasks()
  }

  function switchTimer(timerType) {
    if (timerType === 'workTime') {
      time = initialTimerValues.workTime;
      wrapper.classList = 'wrapper work'
    }
    if (timerType === 'shortBreak') {
      time = initialTimerValues.shortBreakTime;
      wrapper.classList = 'wrapper short-break'
    }
    if (timerType === 'longBreak') {
      time = initialTimerValues.LongBreakTime;
      wrapper.classList = 'wrapper long-break'
    }
    renderTime();
  }

  function nextPeriod(stop = true) {
    iteration++;
    stop && stopTimer();
    renderPeriod();

    if (tasks.length) {
      tasks[activeTask].pomodorosDone += 0.5;
      renderTasks()
    }

    if ((iteration / 2) % periodsToLong === 0) {
      switchTimer('longBreak')
      return
    }
    if (iteration % 2 === 0) {
      switchTimer('shortBreak')
      return
    }
    switchTimer('workTime')
  }

  function startTimer() {
    startBtn.innerHTML = '<i class="fa-solid fa-pause"></i>'
    isInterval = true;
    interval = setInterval(() => {
      if (!time) {
        nextPeriod(false)
        return
      }

      time--;
      renderTime();
    }, 1000)
  }

  function stopTimer() {
    startBtn.innerHTML = '<i class="fa-solid fa-play"></i>'
    isInterval = false;
    clearInterval(interval)
  }

  function toggleTimer() {
    isInterval ? stopTimer() : startTimer()
  }

  function resetTimer() {
    stopTimer();
    switchTimer('workTime');
    iteration = 1;
    renderPeriod();
  }

  function toggleSettings() {
    settings.querySelector('.settings').classList.toggle('open');
  }

  function setSettings(e) {
    e.preventDefault();
    const workTime = Number(workTimeValueHtml.innerHTML);
    const shortBreak = Number(shortBreakValueHtml.innerHTML);
    const longBreak = Number(longBreakValueHtml.innerHTML);
    const period = Number(periodValueHtml.innerHTML);

    initialTimerValues.workTime = workTime * 60;
    initialTimerValues.shortBreakTime = shortBreak * 60;
    initialTimerValues.LongBreakTime = longBreak * 60;
    periodsToLong = period;

    settings.querySelector('.settings').classList.remove('open');
    renderSettingsInput();
    resetTimer();
  }

  function openAddTaskBlock() {
    addTaskBlock.classList.add('dropdown-open')
  }

  function closeAddTaskBlock() {
    addTaskBlock.classList.remove('dropdown-open')
  }

  //event-listeners
  startBtn.addEventListener('click', toggleTimer);
  nextStepButton.addEventListener('click', nextPeriod);
  settingsButton.addEventListener('click', toggleSettings);
  resetBtn.addEventListener('click', resetTimer);
  settings.querySelector('.settings').addEventListener('submit', setSettings);
  addTaskButton.addEventListener('click', openAddTaskBlock);
  addTaskCancelButton.addEventListener('click', closeAddTaskBlock);
  addTaskSubmit.addEventListener('click', addTask)

  //first render
  renderTime();
  renderTasks();
  renderPeriod();
  renderSettingsInput();
  initChangeableEvents(addTaskChangeable, 100, 1)
})