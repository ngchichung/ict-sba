const scriptURL =
  'https://script.google.com/macros/s/AKfycbxkl2b81zBTurI4glrbPG8t1XfrDOnUOYdM8pMupf5O-7IRYmTyhy4qe285K_J7_h1e/exec'; // 將此處替換為你的 Google Apps Script URL

document.getElementById('addButton').addEventListener('click', addTodo);
loadHistory(); // 加載時獲取歷史記錄

let completedTasks = [];

function addTodo() {
  const taskInput = document.getElementById('taskInput');
  const taskText = taskInput.value.trim();

  if (taskText) {
    fetch(`${scriptURL}?task=${encodeURIComponent(taskText)}&action=add`, {
      method: 'GET',
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        const todoList = document.getElementById('todoList');
        const li = document.createElement('li');
        li.innerHTML = `
                <span>${taskText}</span>
                <div>
                    <button class="check-btn">✔️</button>
                    <button class="delete-btn">🗑️</button>
                </div>
            `;

        li.querySelector('.check-btn').addEventListener('click', function () {
          li.classList.toggle('completed');
          const status = li.classList.contains('completed')
            ? 'Complete'
            : 'Incomplete';

          if (li.classList.contains('completed')) {
            completedTasks.push(taskText);
          } else {
            completedTasks = completedTasks.filter((task) => task !== taskText);
          }

          updateTask(taskText, status);
          updateCompletedList();
        });

        li.querySelector('.delete-btn').addEventListener('click', function () {
          todoList.removeChild(li);
          deleteTask(taskText);
        });

        todoList.appendChild(li);
        taskInput.value = '';
      })
      .catch((err) => console.error('Error:', err));
  }
}

function updateCompletedList() {
  const completedList = document.getElementById('completedList');
  completedList.innerHTML = ''; // 清空已完成任務列表

  completedTasks.forEach((task) => {
    const li = document.createElement('li');
    li.textContent = task;
    completedList.appendChild(li);
  });
}

function loadHistory() {
  fetch(`${scriptURL}?action=getHistory`, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      const historyList = document.getElementById('historyList');
      historyList.innerHTML = ''; // 清空歷史記錄列表
      data.forEach((record) => {
        const li = document.createElement('li');
        li.textContent = `${record[0]}: "${record[1]}" at ${new Date(
          record[2]
        ).toLocaleString()}`;
        historyList.appendChild(li);
      });
    })
    .catch((err) => console.error('Error:', err));
}

function updateTask(task, status) {
  fetch(
    `${scriptURL}?task=${encodeURIComponent(task)}&status=${encodeURIComponent(
      status
    )}&action=update`,
    {
      method: 'GET',
    }
  )
    .then((response) => response.text())
    .then((data) => console.log(data))
    .catch((err) => console.error('Error:', err));
}

function deleteTask(task) {
  fetch(`${scriptURL}?task=${encodeURIComponent(task)}&action=delete`, {
    method: 'GET',
  })
    .then((response) => response.text())
    .then((data) => console.log(data))
    .catch((err) => console.error('Error:', err));
}
