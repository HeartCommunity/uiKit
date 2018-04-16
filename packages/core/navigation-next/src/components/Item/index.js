// @flow

import React, { PureComponent } from 'react';

import InteractionStateManager from '../InteractionStateManager';
import { styleReducerNoOp } from '../../theme';
import ItemPrimitive from './primitives';
import type { ItemProps } from './types';

export default class Item extends PureComponent<ItemProps> {
  static defaultProps = {
    styles: styleReducerNoOp,
    isSelected: false,
    spacing: 'default',
    text: '',
  };

  render() {
    return (
      <InteractionStateManager>
        {state => <ItemPrimitive {...state} {...this.props} />}
      </InteractionStateManager>
    );
  }
}
