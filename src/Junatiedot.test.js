import React from 'react';
import ReactDOM from 'react-dom';
import Junatiedot from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Junatiedot />, div);
  ReactDOM.unmountComponentAtNode(div);
});
