import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';
import './App.css';

export default function App() {
  const [number1, setNumber1] = useState(1);
  const [number2, setNumber2] = useState(3);
  const [operator, setOperator] = useState('*');

  function handleDrop(spot, item) {
    if (spot === 'number1') setNumber1(item.text);
    if (spot === 'number2') setNumber2(item.text);
    if (spot === 'operator') setOperator(item.text);
  }

  function financial(x) {
    return Number.parseFloat(x).toFixed(2);
  }

  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <div className='app'>
        {/* math card */}
        <div className='math-card'>
          <Spot
            type='number'
            text={number1}
            spot='number1'
            handleDrop={handleDrop}
          />
          <Spot
            type='number'
            text={number2}
            spot='number2'
            handleDrop={handleDrop}
          />
          <Spot
            type='operator'
            text={operator}
            spot='operator'
            handleDrop={handleDrop}
          />
          <div className='total'>
            {isFinite(eval(`${number1}${operator}${number2}`))
              ? financial(eval(`${number1}${operator}${number2}`))
              : '∞'}
          </div>
        </div>

        <div>
          <div className='cards numbers'>
            {Array(10)
              .fill(0)
              .map((n, i) => (
                <Card key={i} type='number' text={i} />
              ))}
          </div>

          <div className='cards operators'>
            {['*', '-', '+', '/'].map((o, i) => (
              <Card key={i} type='operator' text={o} />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

function Spot({ type, text, spot, handleDrop }) {
  const [{ canDrop, isOver }, dropRef] = useDrop({
    accept: type,
    drop: (item) => {
      // here is where we do the update
      handleDrop(spot, item);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  let backgroundColor = '#f2f2f2';
  if (canDrop) backgroundColor = '#3db897';
  if (isOver) backgroundColor = '#4bdcb5';

  return (
    <div className='spot' ref={dropRef} style={{ backgroundColor }}>
      {text}
    </div>
  );
}

function Card({ type, text }) {
  const [{ opacity }, dragRef] = useDrag({
    type,
    item: { type, text },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1,
    }),
  });

  return (
    <div className='card' ref={dragRef} style={{ opacity }}>
      {text}
    </div>
  );
}
