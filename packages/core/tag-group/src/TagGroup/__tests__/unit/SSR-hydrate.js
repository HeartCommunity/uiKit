// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import exenv from 'exenv';
import Tag from '@findable/tag';
import TagGroup from '../..';

jest.mock('exenv', () => ({
  get canUseDOM() {
    return false;
  },
}));

jest.spyOn(global.console, 'error');

afterEach(() => {
  jest.resetAllMocks();
});

const App = () => (
  <TagGroup>
    <Tag text="Base Tag" />
  </TagGroup>
);

test('should ssr then hydrate tag-group correctly', () => {
  const canUseDom = jest.spyOn(exenv, 'canUseDOM', 'get');
  // server-side
  canUseDom.mockReturnValue(false);
  const serverHTML = ReactDOMServer.renderToString(<App />);
  // client-side
  canUseDom.mockReturnValue(true);
  const elem = document.createElement('div');
  elem.innerHTML = serverHTML;
  ReactDOM.hydrate(<App />, elem);
  expect(console.error).not.toBeCalled();
});
