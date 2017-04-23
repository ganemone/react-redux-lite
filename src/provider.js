import {Component, Children} from 'react';
import PropTypes from 'prop-types';

let didWarnAboutReceivingStore = false;
function warnAboutReceivingStore() {
  if (didWarnAboutReceivingStore) {
    return;
  }
  didWarnAboutReceivingStore = true;

  // eslint-disable-next-line no-console
  console.warn(
    '<Provider> does not support changing `store` on the fly. ' +
      'It is most likely that you see this error because you updated to ' +
      'Redux 2.x and React Redux 2.x which no longer hot reload reducers ' +
      'automatically. See https://github.com/reactjs/react-redux/releases/' +
      'tag/v2.0.0 for the migration instructions.'
  );
}

export class Provider extends Component {
  getChildContext() {
    return {store: this.store, storeSubscription: null};
  }

  constructor(props, context) {
    super(props, context);
    this.store = props.store;
  }

  render() {
    return Children.only(this.props.children);
  }
}

if (process.env.NODE_ENV !== 'production') {
  Provider.prototype.componentWillReceiveProps = function(nextProps) {
    const {store} = this;
    const {store: nextStore} = nextProps;

    if (store !== nextStore) {
      warnAboutReceivingStore();
    }
  };
}

Provider.propTypes = {
  store: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
};

Provider.childContextTypes = {
  store: PropTypes.object.isRequired,
  storeSubscription: PropTypes.any,
};
Provider.displayName = 'Provider';
