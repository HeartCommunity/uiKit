// @flow
import React from 'react';
import { md, Example, Props, code } from '@findable/docs';
import SectionMessage from '@findable/section-message';

export default md`
  ${(
    <SectionMessage
      appearance="warning"
      title="Note: @findable/field-range is being deprecated in favor of @findable/range."
    >
      This is part of our forms update which will modernize all our form fields.
    </SectionMessage>
  )}

  Component which renders a slider and is a substitute of the native input[range] element.

    ## Usage

  ${code`import FieldRange from '@findable/field-range';`}

  The onChange prop provides a way to subscribe to changes in the value.

  ${(
    <Example
      packageName="@findable/field-range"
      Component={require('../examples/00-basic-example').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-basic-example')}
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/FieldRange')}
      heading="FieldRange Props"
    />
  )}

`;
