import { createMachine, interpret } from 'xstate';

const elBox = document.querySelector('#box');


const derivedState = {
  state: [],
};

const setPoint = (context, event) => {
  // Set the data-point attribute of `elBox`
  const x = event.clientX;
  const y = event.clientY;
  const formattedPoint = `Point(${x},${y})`;
  derivedState.state.push(formattedPoint);
  if (derivedState.state.length === 2) {
    elBox.setAttribute('data-point', derivedState.state.join('-->'));
    derivedState.state = [];
  } else {
    elBox.setAttribute('data-point', formattedPoint);
  }
};

const machine = createMachine({
  initial: 'idle',
  states: {
    idle: {
      on: {
        mousedown: {
          // Add your action here
          actions: setPoint,
          target: 'dragging',
        },
      },
    },
    dragging: {
      on: {
        mouseup: {
          actions: setPoint,
          target: 'idle',
        },
      },
    },
  },
});

const service = interpret(machine);

service.onTransition((state) => {
  console.log(state);

  elBox.dataset.state = state.value;
});

service.start();

elBox.addEventListener('mousedown', service.send);

elBox.addEventListener('mouseup', (event) => {
  service.send(event);
});
