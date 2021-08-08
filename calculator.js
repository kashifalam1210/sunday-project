"use strict";

class Calculator {
  constructor(prevOperandTextElement, currOperandTextElement) {
    this.prevOperandTextElement = prevOperandTextElement;
    this.currOperandTextElement = currOperandTextElement;
    this.resetLastOperation = false;
    this.allClear();
  }

  allClear() {
    this.currOperand = "";
    this.prevOperand = "";
    this.operator = undefined;
    this.resetLastOperation = false;
  }

  delete() {
    this.currOperand = this.currOperand.toString().slice(0, -1);
    this.resetLastOperation = false;
  }

  attachNumber(number) {
    if (number === "." && this.currOperand.includes(".")) return;
    this.currOperand = this.currOperand.toString() + number.toString();
  }

  selectOperator(operator) {
    if (this.currOperand === "") return;
    if (this.prevOperand !== "") {
      this.operate();
    };
    this.operator = operator;
    this.prevOperand = this.currOperand;
    this.currOperand = "";
  }

  operate(calcResults, prevNumber, currNumber) {
    currNumber = parseFloat(this.currOperand);
    prevNumber = parseFloat(this.prevOperand);
    if (isNaN(prevNumber) || isNaN(currNumber)) return;
      switch (this.operator) {
        case "÷":
          if (currNumber === 0) {
            calcResults = "Infinity (NaN)";
          } else {
            calcResults = Math.round((prevNumber / currNumber) * 1000) / 1000;
          }
          break;
        case "×":
          calcResults = Math.round((prevNumber * currNumber) * 1000) / 1000;
          break;
        case "-":
          calcResults = Math.round((prevNumber - currNumber) * 1000) / 1000;
          break;
        case "+":
          calcResults = Math.round((prevNumber + currNumber) * 1000) / 1000;
          break;
        default:
          return;
      }
    this.resetLastOperation = true;
    this.currOperand = calcResults;
    this.operator = undefined;
    this.prevOperand = "";
  }

  updateCalculatorDisplay() {
    this.currOperandTextElement.innerText = this.currOperand;
    if (this.operator != null) {
      this.prevOperandTextElement.innerText = `${this.prevOperand} ${this.operator}`;
    } else {
      this.prevOperandTextElement.innerText = "";
    }
  }
}

const keyboardSupport = (e) => {
  const keys = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", ".",
    "/", "*", "-", "+",
    "Escape", "Backspace", "Enter"
  ];
  const key = e.key;
  if (!keys.includes(e.key)) return;
    switch (key) {
      case "Escape":
        calculator.allClear();
        calculator.updateCalculatorDisplay();
        break;
      case "Backspace":
        calculator.delete();
        calculator.updateCalculatorDisplay();
        break;
      case "Enter":
        e.preventDefault();
        calculator.operate();
        calculator.updateCalculatorDisplay();
        break;
      case "/":
        calculator.selectOperator("÷");
        calculator.updateCalculatorDisplay();
        break;
      case "*":
        calculator.selectOperator("×");
        calculator.updateCalculatorDisplay();
        break;
      case "-":
        calculator.selectOperator("-");
        calculator.updateCalculatorDisplay();
        break;
      case "+":
        calculator.selectOperator("+");
        calculator.updateCalculatorDisplay();
        break;
      default:
        if (calculator.prevOperand === "" && calculator.currOperand !== "" && calculator.resetLastOperation) {
            calculator.currOperand = "";
            calculator.resetLastOperation = false;
        }
        calculator.attachNumber(e.key);
        calculator.updateCalculatorDisplay();
    }
};

const prevOperandTextElement = document.querySelector("[data-prevOperand]");
const currOperandTextElement = document.querySelector("[data-currOperand]");
const allClearBtn = document.querySelector("[data-allClear]");
const delBtn = document.querySelector("[data-del]");
const operatorBtns = document.querySelectorAll("[data-operator]");
const numberBtns = document.querySelectorAll("[data-number]");
const equalsBtn = document.querySelector("[data-equals]");

const calculator = new Calculator(prevOperandTextElement, currOperandTextElement);

numberBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    if(calculator.prevOperand === "" && calculator.currOperand !== "" && calculator.resetLastOperation) {
        calculator.currOperand = "";
        calculator.resetLastOperation = false;
      }
    calculator.attachNumber(btn.innerText);
    calculator.updateCalculatorDisplay();
  })
});

operatorBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    calculator.selectOperator(btn.innerText);
    calculator.updateCalculatorDisplay();
  })
});

equalsBtn.addEventListener("click", btn => {
  calculator.operate();
  calculator.updateCalculatorDisplay();
});

allClearBtn.addEventListener("click", btn => {
  calculator.allClear();
  calculator.updateCalculatorDisplay();
});

delBtn.addEventListener("click", btn => {
  calculator.delete();
  calculator.updateCalculatorDisplay();
});

window.addEventListener("keydown", keyboardSupport);