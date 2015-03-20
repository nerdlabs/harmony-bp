import React from 'react';
import state from '../../state';


// #TODO: remove debug code
state.updateState({ $set: { a: { b: { c: 1 } } } });


export default React.createClass({

    mixins: [ state ],

    statePath: ['a', 'b'],

    handleClick() {
        this.updateState({ c: { $apply: v => v + 1 } });
    },

    render() {
        return (
            <section>
                <input/>
                <div onClick={ this.handleClick }>
                    click count: { this.state.c }
                </div>
            </section>
        );
    }
});