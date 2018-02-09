import * as React from 'react';
import styled from 'styled-components';
import PluginSlot from '../PluginSlot';
import WithPluginState from '../WithPluginState';
import ContentStyles from '../ContentStyles';
import { EditorAppearanceComponentProps, EditorAppearance } from '../../types';
import { pluginKey as maxContentSizePluginKey } from '../../plugins/max-content-size';
import mentionPluginKey from '../../../plugins/mentions/plugin-key';

export interface MobileEditorProps {
  isMaxContentSizeReached?: boolean;
  maxHeight?: number;
}

// tslint:disable-next-line:variable-name
const MobileEditor: any = styled.div`
  height: auto;
  min-height: 30px;
  ${(props: MobileEditorProps) =>
    props.maxHeight
      ? 'max-height: ' + props.maxHeight + 'px;'
      : ''} overflow-x: hidden;
  overflow-y: auto;

  max-width: inherit;
  box-sizing: border-box;
  word-wrap: break-word;

  div > .ProseMirror {
    outline: none;
    white-space: pre-wrap;
    padding: 0;
    margin: 0;
  }
`;
MobileEditor.displayName = 'MobileEditor';

// tslint:disable-next-line:variable-name
const ContentArea = styled(ContentStyles)``;
ContentArea.displayName = 'ContentArea';

export default class Editor extends React.Component<
  EditorAppearanceComponentProps,
  any
> {
  static displayName = 'MobileEditorAppearance';

  private flashToggle = false;

  private appearance: EditorAppearance = 'mobile';

  private handleRef = ref => {
    if (this.props.onUiReady) {
      this.props.onUiReady(ref);
    }
  };

  private renderMobile = ({ maxContentSize, mentions }) => {
    const {
      editorView,
      eventDispatcher,
      providerFactory,
      customContentComponents,
      maxHeight,
      disabled,
    } = this.props;
    const maxContentSizeReached =
      maxContentSize && maxContentSize.maxContentSizeReached;
    this.flashToggle = maxContentSizeReached && !this.flashToggle;
    console.log('state ' + mentions);
    return (
      <MobileEditor
        mentionState={mentions}
        className={this.flashToggle ? '-flash' : ''}
        isMaxContentSizeReached={maxContentSizeReached}
        maxHeight={maxHeight}
      >
        <ContentArea innerRef={this.handleRef}>
          {customContentComponents}
          <PluginSlot
            editorView={editorView}
            eventDispatcher={eventDispatcher}
            providerFactory={providerFactory}
            appearance={this.appearance}
            disabled={!!disabled}
          />
        </ContentArea>
      </MobileEditor>
    );
  };

  render() {
    const { eventDispatcher, editorView } = this.props;

    return (
      <WithPluginState
        editorView={editorView}
        eventDispatcher={eventDispatcher}
        plugins={{
          maxContentSize: maxContentSizePluginKey,
          mentions: mentionPluginKey,
        }}
        render={this.renderMobile}
      />
    );
  }
}
