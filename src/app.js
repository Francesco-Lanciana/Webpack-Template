import "Styles/app";

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import Root from 'Components:Root';

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('app')
  );
};


try {
  render(Root);

  if (module.hot) {
    module.hot.accept('Components:Root', () => {
      const NextApp = import('Components:Root');

      render(NextApp);
    });
  }
} catch (err) {
  console.log('Render error', err);
}