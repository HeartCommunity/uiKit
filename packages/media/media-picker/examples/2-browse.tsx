/* tslint:disable:no-console */
import * as React from 'react';
import { Component } from 'react';
import {
  mediaPickerAuthProvider,
  defaultCollectionName,
  defaultMediaPickerCollectionName,
  defaultServiceHost,
} from '@atlaskit/media-test-helpers';
import Button from '@atlaskit/button';
import DropdownMenu, { DropdownItem } from '@atlaskit/dropdown-menu';
import { MediaPicker, Browser, UploadParams } from '../src';
import { PopupHeader, PopupContainer } from '../example-helpers/styled';
import { PreviewsData } from '../example-helpers/previews-data';
import { AuthEnvironment } from '../example-helpers';
import { ContextFactory } from '@atlaskit/media-core';

export interface BrowserWrapperState {
  collectionName: string;
  authEnvironment: AuthEnvironment;
}

class BrowserWrapper extends Component<{}, BrowserWrapperState> {
  fileBrowser: Browser;
  dropzoneContainer: HTMLDivElement;

  state: BrowserWrapperState = {
    authEnvironment: 'client',
    collectionName: defaultMediaPickerCollectionName,
  };

  componentWillMount() {
    this.createBrowse();
  }

  createBrowse() {
    const context = ContextFactory.create({
      serviceHost: defaultServiceHost,
      authProvider: mediaPickerAuthProvider(this),
    });
    const uploadParams: UploadParams = {
      collection: defaultMediaPickerCollectionName,
    };
    const browseConfig = {
      multiple: true,
      fileExtensions: ['image/jpeg', 'image/png', 'video/mp4'],
      uploadParams,
    };
    this.fileBrowser = MediaPicker('browser', context, browseConfig);
  }

  onOpen = () => {
    this.fileBrowser.browse();
  };

  onCollectionChange = e => {
    const { innerText: collectionName } = e.target;

    this.setState({ collectionName }, () => {
      this.fileBrowser.setUploadParams({
        collection: collectionName,
      });
    });
  };

  onAuthTypeChange = e => {
    const { innerText: authEnvironment } = e.target;

    this.setState({ authEnvironment });
  };

  render() {
    const { collectionName, authEnvironment } = this.state;

    return (
      <PopupContainer>
        <PopupHeader>
          <Button appearance="primary" onClick={this.onOpen}>
            Open
          </Button>
          <DropdownMenu trigger={collectionName} triggerType="button">
            <DropdownItem onClick={this.onCollectionChange}>
              {defaultMediaPickerCollectionName}
            </DropdownItem>
            <DropdownItem onClick={this.onCollectionChange}>
              {defaultCollectionName}
            </DropdownItem>
          </DropdownMenu>
          <DropdownMenu trigger={authEnvironment} triggerType="button">
            <DropdownItem onClick={this.onAuthTypeChange}>client</DropdownItem>
            <DropdownItem onClick={this.onAuthTypeChange}>asap</DropdownItem>
          </DropdownMenu>
        </PopupHeader>
        <PreviewsData picker={this.fileBrowser} />
      </PopupContainer>
    );
  }
}

export default () => <BrowserWrapper />;
