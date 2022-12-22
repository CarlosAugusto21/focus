let sec = 60
let min = 24
let flag
const today = document.querySelector('.data')
const data = new Date()
const timer = document.querySelector('.watch')

/* POMODORO */
const start = () => {
  cliqueBtn()
}

const cliqueBtn = () => {
  document.addEventListener('click', e => {
    const el = e.target

    if (el.classList.contains('start')) inicio()
    if (el.classList.contains('reset')) resetar()
  })
}

const resetar = () => {
  clearInterval(flag)
  min = 24
  sec = 60
  document.getElementById('watch').innerText = `25:00`
}

const inicio = () => {
  flag = setInterval(watch, 1000)
}

const finish = () => {
  clearInterval(flag)
  min = 24
  sec = 60
  document.getElementById('watch').innerText = `Volte em 5 minutos`
}

const watch = () => {
  sec--
  if (sec == 00) {
    min--
    sec = 60
  }

  document.getElementById('watch').innerText = twodg(min) + ':' + twodg(sec)

  if (min === 0) {
    if (sec === 1) {
      finish()
    }
  }
}

const twodg = num => {
  if (num < 10) return `0${num}`
  else {
    return num
  }
}

function getDiadaSemana(diaSemana) {
  const day = [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado'
  ]
  return day[diaSemana]
}

function getMes(mes) {
  const month = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ]
  return month[mes]
}

function criarData(data) {
  const diaSemana = data.getDay()
  const mes = data.getMonth()

  const nomeDia = getDiadaSemana(diaSemana)
  const nomeMes = getMes(mes)

  return `${nomeDia}, ${data.getDate()} de ${nomeMes} de ${data.getFullYear()} `
}

today.innerText = criarData(data)

start()

/* To do List */
const todoAdd = document.querySelector('#todoAdd')
const addInput = document.querySelector('#todo-input')
const todoList = document.querySelector('#todo-list')
const formEdit = document.querySelector('#form-edit')
const editInput = document.querySelector('#edit-input')
const cancelEditBtn = document.querySelector('#cancel-edit-btn')
const todoCl = document.querySelector('.todo')

let oldInputText

const saveTodo = (text, done = 0, save = 1) => {
  const todo = document.createElement('div')
  todo.classList.add('todo')
  const todoTitle = document.createElement('h3')
  todoTitle.innerText = text
  todo.appendChild(todoTitle)

  const doneBtn = document.createElement('button')
  doneBtn.classList.add('btn-check')
  doneBtn.innerHTML = '<i class="fa solid fa-check"></i>'
  todo.appendChild(doneBtn)

  const editBtn = document.createElement('button')
  editBtn.classList.add('btn-edit')
  editBtn.innerHTML = '<i class="fa solid fa-pen"></i>'
  todo.appendChild(editBtn)

  const deleteBtn = document.createElement('button')
  deleteBtn.classList.add('btn-delete')
  deleteBtn.innerHTML = '<i class="fa solid fa-xmark"></i>'
  todo.appendChild(deleteBtn)

  if (done) {
    todo.classList.add('done')
  }

  if (save) {
    saveTodoLocalStorage({ text, done: 0 })
  }

  todoList.appendChild(todo)

  addInput.value = ''
  addInput.focus()
}

const editToggle = () => {
  formEdit.classList.toggle('hide')
  todoList.classList.toggle('hide')
}

const inputNew = text => {
  const todos = document.querySelectorAll('.todo')

  todos.forEach(todo => {
    let todoText = todo.querySelector('h3')

    if (todoText.innerText === oldInputText) todoText.innerText = text

    updateTodoLocalStorage(oldInputText, text)
  })
}

todoAdd.addEventListener('submit', e => {
  e.preventDefault()

  const inputValue = addInput.value

  if (inputValue) saveTodo(inputValue)
})

document.addEventListener('click', e => {
  const el = e.target
  const parent = el.closest('div')
  let todoText

  if (parent && parent.querySelector('h3')) {
    todoText = parent.querySelector('h3').innerHTML || ''
  }

  if (el.classList.contains('btn-check')) {
    parent.classList.toggle('done')
    updateTodoStatusLocalStorage(todoText)
  }
  if (el.classList.contains('btn-edit')) {
    editToggle()
    editInput.value = todoText
    oldInputText = todoText
  }

  if (el.classList.contains('btn-delete')) {
    parent.remove()
    removeTodoLocalStorage(todoText)
  }
})

cancelEditBtn.addEventListener('click', e => {
  e.preventDefault()

  editToggle()
})

formEdit.addEventListener('submit', e => {
  e.preventDefault()

  const editInputvalue = editInput.value

  if (editInputvalue) inputNew(editInputvalue)

  editToggle()
})

/* LOCAL */

const getTodosLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem('todos')) || []

  return todos
}

const loadTodos = () => {
  const todos = getTodosLocalStorage()

  todos.forEach(todo => {
    saveTodo(todo.text, todo.done, 0)
  })
}

const saveTodoLocalStorage = todo => {
  const todos = getTodosLocalStorage()

  todos.push(todo)

  localStorage.setItem('todos', JSON.stringify(todos))
}

const removeTodoLocalStorage = todoText => {
  const todos = getTodosLocalStorage()

  const filteredTodos = todos.filter(todo => todo.text != todoText)

  localStorage.setItem('todos', JSON.stringify(filteredTodos))
}

const updateTodoStatusLocalStorage = todoText => {
  const todos = getTodosLocalStorage()

  todos.map(todo => (todo.text === todoText ? (todo.done = !todo.done) : null))

  localStorage.setItem('todos', JSON.stringify(todos))
}

const updateTodoLocalStorage = (todoOldText, todoNewText) => {
  const todos = getTodosLocalStorage()

  todos.map(todo =>
    todo.text === todoOldText ? (todo.text = todoNewText) : null
  )

  localStorage.setItem('todos', JSON.stringify(todos))
}

loadTodos()
