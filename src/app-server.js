import React from 'react';
import Router from 'react-router';
import routes from './routes';

export function run (request, callback) {
    Router.run(routes, request.url, (Handler) => {
      callback(null, React.renderToString(<Handler/>));
    });
}
