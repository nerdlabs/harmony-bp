import { EventEmitter } from 'events';
import immutableUpdate from 'react/lib/update';
import deepFreeze from 'deep-freeze';
import deepEqual from 'deep-equal';

let state = Object.freeze({});

export function update(updates, ...keyPath) {
    state = deepFreeze(immutableUpdate(
        state,
        keyPath.reduceRight((u, k) => { return { [k]: u }; }, updates)
    ));
    emitter.emit('update', state);
}

export function get(...keyPath) {
    return keyPath.reduce((s, k) => s[k], state);
}

export const mixin = {

    updateState(updates = {}) {
        update(updates, ...this.statePath);
    },

    getInitialState() {
        return get(...this.statePath);
    },

    shouldComponentUpdate(nextProps, nextState) {
        return !deepEqual(this.state, nextState);
    },

    componentDidMount() {
        emitter.addListener('update', this._refreshState);
    },

    componentWillUnmount() {
        emitter.removeListener('update', this._refreshState);
    },

    _refreshState() {
        this.setState(this.getInitialState());
    }
};

export const emitter = new EventEmitter();
