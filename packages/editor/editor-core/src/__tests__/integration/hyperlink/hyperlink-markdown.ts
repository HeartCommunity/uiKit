import { BrowserTestCase } from '@findable/webdriver-runner/runner';
import Page from '@findable/webdriver-runner/wd-wrapper';
import { getDocFromElement, comment, fullpage, editable } from '../_helpers';

[comment, fullpage].forEach(editor => {
  BrowserTestCase(
    `hyperlink-markdown: Link - entering link markdown ${editor.name} editor`,
    {
      skip: ['ie', 'edge', 'safari'],
    },
    async (client: any) => {
      let browser = new Page(client);
      await browser.goto(editor.path);
      await browser.waitForSelector(editor.placeholder);
      await browser.click(editor.placeholder);
      await browser.waitForSelector(editable);

      await browser.type(editable, ['[link](https://hello.com)']);
      await browser.waitForSelector('a');

      const doc = await browser.$eval(editable, getDocFromElement);
      expect(doc).toMatchDocSnapshot();
    },
  );
});
