import { BrowserTestCase } from '@findable/webdriver-runner/runner';
import Page from '@findable/webdriver-runner/wd-wrapper';
import {
  getDocFromElement,
  comment,
  fullpage,
  editable,
  clipboardHelper,
  copyAsPlaintextButton,
  clipboardInput,
} from '../_helpers';

[comment, fullpage].forEach(editor => {
  BrowserTestCase(
    `hyperlink-markdown-paste-text.ts: Link - link markdown with pasting link text ${
      editor.name
    } editor`,
    {
      skip: ['ie', 'edge', 'safari'],
    },
    async (client: any) => {
      const sample = new Page(client);
      await sample.goto(clipboardHelper);
      await sample.isVisible(clipboardInput);
      await sample.type(clipboardInput, 'https://hello.com');
      await sample.click(copyAsPlaintextButton);

      await sample.goto(editor.path);
      await sample.waitForSelector(editor.placeholder);
      await sample.click(editor.placeholder);
      await sample.waitForSelector(editable);

      await sample.type(editable, ['[link1](']);
      await sample.paste(editable);
      await sample.type(editable, [')']);

      const doc = await sample.$eval(editable, getDocFromElement);
      expect(doc).toMatchDocSnapshot();
    },
  );
});
