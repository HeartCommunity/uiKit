import Button from '@findable/button';
import * as React from 'react';
import { ShareDialogWithTrigger } from '../src/components/ShareDialogWithTrigger';

const loadUserOptions = () => [];
const onShareSubmit = () => Promise.resolve({});

export default () => (
  <React.Fragment>
    <h4>Default share button</h4>
    <ShareDialogWithTrigger
      copyLink="copyLink"
      loadUserOptions={loadUserOptions}
      onShareSubmit={onShareSubmit}
    />
    <h4>Default share button with text</h4>
    <ShareDialogWithTrigger
      copyLink="copyLink"
      loadUserOptions={loadUserOptions}
      onShareSubmit={onShareSubmit}
      triggerButtonStyle="icon-with-text"
    />
    <h4>Custom share button</h4>
    <ShareDialogWithTrigger
      copyLink="copyLink"
      loadUserOptions={loadUserOptions}
      onShareSubmit={onShareSubmit}
    >
      {openDialog => <Button onClick={openDialog}>Custom Button</Button>}
    </ShareDialogWithTrigger>
  </React.Fragment>
);
