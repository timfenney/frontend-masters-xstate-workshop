import { createMachine, assign, interpret } from 'xstate';

const elBox = document.querySelector('#box');
const elBody = document.body;

const machine = createMachine({
  initial: 'idle',
  // Set the initial context
  context: {
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      px: 0,
      py: 0,
    },
  states: {
    idle: {
      on: {
        mousedown: {
          // Assign the point
          actions: assign({
            px: (context, event) => event.clientX,
            py: (context, event) => event.clientY,
          }),
          target: 'dragging',
        },
      },
    },
    dragging: {
      on: {
        mousemove: {
          // Assign the delta
          actions: assign({
            dx: (context, event) => {
              return event.clientX - context.px;
            },
            dy: (context, event) => {
              return event.clientY - context.py;
            },
          }),
        },
        mouseup: {
          // Assign the position
          target: 'idle',
          actions: assign({
            x: (context) => context.x + context.dx,
            y: (context) => context.y + context.dy,
            dx: 0,
            dy: 0,
            px: 0,
            py: 0,
          })
        },
        keyup: {
          actions: assign({
            dx: 0,
            dy: 0,
            px: 0,
            py: 0,
          }),
          target: 'idle',
        },
      },
    },
  },
});

const service = interpret(machine);

service.onTransition((state) => {
  if (state.changed) {
    console.log(state.context);

    elBox.dataset.state = state.value;

    elBox.style.setProperty('--dx', state.context.dx);
    elBox.style.setProperty('--dy', state.context.dy);
    elBox.style.setProperty('--x', state.context.x);
    elBox.style.setProperty('--y', state.context.y);
  }
});

service.start();

// Add event listeners for:
elBox.addEventListener('mousedown', service.send);
elBody.addEventListener('mousemove', service.send);
elBox.addEventListener('mouseup', service.send);
elBody.addEventListener('keyup', (e) => {
  if (e.keyCode === 27) {
    service.send(e);
  }
});