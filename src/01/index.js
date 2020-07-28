const elBox = document.querySelector('#box');

// Pure function that returns the next state,
// given the current state and sent event
function transitionSwitch(state, event) {
  switch (
    state
  ) {
    case 'active':
      switch(
        event
      ) {
        case 'click':
          return 'inactive';
      }
    case 'inactive':
      switch(
        event
      ) {
        case 'click':
          return 'active';
      }
  }
}

const machine = {
  active: {
    on: {
      toggle: 'inactive',
    }
  },
  inactive: {
    on: {
      toggle: 'active',
    }
  }
}

function transitionObject(state, event) {
  const stateTransition = machine[state];
  if (stateTransition && stateTransition.on && stateTransition.on[event]) {
    const nextState = stateTransition.on[event];
    return nextState;
  }
  return state;
}


function makeTransitionObjectClosure() {
  const machine = {
    active: {
      on: {
        toggle: 'inactive',
      }
    },
    inactive: {
      on: {
        toggle: 'active',
      }
    }
  };
  return function(state, event) {
    const stateTransition = machine[state];
    if (stateTransition && stateTransition.on && stateTransition.on[event]) {
      const nextState = stateTransition.on[event];
      return nextState;
    }
    return state;
  }
}

const transition = makeTransitionObjectClosure();

// Keep track of your current state
let currentState = 'inactive';

function send(event) {
  // Determine the next value of `currentState`
  currentState = transition(currentState, event);
  elBox.dataset.state = currentState;
}

elBox.addEventListener('click', () => {
  // send a click event
  send('toggle');
});
