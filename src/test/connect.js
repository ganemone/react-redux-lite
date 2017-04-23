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
    type: 'DO_NOTHING'
  });
  t.equal(numRenders, 2, 'does not rerender component when counter does not change');
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
  const ConnectedChild = connect(state => {
    return {
      counter: state.counter,
    };
  }, (dispatch) => {
    numMapDispatchToPropsCalls++;
    return {
      increment: () => {
        dispatch({
          type: 'INCREMENT',
        });
      },
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
  t.equal(numMapDispatchToPropsCalls, 1, 'calls mapDispatchToProps only once');
  t.equal(typeof child.props.increment, 'function', 'passes props from mapDispatchToProps correctly');
  child.props.increment();
  t.equal(numRenders, 2, 'renders the component again when the store changes');
  t.equal(child.props.counter, 1, 're-renders component with updated store');
  t.equal(typeof child.props.increment, 'function', 'passes props from mapDispatchToProps correctly');
  store.dispatch({
    type: 'DO_NOTHING'
  });
  t.equal(numRenders, 2, 'does not rerender component when counter does not change');
  t.end();
});
