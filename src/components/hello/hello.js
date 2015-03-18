import React from 'react';
import { createCursor } from '../../state';


export default React.createClass({

    getInitialState() {
        return createCursor(['a', 'b']);
    },

    handleClick() {
        this.replaceState( this.state.update('c', v => v + 1 ));
    },

    render() {
        return (
            <div onClick={ this.handleClick }>
                click count: { this.state.get('c') }
            </div>
        );
    }
});
