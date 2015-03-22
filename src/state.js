import { Dispatcher } from 'flux';
import immutableUpdate from 'react/lib/update';
import deepFreeze from 'deep-freeze';
import deepEqual from 'deep-equal';
import initialState from './state.json';

let state = deepFreeze(initialState);

let dispatcher = new Dispatcher();

function get(statePath = []) {
    return statePath.reduce((s, k) => (s || {})[k], state);
}

function update(statePath = [], spec = {}) {
    state = deepFreeze(immutableUpdate(
        state,
        statePath.reduceRight((s, k) => { return { [k]: s }; }, spec)
    ));
    dispatcher.dispatch();
}

function createHandle(...statePath) {

    let localState = get(statePath);

    let localDispatcher = new Dispatcher();

    return Object.create({

        dispatcher: localDispatcher,

        update: update.bind(null, statePath),

        get: get.bind(null, statePath),

        detach: dispatcher.unregister.bind(
            dispatcher,
            dispatcher.register(() => {
                let nextState = get(statePath);
                if (!deepEqual(localState, nextState)) {
                    localState = nextState;
                    localDispatcher.dispatch(nextState);
                }
            })
        )
    });
}
export default Object.assign(createHandle(), { createHandle });

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
        if (this._stateToken) {
            dispatcher.unregister(this._stateToken);
            delete this._stateToken;
        }
    },

    shouldComponentUpdate(nextProps, nextState) {
        return !deepEqual(this.state, nextState);
    }
};
