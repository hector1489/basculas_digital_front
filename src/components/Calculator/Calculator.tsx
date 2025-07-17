import React, { useState } from 'react';
import styles from './Calculator.module.css';

const Calculator: React.FC = () => {
  const [input, setInput] = useState<string>('0');
  const [currentOperator, setCurrentOperator] = useState<string | null>(null);
  const [prevValue, setPrevValue] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);

  const handleDigitClick = (digit: string) => {
    if (waitingForOperand) {
      setInput(digit);
      setWaitingForOperand(false);
    } else {
      setInput(input === '0' ? digit : input + digit);
    }
  };

  const handleDecimalClick = () => {
    if (waitingForOperand) {
      setInput('0.');
      setWaitingForOperand(false);
    } else if (!input.includes('.')) {
      setInput(input + '.');
    }
  };

  const handleOperatorClick = (operator: string) => {

    if (prevValue === null) {
      setPrevValue(input);
    } else if (currentOperator) {
      const result = performCalculation();
      setInput(String(result));
      setPrevValue(String(result));
    }

    setCurrentOperator(operator);
    setWaitingForOperand(true);
  };

  const performCalculation = () => {
    const prev = parseFloat(prevValue || '0');
    const current = parseFloat(input);

    if (currentOperator === '+') return prev + current;
    if (currentOperator === '-') return prev - current;
    if (currentOperator === '*') return prev * current;
    if (currentOperator === '/') {
      if (current === 0) {
        alert("No se puede dividir por cero.");
        return 0;
      }
      return prev / current;
    }
    return current;
  };

  const handleEqualsClick = () => {
    if (prevValue === null || currentOperator === null) return;

    const result = performCalculation();
    setInput(String(result));
    setPrevValue(null);
    setCurrentOperator(null);
    setWaitingForOperand(false);
  };

  const handleClear = () => {
    setInput('0');
    setCurrentOperator(null);
    setPrevValue(null);
    setWaitingForOperand(false);
  };

  const handleToggleSign = () => {
    setInput(String(parseFloat(input) * -1));
  };

  const handlePercentage = () => {
    setInput(String(parseFloat(input) / 100));
  };

  return (
    <div className={styles.calculatorContainer}>
      <div className={styles.display}>{input}</div>
      <div className={styles.buttons}>
        <button className={styles.buttonClear} onClick={handleClear}>AC</button>
        <button className={styles.buttonFunction} onClick={handleToggleSign}>+/-</button>
        <button className={styles.buttonFunction} onClick={handlePercentage}>%</button>
        <button className={styles.buttonOperator} onClick={() => handleOperatorClick('/')}>÷</button>

        <button className={styles.buttonDigit} onClick={() => handleDigitClick('7')}>7</button>
        <button className={styles.buttonDigit} onClick={() => handleDigitClick('8')}>8</button>
        <button className={styles.buttonDigit} onClick={() => handleDigitClick('9')}>9</button>
        <button className={styles.buttonOperator} onClick={() => handleOperatorClick('*')}>x</button>

        <button className={styles.buttonDigit} onClick={() => handleDigitClick('4')}>4</button>
        <button className={styles.buttonDigit} onClick={() => handleDigitClick('5')}>5</button>
        <button className={styles.buttonDigit} onClick={() => handleDigitClick('6')}>6</button>
        <button className={styles.buttonOperator} onClick={() => handleOperatorClick('-')}>-</button>

        <button className={styles.buttonDigit} onClick={() => handleDigitClick('1')}>1</button>
        <button className={styles.buttonDigit} onClick={() => handleDigitClick('2')}>2</button>
        <button className={styles.buttonDigit} onClick={() => handleDigitClick('3')}>3</button>
        <button className={styles.buttonOperator} onClick={() => handleOperatorClick('+')}>+</button>

        <button className={`${styles.buttonDigit} ${styles.buttonZero}`} onClick={() => handleDigitClick('0')}>0</button>
        <button className={styles.buttonDigit} onClick={handleDecimalClick}>.</button>
        <button className={styles.buttonEquals} onClick={handleEqualsClick}>=</button>
      </div>
    </div>
  );
};

export default Calculator;