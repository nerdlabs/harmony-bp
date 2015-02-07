import React from 'react';
import Router from 'react-router';
import routes from './routes';

export function run (window) {
    Router.run(routes, Router.HistoryLocation, (Handler) => {
      React.render(<Handler/>, window.document.body);
    });
}
