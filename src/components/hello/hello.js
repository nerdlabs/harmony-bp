import React from 'react';
import state from '../../state';


// #TODO: remove debug code
state.getCursor().update({ $set: { a: { b: { c: 1 } } } });


export default React.createClass({

    mixins: [ state ],

    keyPath: ['a', 'b'],

    handleClick() {
        this.state.update({ c: { $apply: v => v + 1 } });
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