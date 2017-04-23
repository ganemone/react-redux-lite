import {Provider} from '../index.js';
import test from 'ava';

test('Provider is exported correctly', t => {
  t.equal(typeof Provider, 'function', 'provider is a function');
});
