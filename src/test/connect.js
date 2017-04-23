import React, {Component} from 'react';
import TestUtils from 'react-dom/test-utils';
import PropTypes from 'prop-types';
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
  class Child extends Component {
    render() {
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
  store.dispatch({
    type: 'INCREMENT',
    value: 1
  });
  t.equal(child.props.counter, 1, 're-renders component with updated store');
  t.end();
});
