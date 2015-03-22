import React from 'react';
import { StateMixin, update } from '../../state';

update({ $set: { a: { b: { c: 1 } } } } );

export default React.createClass({

    mixins: [ StateMixin ],

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