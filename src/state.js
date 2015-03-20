import { EventEmitter } from 'events';
import update from 'react/lib/update';
import deepEqual from 'deep-equal';
import deepFreeze from 'deep-freeze-strict';


let state = Object.freeze({});


export default {

    getCursor(keyPath = []) {
        return Object.freeze(Object.assign(
            {
                update(updates) {
                    state = deepFreeze(update(
                        state,
                        keyPath.reduceRight(
                            (u, k) => { return { [k]: u }; },
                            updates
                        )
                    ));
                    emitter.emit('change', state);
                }
            },
            keyPath.reduce((s, k) => s[k], state)
        ));
    },

    getInitialState() {
        return this.getCursor(this.keyPath || []);
    },

    setNextState() {
        this.setState(this.getInitialState());
    },

    componentDidMount() {
        emitter.addListener('change', this.setNextState);
    },

    componentWillUnmount() {
        emitter.removeListener('change', this.setNextState);
    },

    shouldComponentUpdate(nextProps, nextState) {
        return !deepEqual(this.state, nextState);
    }
};

export const emitter = new EventEmitter();
