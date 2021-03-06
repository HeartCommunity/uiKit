import { BrowserTestCase } from '@findable/webdriver-runner/runner';
import Page from '@findable/webdriver-runner/wd-wrapper';
import {
  editable,
  getDocFromElement,
  fullpage,
  quickInsert,
  linkToolbar,
} from '../_helpers';

BrowserTestCase(
  'quick-insert.ts: Insert hyperlink via quick insert',
  { skip: ['ie', 'edge', 'safari'] },
  async (client: any) => {
    const browser = new Page(client);

    await browser.goto(fullpage.path);
    await browser.waitForSelector(editable);
    await browser.click(editable);
    await quickInsert(browser, 'Hyperlink');

    await browser.waitForSelector(linkToolbar);
    await browser.type(linkToolbar, ['atlassian.com', 'Return']);
    await browser.waitForSelector('a');

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);
