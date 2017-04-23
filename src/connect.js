import React, {Component} from 'react';
import PropTypes from 'prop-types';
import shallowEqual from './shallow-equal.js';
import {bindActionCreators} from 'redux';

export default function wrapActionCreators(actionCreators) {
  return dispatch => bindActionCreators(actionCreators, dispatch);
}

export function connect(mapStateToProps, mapDispatchToProps) {
  return function withConnect(wrappedComponent) {
    class Connect extends Component {
      constructor(props, context) {
        super(props, context);
        const {store} = context;
        const {dispatch, getState} = store;
        this.onStateChange = this.onStateChange.bind(this);
        this.lastProps = mapStateToProps(getState());
        this.dispatchProps = {dispatch};
        if (typeof mapDispatchToProps === 'function') {
          this.dispatchProps = mapDispatchToProps(dispatch);
        } else if (typeof mapDispatchToProps === 'object') {
          this.dispatchProps = bindActionCreators(
            mapDispatchToProps,
            dispatch
          );
        }
      }
      componentDidMount() {
        const store = this.context.store;
        this.unsubscribe = store.subscribe(this.onStateChange);
      }
      componentWillUnmount() {
        if (typeof this.unsubscribe === 'function') {
          this.unsubscribe();
        }
      }
      onStateChange() {
        const newState = this.context.store.getState();
        const newProps = mapStateToProps(newState);
        if (!shallowEqual(newProps, this.lastProps)) {
          this.lastProps = newProps;
          this.forceUpdate();
        }
      }
      render() {
        const mergedProps = Object.assign(
          {},
          this.lastProps,
          this.dispatchProps
        );
        return React.createElement(wrappedComponent, mergedProps);
      }
    }

    const wrappedDisplayName = wrappedComponent.displayName ||
      wrappedComponent.name ||
      '';
    Connect.displayName = `Connect(${wrappedDisplayName})`;

    Connect.contextTypes = {
      store: PropTypes.object.isRequired,
    };

    // TODO: Handle display names
    return Connect;
  };
}
