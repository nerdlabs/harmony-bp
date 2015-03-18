import React from 'react';
import * as state from '../../state';


// #TODO: remove debug code
state.fromJS({ a: { b: { c: 1 } } });


export default React.createClass({

    mixins: [state.mixin],

    getInitialState() {
        return state.createCursor(['a', 'b']);
    },

    handleClick() {
        this.state.update('c', v => v + 1 );
    },

    render() {
        return (
            <section>
                <input/>
                <div onClick={ this.handleClick }>
                    click count: { this.state.get('c') }
                </div>
            </section>
        );
    }
});