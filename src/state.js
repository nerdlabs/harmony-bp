import Immutable from 'immutable';
import Cursor from 'immutable/contrib/cursor';


let state = Immutable.fromJS({ a: { b: { c: 1 } } });


export function createCursor(keyPath) {
    return Cursor.from(state, keyPath, newState => {
        state = newState;
    });
}