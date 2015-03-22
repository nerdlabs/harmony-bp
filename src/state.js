import { Dispatcher } from 'flux';
import immutableUpdate from 'react/lib/update';
import deepFreeze from 'deep-freeze';
import deepEqual from 'deep-equal';

let state = Object.freeze({});

export const dispatcher = new Dispatcher();

export function get(statePath = []) {
    return statePath.reduce((s, k) => (s || {})[k], state);
}

export function update(spec = {}, statePath = []) {
    state = deepFreeze(immutableUpdate(
        state,
        statePath.reduceRight((s, k) => { return { [k]: s }; }, spec)
    ));
    dispatcher.dispatch(state);
}

export const StateMixin = {

    updateState(spec = {}) {
        update(spec, this.statePath);
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
        if (this._stateToken) {
            dispatcher.unregister(this._stateToken);
            delete this._stateToken;
        }
    },

    shouldComponentUpdate(nextProps, nextState) {
        return !deepEqual(this.state, nextState);
    }
};