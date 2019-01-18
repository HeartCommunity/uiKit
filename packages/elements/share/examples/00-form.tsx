import { userPickerData } from '@atlaskit/util-data-test';
import * as React from 'react';
import { ShareForm } from '../src/components/ShareForm';

const loadOptions = () => userPickerData;

export default () => (
  <ShareForm
    onLinkCopy={console.log}
    onShareClick={console.log}
    loadOptions={loadOptions}
    shareLink={window.location.href}
  />
);
