const buttonsBlock = document.querySelector(".buttons");

const buttons = Array.from(buttonsBlock.querySelectorAll("button"));
const numbersBtn = Array.from(buttonsBlock.querySelectorAll(".number"));
const operatorsBtn = Array.from(buttonsBlock.querySelectorAll(".operator"));

const substractBtn = buttonsBlock.querySelector('[data-value="-"]');
const dotBtn = buttonsBlock.querySelector('[data-value="."]');

const onOffBtn = buttonsBlock.querySelector("#on");
const allClearBtn = buttonsBlock.querySelector("#all-clear");
const deleteBtn = buttonsBlock.querySelector("#delete");
const resultBtn = buttonsBlock.querySelector("#result");

const display = document.querySelector(".display");
const expression = display.querySelector("#expression");
const inputNumber = display.querySelector("#current");

const errorMessage = [
  "Are you serious?",
  "Please, stop...",
  "This is not funny :-/",
  "I feel pain ;-[",
];

let isOn = false;

let operand1 = null;
let operator = null;
let currentNumber = null;
let result = null;

function resetVar() {
  operand1 = null;
  operator = null;
  currentNumber = null;
  result = null;
}

function operate(a, b, op) {
  a = +a;
  b = +b;
  let result = 0;
  switch (op) {
    case "+":
      result = Math.round((a + b) * 1000) / 1000;
      break;
    case "-":
      result = Math.round((a - b) * 1000) / 1000;
      break;
    case "*":
      result = Math.round(a * b * 1000) / 1000;
      break;
    case "/":
      if (b !== 0) {
        result = Math.round((a / b) * 1000) / 1000;
      } else {
        result = errorMessage[Math.floor(Math.random() * 4)];
      }
      break;
  }

  return result;
}

function updateDisplay() {
  inputNumber.textContent = result ?? currentNumber ?? "0";
  expression.textContent =
    operand1 !== null
      ? operand1 + (operator ?? "") + (currentNumber ?? "")
      : (currentNumber ?? "0");
}

function toggleOn() {
  if (isOn) {
    isOn = false;
    display.classList.remove("active");

    expression.replaceChildren();
    inputNumber.replaceChildren();

    resetVar();

    buttons.forEach((button) => (button.disabled = true));

    dotBtn.disabled = false;
    onOffBtn.disabled = false;
  } else {
    isOn = true;
    display.classList.add("active");

    updateDisplay();

    buttons.forEach((button) => (button.disabled = false));
  }
}

function handleResult() {
  if (operand1 !== null && operator && currentNumber !== null) {
    result = operate(operand1, currentNumber, operator);
    updateDisplay();

    resetVar();
    dotBtn.disabled = false;
  }
}

function handleAllClear() {
  dotBtn.disabled = false;

  resetVar();

  updateDisplay();
}

function handleDelete() {
  dotBtn.disabled = false;

  currentNumber = null;

  updateDisplay();
}

function handleOperator(op) {
  if (currentNumber === null && operand1 === null) {
    return;
  }

  if (operand1 === null) {
    operand1 = currentNumber;
  } else if (operand1 !== null && currentNumber !== null) {
    operand1 = operate(operand1, currentNumber, operator);
  }

  currentNumber = null;
  operator = op;
  dotBtn.disabled = false;

  updateDisplay();
}

function handleNumber(value) {
  if (value === '.') {
    if (currentNumber?.includes('.')) return;

    currentNumber = currentNumber ? currentNumber + '.' : '0.';
    dotBtn.disabled = true;
    return updateDisplay();
  }

  if (currentNumber === null) {
    currentNumber = value === '00' ? '0' : value;
    return updateDisplay();
  }
  
  if (currentNumber === '0') {
    if (value === '0' || value === '00') return;

    currentNumber = value;
    return updateDisplay();
  }

  currentNumber += value;

  return updateDisplay();
}

buttonsBlock.addEventListener("click", (event) => {
  let button = event.target.closest("button");

  if (!button) return;

  if (button === onOffBtn) toggleOn();

  if (button === allClearBtn) handleAllClear();

  if (button === deleteBtn) handleDelete();

  if (button === resultBtn) handleResult();

  if (operatorsBtn.includes(button)) handleOperator(button.dataset.value);

  if (numbersBtn.includes(button)) handleNumber(button.dataset.value);

  console.log(`operand1 = ${operand1}
operator = ${operator}
currentNumber = ${currentNumber}
result = ${result}`);
});

document.addEventListener("keydown", (event) => {
  let key = event.key;
  const numberArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const operatorArr = ['+', '-', '/', '*']

  console.log(key);

  if (!key) return;

  if (key === ' ' || key === 'Spacebar') toggleOn();

  if (key === 'Escape') handleAllClear();

  if (key === 'Backspace') handleDelete();

  if (key === 'Enter' || key === '=') handleResult();

  if (operatorArr.includes(key)) handleOperator(key);

  if (numberArr.includes(key)) handleNumber(key);

  console.log(`operand1 = ${operand1}
operator = ${operator}
currentNumber = ${currentNumber}
result = ${result}`);
});

// TODO:
// [] Разнести обработчики по функциям
// [] Добавить поддержку клавиатуры

// Типы кнопок
// - number - цифры и .
// - operator - + - * /
// - equals =
// - action - AC, DEL, ON/OFF

// Данные кнопки
// Кнопка содержит
// - type
// - value

// Событийная модель
// - один обработчик на контейнер с кнопками
// - closest('button')
// - игнор невалидных кликов
// - передача type value в логику

// Разделение ответственности
// - обработчик событий -> только маршрутизация
// - логика -> изменение состояния
// - вычисление -> отдельная функция

// Состояние калькулятора
// - operand1 - первое число / результат (null)
// - operator - текущий оператор (null)
// - currentNumber - буфер ввода ('')

// Роль currentNumber
// - буфер ввода
// - превращается в операнд только при клике на оператор либо =

// Правила обработки чисел
// - При вводе цифры дописывается в currentNumber

// Правила обработки десятичной точки
// - если currentNumber содержит точку -> игнор
// - если пустое значение currentNumber -> 0.
// - после оператора = -> 0.
// - currentNumber содержит максимум одну точку

// Правила обработки оператора
// - operand1 = null, currentNumber = '' -> игнор
// - currentNumber = X, operand1 = null -> operand1 = X, currentNumber = '', operator = current
// - operand1 = X, currentNumber = Y, operator = есть -> вычисление X op Y, результат -> operand1, currentNumber = '', operator = новый
// - operand1 = X, currentNumber = '', operator = есть -> operator = новый

// Правила обработки =
// operand1 = X
// operator = op
// currentNumber = Y ->
// вычисление, результат -> operand1, operator = null, currentNumber = ''
// иначе игнор

// Поведение после =
// - следующий ввод -> новая операция
// - результат остается в operand1

// Невалидные сценарии
// - + в начале -> игнор
// - = без данных -> игнор
// - 2 + - -> замена оператора
// - деление на нуль -> сообщение об ошибке

// Триггеры вычислений
// - =
// - ввод нового оператора (если есть оба операнда)

// Принцип архитекутры
// - UI -> только события
// - state -> источник правды
// - вычисления -> централизованы

// Ограничения версии
// Поддерживается
// - базовые операции
// - цепочки вычислений

// Не поддерживается
// - парсинг выражений
// - продвинутые функции
