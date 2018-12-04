import {
  MentionPluginState,
  TextFormattingState,
  EditorActions,
  CustomMediaPicker,
  BlockTypeState,
  ListsState,
  indentList,
  outdentList,
  toggleOrderedList,
  toggleBulletList,
  toggleSuperscript,
  toggleSubscript,
  toggleStrike,
  toggleCode,
  toggleUnderline,
  toggleEm,
  toggleStrong,
  StatusState,
  updateStatus,
  commitStatusPicker,
  insertBlockType,
  createTable,
  insertTaskDecision,
} from '@atlaskit/editor-core';
import { EditorView } from 'prosemirror-view';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import { Color as StatusColor } from '@atlaskit/status';

import NativeToWebBridge from './bridge';
import WebBridge from '../../web-bridge';
import { rejectPromise, resolvePromise } from '../../cross-platform-promise';
import { setBlockType } from '../../../../editor-core/src/plugins/block-type/commands';

export default class WebBridgeImpl extends WebBridge
  implements NativeToWebBridge {
  textFormattingPluginState: TextFormattingState | null = null;
  mentionsPluginState: MentionPluginState | null = null;
  statusPluginState: StatusState | null = null;
  editorView: EditorView | null = null;
  transformer: JSONTransformer = new JSONTransformer();
  editorActions: EditorActions = new EditorActions();
  mediaPicker: CustomMediaPicker | undefined;
  blockState: BlockTypeState | undefined;
  listState: ListsState | undefined;
  mediaMap: Map<string, Function> = new Map();

  onBoldClicked() {
    if (this.textFormattingPluginState && this.editorView) {
      toggleStrong()(this.editorView.state, this.editorView.dispatch);
    }
  }

  onItalicClicked() {
    if (this.textFormattingPluginState && this.editorView) {
      toggleEm()(this.editorView.state, this.editorView.dispatch);
    }
  }

  onUnderlineClicked() {
    if (this.textFormattingPluginState && this.editorView) {
      toggleUnderline()(this.editorView.state, this.editorView.dispatch);
    }
  }
  onCodeClicked() {
    if (this.textFormattingPluginState && this.editorView) {
      toggleCode()(this.editorView.state, this.editorView.dispatch);
    }
  }
  onStrikeClicked() {
    if (this.textFormattingPluginState && this.editorView) {
      toggleStrike()(this.editorView.state, this.editorView.dispatch);
    }
  }
  onSuperClicked() {
    if (this.textFormattingPluginState && this.editorView) {
      toggleSuperscript()(this.editorView.state, this.editorView.dispatch);
    }
  }
  onSubClicked() {
    if (this.textFormattingPluginState && this.editorView) {
      toggleSubscript()(this.editorView.state, this.editorView.dispatch);
    }
  }

  onStatusUpdate(text: string, color: StatusColor, uuid: string) {
    if (this.statusPluginState && this.editorView) {
      updateStatus({
        text,
        color,
        localId: uuid,
      })(this.editorView);
    }
  }

  onStatusPickerDismissed() {
    if (this.statusPluginState && this.editorView) {
      commitStatusPicker()(this.editorView);
    }
  }

  onMentionSelect(mention: string) {}

  onMentionPickerResult(result: string) {}

  onMentionPickerDismissed() {}

  setContent(content: string) {
    if (this.editorActions) {
      this.editorActions.replaceDocument(content, false);
    }
  }

  getContent(): string {
    return this.editorView
      ? JSON.stringify(this.transformer.encode(this.editorView.state.doc))
      : '';
  }

  setTextFormattingStateAndSubscribe(state: TextFormattingState) {
    this.textFormattingPluginState = state;
  }
  onMediaPicked(eventName: string, mediaPayload: string) {
    if (this.mediaPicker) {
      const payload = JSON.parse(mediaPayload);

      switch (eventName) {
        case 'upload-preview-update': {
          const uploadPromise = new Promise(resolve => {
            this.mediaMap.set(payload.file.id, resolve);
          });
          payload.file.upfrontId = uploadPromise;
          payload.preview = {
            dimensions: payload.file.dimensions,
          };
          this.mediaPicker.emit(eventName, payload);

          return;
        }
        case 'upload-end': {
          if (payload.file.collectionName) {
            /**
             * We call this custom event instead of `upload-end` to set the collection
             * As when emitting `upload-end`, the `ready` handler will usually fire before
             * the `publicId` is resolved which causes a noop, resulting in bad ADF.
             */
            this.mediaPicker.emit('collection', payload);
          }
          const getUploadPromise = this.mediaMap.get(payload.file.id);
          if (getUploadPromise) {
            getUploadPromise!(payload.file.publicId);
          }
          return;
        }
      }
    }
  }
  onPromiseResolved(uuid: string, payload: string) {
    resolvePromise(uuid, JSON.parse(payload));
  }

  onPromiseRejected(uuid: string) {
    rejectPromise(uuid);
  }

  onBlockSelected(blockType: string) {
    if (this.editorView) {
      const { state, dispatch } = this.editorView;
      setBlockType(blockType)(state, dispatch);
    }
  }

  onOrderedListSelected() {
    if (this.listState && this.editorView) {
      toggleOrderedList(this.editorView);
    }
  }
  onBulletListSelected() {
    if (this.listState && this.editorView) {
      toggleBulletList(this.editorView);
    }
  }

  onIndentList() {
    if (this.listState && this.editorView) {
      indentList()(this.editorView.state, this.editorView.dispatch);
    }
  }

  onOutdentList() {
    if (this.listState && this.editorView) {
      outdentList()(this.editorView.state, this.editorView.dispatch);
    }
  }

  insertBlockType(type) {
    if (!this.editorView) {
      return;
    }

    switch (type) {
      case 'blockquote':
        insertBlockType('blockquote')(
          this.editorView.state,
          this.editorView.dispatch,
        );
        return;
      case 'codeblock':
        insertBlockType('codeblock')(
          this.editorView.state,
          this.editorView.dispatch,
        );
        return;
      case 'panel':
        insertBlockType('panel')(
          this.editorView.state,
          this.editorView.dispatch,
        );
        return;
      case 'action':
        insertTaskDecision(this.editorView, 'taskList');
        return;
      case 'decision':
        insertTaskDecision(this.editorView, 'decisionList');
        return;
      case 'table':
        createTable(this.editorView.state, this.editorView.dispatch);
        return;

      default:
        // tslint:disable-next-line:no-console
        console.error(`${type} cannot be inserted as it's not supported`);
        return;
    }
  }

  getRootElement(): HTMLElement | null {
    return document.querySelector('#editor');
  }
}
