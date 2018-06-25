// @flow
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import * as assert from 'assert';

const urlSelect = getExampleUrl('core', 'select');
const selectDefault = '.select__control';
const selectMenu = '.select__menu';

const urlArray = [
  'single-select',
  'multi-select',
  'radio-select',
  'async-select-with-callback',
];

urlArray.forEach(url => {
  BrowserTestCase(
    `${url.toUpperCase()} should display its menu once clicked on it and no errors`,
    async client => {
      const selectTest = await new Page(client);
      await selectTest.goto(urlSelect + url);
      await selectTest.waitForSelector(selectDefault);
      await selectTest.click(selectDefault);
      const menuIsVisible = await selectTest.isVisible(selectMenu);
      expect(menuIsVisible).toBe(true);
      if (selectTest.log('browser').value) {
        selectTest.log('browser').value.forEach(val => {
          assert.notEqual(
            val.level,
            'SEVERE',
            `Console errors :${val.message} when visited ${url}`,
          );
        });
      }
    },
  );
});
