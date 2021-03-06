import React from 'react';
import { TargetOverlay, TargetInner } from '../styled/Target';

function cloneAndOverrideStyles(node) {
  var shouldCloneChildren = true;
  var clonedNode = node.cloneNode(shouldCloneChildren);
  clonedNode.style.margin = '0';
  clonedNode.style.position = 'static'; // The target may have other transforms applied. Avoid unintended side effects
  // by zeroing out "translate" rather than applying a value of "none".

  clonedNode.style.transform = 'translate(0, 0) translate3d(0, 0, 0)';
  return clonedNode;
}

var Clone = function Clone(props) {
  var pulse = props.pulse,
      rect = props.rect,
      target = props.target,
      targetBgColor = props.targetBgColor,
      targetOnClick = props.targetOnClick,
      targetNode = props.targetNode,
      targetRadius = props.targetRadius;
  return React.createElement(TargetInner, {
    pulse: pulse,
    bgColor: targetBgColor,
    radius: targetRadius,
    style: rect
  }, React.createElement("div", {
    // eslint-disable-next-line react/no-danger
    dangerouslySetInnerHTML: {
      __html: cloneAndOverrideStyles(targetNode).outerHTML
    },
    style: {
      pointerEvents: 'none'
    }
  }), React.createElement(TargetOverlay, {
    onClick: targetOnClick ? function (event) {
      return targetOnClick({
        event: event,
        target: target
      });
    } : undefined
  }));
};

export default Clone;