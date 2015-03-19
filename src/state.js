import { EventEmitter } from 'events';
import { addons as ReactAddons } from 'react/addons';


let state = {};


export default {

    _onStateChange() {
        this.setState(this.getInitialState());
        this.render();
    },

    componentDidMount() {
        emitter.addListener('change', this._onStateChange);
    },

    componentWillUnmount() {
        emitter.removeListener('change', this._onStateChange);
    },

    getCursor(keyPath = []) {
        return Object.assign(
            {
                update(updates) {
                    states.push(state);
                    state = ReactAddons.update(state, keyPath.reduceRight(
                        (u, k) => { return { [k]: u }; },
                        updates
                    ));
                    emitter.emit('change', state);
                }
            },
            keyPath.reduce((s, k) => s[k], state)
        );
    }
};

export const states = [];

export const emitter = new EventEmitter();