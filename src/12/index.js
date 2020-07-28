import { createMachine, assign, interpret } from 'xstate';

const elBox = document.querySelector('#box');

const randomFetch = () => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      if (Math.random() < 0.5) {
        rej('Fetch failed!');
      } else {
        res('Fetch succeeded!');
      }
    }, 2000);
  });
};

const machine = createMachine({
  initial: 'idle',
  states: {
    idle: {
      on: {
        FETCH: 'pending',
      },
    },
    pending: {
      invoke: {
        // Invoke your promise here.
        src: (context, event) => randomFetch(),
        onDone: 'resolved',
        onError: 'rejected',
      },
    },
    resolved: {
      // Add a transition to fetch again
      after: {
        TIMEOUT: 'idle',
      },
    },
    rejected: {
      // Add a transition to fetch again
      after: {
        TIMEOUT: 'idle',
      },
    },
  },
},{
  delays: {
    TIMEOUT: 1500,
  }
});

const service = interpret(machine);

service.onTransition((state) => {
  elBox.dataset.state = state.toStrings().join(' ');

  console.log(state);
});

service.start();

elBox.addEventListener('click', (event) => {
  service.send('FETCH');
});
