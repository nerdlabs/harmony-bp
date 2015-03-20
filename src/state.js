import { EventEmitter } from 'events';
import update from 'react/lib/update';
import deepFreeze from 'deep-freeze';
import deepEqual from 'deep-equal';

let state = Object.freeze({});

export default {

    updateState(updates = {}, statePath = null) {
        statePath = statePath || this.statePath || [];
        state = deepFreeze(update(
            state,
            statePath.reduceRight((u, k) => { return { [k]: u }; }, updates)
        ));
        emitter.emit('update', state);
    },

    getInitialState() {
        return this.statePath.reduce((s, k) => s[k], state);
    },

    componentDidMount() {
        emitter.addListener('update', this._refreshState);
    },

    componentWillUnmount() {
        emitter.removeListener('update', this._refreshState);
    },

    shouldComponentUpdate(nextProps, nextState) {
        return !deepEqual(this.state, nextState);
    },

    _refreshState() {
        this.setState(this.getInitialState());
    }
};
export const emitter = new EventEmitter();