import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { getExamplesFor } from '@findable/build-utils/getExamples';
import { ssr } from '@findable/ssr';

jest.spyOn(global.console, 'error');

afterEach(() => {
  jest.resetAllMocks();
});

test('should ssr then hydrate textarea correctly', async () => {
  const [example] = await getExamplesFor('textarea');
  // $StringLitteral
  const Example = require(example.filePath).default; // eslint-disable-line import/no-dynamic-require

  const elem = document.createElement('div');
  elem.innerHTML = await ssr(example.filePath);

  ReactDOM.hydrate(<Example />, elem);
  // tslint:disable-next-line:no-console
  expect(console.error).not.toBeCalled();
});
