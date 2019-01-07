import * as React from 'react';
import * as uuid from 'uuid/v4';
import { Subscription } from 'rxjs/Subscription';
import { Context, UploadableFile } from '@atlaskit/media-core';
import { FileIdentifier } from '@atlaskit/media-card';
import { Shortcut } from '@atlaskit/media-ui';
import Spinner from '@atlaskit/spinner';
import EditorView from './editorView/editorView';
import { Blanket, SpinnerWrapper } from './styled';

export interface SmartMediaEditorProps {
  identifier: FileIdentifier;
  context: Context;
  onUploadStart: (identifier: FileIdentifier) => void;
  onFinish: () => void;
}

export interface SmartMediaEditorState {
  imageUrl?: string;
}

export class SmartMediaEditor extends React.Component<
  SmartMediaEditorProps,
  SmartMediaEditorState
> {
  fileName?: string;
  state: SmartMediaEditorState = {};
  getFileSubscription?: Subscription;
  uploadFileSubscription?: Subscription;

  componentDidMount() {
    const { identifier } = this.props;
    this.getFile(identifier);
  }

  componentWillUnmount() {
    const { getFileSubscription, uploadFileSubscription } = this;
    if (getFileSubscription) {
      getFileSubscription.unsubscribe();
    }
    if (uploadFileSubscription) {
      uploadFileSubscription.unsubscribe();
    }
  }

  getFile = async (identifier: FileIdentifier) => {
    const { context } = this.props;
    const { collectionName } = identifier;
    const id = await identifier.id;

    const getFileSubscription = context
      .getFile(id, { collectionName })
      .subscribe({
        next: state => {
          if (state.status === 'processed') {
            const { name } = state;

            this.fileName = name;
            // we can only ask for the image once the file is processed
            this.setImageUrl(identifier);
            getFileSubscription.unsubscribe();
          }
        },
      });
    this.getFileSubscription = getFileSubscription;
  };

  setImageUrl = async (identifier: FileIdentifier) => {
    const { context } = this.props;
    const id = await identifier.id;
    const imageUrl = await context.getImageUrl(id, {
      collection: identifier.collectionName,
    });

    this.setState({
      imageUrl,
    });
  };

  onSave = (imageData: string) => {
    const { fileName } = this;
    const { context, identifier, onUploadStart } = this.props;
    const { collectionName } = identifier;
    const uploadableFile: UploadableFile = {
      content: imageData,
      collection: collectionName,
      name: fileName,
    };
    const id = uuid();
    const occurrenceKey = uuid();
    const touchedFiles = context.file.touchFiles(
      [
        {
          fileId: id,
          collection: collectionName,
          occurrenceKey,
        },
      ],
      collectionName,
    );
    const deferredUploadId = touchedFiles.then(
      touchedFiles => touchedFiles.created[0].uploadId,
    );
    const uploadableFileUpfrontIds = {
      id,
      deferredUploadId,
      occurrenceKey,
    };

    context.file.upload(uploadableFile, undefined, uploadableFileUpfrontIds);

    const newFileIdentifier: FileIdentifier = {
      id,
      occurrenceKey,
      collectionName,
      mediaItemType: 'file',
    };
    onUploadStart(newFileIdentifier);
  };

  onCancel = () => {};

  onError = () => {};

  renderLoading = () => {
    return (
      <SpinnerWrapper>
        <Spinner size="large" />
      </SpinnerWrapper>
    );
  };

  renderEditor = (imageUrl: string) => {
    return (
      <EditorView
        imageUrl={imageUrl}
        onSave={this.onSave}
        onCancel={this.onCancel}
        onError={this.onError}
      />
    );
  };

  render() {
    const { imageUrl } = this.state;
    const content = imageUrl
      ? this.renderEditor(imageUrl)
      : this.renderLoading();

    return (
      <Blanket>
        <Shortcut keyCode={27} handler={this.onCancel} />
        {content}
      </Blanket>
    );
  }
}
