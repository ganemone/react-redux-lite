/* global global, document */
import {jsdom} from 'jsdom';
global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = global.window.navigator;

import './provider.js';
import './connect.js';
