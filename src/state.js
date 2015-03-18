import { Dispatcher } from 'flux';
import Immutable from 'immutable';
import Cursor from 'immutable/contrib/cursor';


const dispatcher = new Dispatcher();
const states = [];

let state;


export function createCursor(keyPath) {
    return Cursor.from(state, keyPath, replace);
}


export function replace(newState) {
    if (state) {
        states.push(state);
    }
    while (states.length > 10) {
        states.shift();
    }
    state = newState;
    dispatcher.dispatch(state);
}


export function rewind() {
    state = states.length ? states.pop() : state;
    dispatcher.dispatch(state);
}


export function update() {
    replace(state.mergeDeep.apply(state, arguments));
}


export function fromJS() {
    replace(Immutable.fromJS.apply(Immutable, arguments));
}


export function toJS() {
    return state.toJS.apply(state, arguments);
}


export const mixin = {
    componentDidMount() {
        this._dispatcherToken = dispatcher.register(() => {
            this.replaceState(this.getInitialState());
            this.render();
        });
    },
    componentWillUnmount() {
        dispatcher.unregister(this._dispatcherToken);
    }
};


export default dispatcher;