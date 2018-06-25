import * as React from 'react';
import { Component, SyntheticEvent } from 'react';
import {
  defaultServiceHost,
  defaultCollectionName,
  mediaPickerAuthProvider,
} from '@atlaskit/media-test-helpers';
import { ContextFactory, UploadController } from '../src';
import { FilesWrapper, FileWrapper } from '../example-helpers/styled';
import { Observable } from 'rxjs/Observable';
import { FileState } from '../src/fileState';

export interface ComponentProps {}
export interface ComponentState {
  files: { [id: string]: FileState };
}

const mediaContext = ContextFactory.create({
  serviceHost: defaultServiceHost,
  authProvider: mediaPickerAuthProvider('asap'),
});

class Example extends Component<ComponentProps, ComponentState> {
  fileStreams: Observable<FileState>[];
  uploadController?: UploadController;

  constructor(props: ComponentProps) {
    super(props);

    this.state = {
      files: {},
    };
    this.fileStreams = [];
  }

  onFileUpdate = (streamId: number) => (state: FileState) => {
    console.log('on update', streamId, state);
    this.setState({
      files: {
        ...this.state.files,
        [streamId]: state,
      },
    });
  };

  uploadFile = async (event: SyntheticEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files![0];
    const uplodableFile = {
      content: file,
      name: file.name,
      collection: defaultCollectionName,
    };
    const uploadController = new UploadController();
    const stream = mediaContext.uploadFile(uplodableFile, uploadController);

    this.uploadController = uploadController;
    this.addStream(stream);
  };

  addStream = (stream: Observable<FileState>) => {
    const streamId = new Date().getTime();

    stream.subscribe({
      next: this.onFileUpdate(streamId),
      complete() {
        console.log('stream complete');
      },
      error(error) {
        console.log('stream error', error);
      },
    });

    this.fileStreams.push(stream);
  };

  renderFiles = () => {
    const { files } = this.state;
    const fileData = Object.keys(files).map((fileId, key) => {
      const file = files[fileId];
      let name, progress;

      if (file.status !== 'error') {
        name = <div>name: {file.name}</div>;
      }

      if (file.status === 'uploading') {
        progress = <div>progress: {file.progress}</div>;
      }

      return (
        <FileWrapper status={file.status} key={key}>
          <div>Id: {file.id}</div>
          <div>Status: {file.status}</div>
          <div>
            {name}
            {progress}
          </div>
        </FileWrapper>
      );
    });

    return <FilesWrapper>{fileData}</FilesWrapper>;
  };

  cancelUpload = () => {
    if (this.uploadController) {
      this.uploadController.abort();
    }
  };

  render() {
    return (
      <div>
        <input type="file" onChange={this.uploadFile} />
        <button onClick={this.cancelUpload}>Cancel upload</button>
        <div>
          <h1>Files</h1>
          {this.renderFiles()}
        </div>
      </div>
    );
  }
}

export default () => (
  <div>
    <Example />
  </div>
);
