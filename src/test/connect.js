import React, {Component} from 'react';
import TestUtils from 'react-dom/test-utils';
import {Provider, connect} from '../index.js';
import test from 'tape';
import {createStore} from 'redux';

function getCounterStore() {
  const store = createStore(
    (state, action) => {
      if (action.type === 'INCREMENT') {
        return Object.assign({}, state, {
          counter: state.counter + 1,
        });
      } else if (action.type === 'DECREMENT') {
        return Object.assign({}, state, {
          counter: state.counter - 1,
        });
      }
      return state;
    },
    {
      counter: 0,
    }
  );
  return store;
}

test('connect is exported correctly', t => {
  t.equal(typeof connect, 'function', 'connect is a function');
  t.end();
});

test('connect with counter mapStateToProps', t => {
  let numRenders = 0;
  class Child extends Component {
    render() {
      numRenders++;
      return <div>Hello World</div>;
    }
  }
  const store = getCounterStore();
  const ConnectedChild = connect(state => {
    return {
      counter: state.counter,
    };
  })(Child);
  const app = (
    <Provider store={store}>
      <ConnectedChild />
    </Provider>
  );
  const tree = TestUtils.renderIntoDocument(app);
  const child = TestUtils.findRenderedComponentWithType(tree, Child);
  t.equal(
    child.props.counter,
    0,
    'correctly maps counter to props on first render'
  );
  t.equal(numRenders, 1, 'renders the component only once');
  store.dispatch({
    type: 'INCREMENT',
  });
  t.equal(numRenders, 2, 'renders the component again when the store changes');
  t.equal(child.props.counter, 1, 're-renders component with updated store');
  store.dispatch({
    type: 'DO_NOTHING',
  });
  t.equal(
    numRenders,
    2,
    'does not rerender component when counter does not change'
  );
  t.end();
});

test('connect with mapStateToProps and mapDispatchToProps', t => {
  let numRenders = 0;
  let numMapDispatchToPropsCalls = 0;
  class Child extends Component {
    render() {
      numRenders++;
      return <div>Hello World</div>;
    }
  }
  const store = getCounterStore();
  const ConnectedChild = connect(
    state => {
      return {
        counter: state.counter,
      };
    },
    dispatch => {
      numMapDispatchToPropsCalls++;
      return {
        increment: () => {
          dispatch({
            type: 'INCREMENT',
          });
        },
      };
    }
  )(Child);
  const app = (
    <Provider store={store}>
      <ConnectedChild />
    </Provider>
  );
  const tree = TestUtils.renderIntoDocument(app);
  const child = TestUtils.findRenderedComponentWithType(tree, Child);
  t.equal(
    child.props.counter,
    0,
    'correctly maps counter to props on first render'
  );
  t.equal(numRenders, 1, 'renders the component only once');
  t.equal(numMapDispatchToPropsCalls, 1, 'calls mapDispatchToProps only once');
  t.equal(
    typeof child.props.increment,
    'function',
    'passes props from mapDispatchToProps correctly'
  );
  child.props.increment();
  t.equal(numRenders, 2, 'renders the component again when the store changes');
  t.equal(child.props.counter, 1, 're-renders component with updated store');
  t.equal(
    typeof child.props.increment,
    'function',
    'passes props from mapDispatchToProps correctly'
  );
  store.dispatch({
    type: 'DO_NOTHING',
  });
  t.equal(
    numRenders,
    2,
    'does not rerender component when counter does not change'
  );
  t.end();
});

test('connect with object props in mapStateToProps', t => {
  const store = getDeepCounterStore();
  let numRenders = 0;
  let numMapDispatchToPropsCalls = 0;
  class Child extends Component {
    render() {
      numRenders++;
      return <div>Hello World</div>;
    }
  }
  const ConnectedChild = connect(
    state => {
      return {
        counterA: state.counterA,
        counterB: state.counterB,
      };
    },
    dispatch => {
      numMapDispatchToPropsCalls++;
      return {
        incrementA: () => {
          dispatch({
            type: 'INCREMENT_A',
          });
        },
        incrementB: () => {
          dispatch({
            type: 'INCREMENT_B',
          });
        },
        incrementC: () => {
          dispatch({
            type: 'INCREMENT_C',
          });
        },
      };
    }
  )(Child);
  const app = (
    <Provider store={store}>
      <ConnectedChild />
    </Provider>
  );
  const tree = TestUtils.renderIntoDocument(app);
  const child = TestUtils.findRenderedComponentWithType(tree, Child);
  t.equal(
    child.props.counterA.value,
    0,
    'correctly maps counter to props on first render'
  );
  t.equal(numRenders, 1, 'renders the component only once');
  t.equal(numMapDispatchToPropsCalls, 1, 'calls mapDispatchToProps only once');
  t.equal(
    typeof child.props.incrementA,
    'function',
    'passes props from mapDispatchToProps correctly'
  );
  child.props.incrementA();
  t.equal(numRenders, 2, 'renders the component again when the store changes');
  t.equal(
    child.props.counterA.value,
    1,
    're-renders component with updated store'
  );
  t.equal(
    typeof child.props.incrementA,
    'function',
    'passes props from mapDispatchToProps correctly'
  );
  t.equal(
    typeof child.props.incrementB,
    'function',
    'passes props from mapDispatchToProps correctly'
  );
  store.dispatch({
    type: 'DO_NOTHING',
  });
  t.equal(
    numRenders,
    2,
    'does not rerender component when counter does not change'
  );
  child.props.incrementC();
  t.equal(
    numRenders,
    2,
    'does not rerender component when counter does not change'
  );
  t.end();
});

function getDeepCounterStore() {
  const store = createStore(
    (state, action) => {
      if (action.type === 'INCREMENT_A') {
        const counterAState = Object.assign({}, state.counterA, {
          value: state.counterA.value + 1,
        });
        return Object.assign({}, state, {
          counterA: counterAState,
        });
      } else if (action.type === 'INCREMENT_B') {
        const counterBState = Object.assign({}, state.counterB, {
          value: state.counterB.value + 1,
        });
        return Object.assign({}, state, {
          counterB: counterBState,
        });
      } else if (action.type === 'INCREMENT_C') {
        const counterCState = Object.assign({}, state.counterC, {
          value: state.counterC.value + 1,
        });
        return Object.assign({}, state, {
          counterC: counterCState,
        });
      }
      return state;
    },
    {
      counterA: {
        value: 0,
        name: 'counterA',
      },
      counterB: {
        value: 0,
        name: 'counterB',
      },
      counterC: {
        value: 0,
        name: 'counterC',
      },
    }
  );
  return store;
}
