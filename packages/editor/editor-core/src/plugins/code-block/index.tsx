import * as React from 'react';

import EditorCodeIcon from '@atlaskit/icon/glyph/editor/code';
import { codeBlock } from '@atlaskit/adf-schema';

import { createPlugin } from './pm-plugins/main';
import { getToolbarConfig } from './toolbar';
import keymap from './pm-plugins/keymaps';
import ideUX from './pm-plugins/ide-ux';
import { messages } from '../block-type/types';
import { EditorPlugin } from '../../types';

export interface CodeBlockOptions {
  enableKeybindingsForIDE?: boolean;
}

const codeBlockPlugin = (options: CodeBlockOptions = {}): EditorPlugin => ({
  nodes() {
    return [{ name: 'codeBlock', node: codeBlock }];
  },

  pmPlugins() {
    return [
      { name: 'codeBlock', plugin: createPlugin },
      {
        name: 'codeBlockIDEKeyBindings',
        plugin: () => (options.enableKeybindingsForIDE ? ideUX : undefined),
      },
      {
        name: 'codeBlockKeyMap',
        plugin: ({ schema }) => keymap(schema),
      },
    ];
  },
  pluginsOptions: {
    quickInsert: ({ formatMessage }) => [
      {
        title: formatMessage(messages.codeblock),
        priority: 700,
        icon: () => (
          <EditorCodeIcon label={formatMessage(messages.codeblock)} />
        ),
        action(insert, state) {
          const schema = state.schema;
          return insert(schema.nodes.codeBlock.createChecked());
        },
      },
    ],
    floatingToolbar: getToolbarConfig,
  },
});

export default codeBlockPlugin;
