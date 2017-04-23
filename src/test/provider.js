import React, {Component} from 'react';
import TestUtils from 'react-dom/test-utils';
import PropTypes from 'prop-types';
import {Provider} from '../index.js';
import test from 'tape';
import {createStore} from 'redux';

test('Provider is exported correctly', t => {
  t.equal(typeof Provider, 'function', 'provider is a function');
  t.end();
});

test('Provider provides store correctly', t => {
  const store = createStore(
    (state /*, action */) => {
      return state;
    },
    {}
  );
  class Child extends Component {
    render() {
      return <div>Hello World</div>;
    }
  }
  Child.contextTypes = {
    store: PropTypes.object.isRequired,
  };
  const app = (
    <Provider store={store}>
      <Child />
    </Provider>
  );
  const tree = TestUtils.renderIntoDocument(app);
  const child = TestUtils.findRenderedComponentWithType(tree, Child);
  t.equal(child.context.store, store, 'passes store context down correctly');
  t.end();
});
