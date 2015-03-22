import React from 'react';
import state, { StateMixin } from '../../state';

state.dispatcher.register(console.log.bind(console));

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