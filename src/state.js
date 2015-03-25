import Flux from 'flux';
import React from 'react/addons';
import deepEqual from 'deep-equal';
import state from './state.json';


const dispatcher = new Flux.Dispatcher();


function get(statePath = []) {
    return statePath.reduce((s, k) => (s || {})[k], state);
}


function update(statePath = [], spec = {}) {
    state = React.addons.update(
        state,
        statePath.reduceRight((s, k) => { return { [k]: s }; }, spec)
    );
    dispatcher.dispatch();
}


export function createHandle(...statePath) {

    let localState = get(statePath);

    let localDispatcher = new Flux.Dispatcher();

    return {

        dispatcher: localDispatcher,

        get: get.bind(null, statePath),

        update: update.bind(null, statePath),

        detach: dispatcher.unregister.bind(
            dispatcher,
            dispatcher.register(() => {
                let nextState = get(statePath);
                if (!deepEqual(localState, nextState, { strict: true })) {
                    localState = nextState;
                    localDispatcher.dispatch(nextState);
                }
            })
        )
    };
}


export const StateMixin = {

    updateState(spec = {}) {
        update(this.statePath, spec);
    },

    getInitialState() {
        return get(this.statePath);
    },

    componentDidMount() {
        this._stateToken = dispatcher.register(() => {
            this.setState(this.getInitialState());
        });
    },

    componentWillUnmount() {
        dispatcher.unregister(this._stateToken);
    },

    shouldComponentUpdate(nextProps, nextState) {
        return (
            !deepEqual(this.props, nextProps, { strict: true }) ||
            !deepEqual(this.state, nextState, { strict: true })
        );
    }
};


export default Object.assign(createHandle(), { createHandle, StateMixin });
