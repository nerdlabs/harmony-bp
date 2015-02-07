import React from 'react';
import Route from 'react-router';
import Hello from './components/hello/hello';

export default (
  <Route name='home' path='/' handler={Hello} />
);
