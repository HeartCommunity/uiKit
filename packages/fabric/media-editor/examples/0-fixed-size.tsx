import * as React from 'react';
import {tallImage as imageDataUri} from '@atlaskit/media-test-helpers';
import {MediaEditor, LoadParameters} from '../src';
import {ShapeParameters} from '../src/common';

const lightGrey = {red: 230, green: 230, blue: 230};
const red = {red: 255, green: 0, blue: 0};

const fixedDimensions = {width: 600, height: 480};
const shapeParameters = {color: red, lineWidth: 10, addShadow: true};

let loadParameters: LoadParameters;

const onLoad = (imageUrl: string, parameters: LoadParameters) => {
  console.log('load', imageUrl, parameters);
  loadParameters = parameters;
};
const onError = (imageUrl: string, error: Error) => {
  console.log('error', imageUrl, error.message, error);
};
const onShapeParametersChanged = (params: ShapeParameters) => {
  console.log('shape parameters changed', params);
};

export default () => (
  <MediaEditor
    imageUrl={imageDataUri}
    dimensions={fixedDimensions}
    backgroundColor={lightGrey}
    shapeParameters={shapeParameters}
    tool={'arrow'}
    onLoad={onLoad}
    onError={onError}
    onShapeParametersChanged={onShapeParametersChanged}
  />
);
