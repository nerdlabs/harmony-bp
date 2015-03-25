import React from 'react/addons';
import { StateMixin } from '../../state';


export const CountDisplay = React.createClass({

    mixins: [ React.addons.PureRenderMixin ],

    render() {
        return (
            <div><b>Click count:</b> { this.props.count }</div>
        );
    }
});


export default React.createClass({

    mixins: [ StateMixin ],

    statePath: ['a', 'b'],

    handleClick() {
        this.updateState({ c: { $apply: v => v + 1 } });
    },

    render() {
        return (
            <section>
                <input />
                <div onClick={ this.handleClick }>
                    <CountDisplay count={this.state.c} />
                </div>
            </section>
        );
    }
});