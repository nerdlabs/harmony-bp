import React from 'react';
import * as state from '../../state';


state.update({ $set: { a: { b: { c: 0 } } } });


export default React.createClass({

    mixins: [ state.mixin ],

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
