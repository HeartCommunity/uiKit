import * as React from 'react';
import { ComponentClass } from 'react';

import { Fragment, Mark, Node, Schema } from 'prosemirror-model';

import { Serializer } from '../';

import {
  Doc,
  mergeTextNodes,
  isTextWrapper,
  TextWrapper,
  isEmojiDoc,
  toReact,
} from './nodes';

import { toReact as markToReact } from './marks';

import {
  ProviderFactory,
  getMarksByOrder,
  isSameMark,
  EventHandlers,
} from '@atlaskit/editor-common';
import { ExtensionHandlers } from '../ui/Renderer';
import { bigEmojiHeight } from '../utils';

export interface RendererContext {
  objectAri: string;
  containerAri: string;
  adDoc?: any;
  schema?: Schema;
}

export interface ConstructorParams {
  providers?: ProviderFactory;
  eventHandlers?: EventHandlers;
  extensionHandlers?: ExtensionHandlers;
  portal?: HTMLElement;
  objectContext?: RendererContext;
}

export default class ReactSerializer implements Serializer<JSX.Element> {
  private providers?: ProviderFactory;
  private eventHandlers?: EventHandlers;
  private extensionHandlers?: ExtensionHandlers;
  private portal?: HTMLElement;
  private rendererContext?: RendererContext;

  constructor({
    providers,
    eventHandlers,
    extensionHandlers,
    portal,
    objectContext,
  }: ConstructorParams) {
    this.providers = providers;
    this.eventHandlers = eventHandlers;
    this.extensionHandlers = extensionHandlers;
    this.portal = portal;
    this.rendererContext = objectContext;
  }

  serializeFragment(
    fragment: Fragment,
    props: any = {},
    target: any = Doc,
    key: string = 'root-0',
  ): JSX.Element | null {
    const emojiBlock = isEmojiDoc(fragment, props);
    const content = ReactSerializer.getChildNodes(fragment).map(
      (node, index) => {
        if (isTextWrapper(node.type.name)) {
          return this.serializeTextWrapper((node as TextWrapper).content);
        }
        const props = emojiBlock
          ? this.getEmojiBlockProps(node as Node)
          : this.getProps(node as Node);

        return this.serializeFragment(
          (node as Node).content,
          props,
          toReact(node as Node),
          `${node.type.name}-${index}`,
        );
      },
    );

    return this.renderNode(target, props, key, content);
  }

  private serializeTextWrapper(content: Node[]) {
    return ReactSerializer.buildMarkStructure(content).map((mark, index) =>
      this.serializeMark(mark, index),
    );
  }

  private serializeMark(mark: Mark, index: number = 0) {
    if (mark.type.name === 'text') {
      return (mark as any).text;
    }

    const content = ((mark as any).content || []).map((child, index) =>
      this.serializeMark(child, index),
    );
    return this.renderMark(
      markToReact(mark),
      this.getMarkProps(mark),
      `${mark.type.name}-${index}`,
      content,
    );
  }

  // tslint:disable-next-line:variable-name
  private renderNode(
    Node: ComponentClass<any>,
    props: any,
    key: string,
    content: string | JSX.Element | any[] | null | undefined,
  ): JSX.Element {
    return (
      <Node key={key} {...props}>
        {content}
      </Node>
    );
  }

  // tslint:disable-next-line:variable-name
  private renderMark(
    Mark: ComponentClass<any>,
    props: any,
    key: string,
    content: any,
  ) {
    return (
      <Mark key={key} {...props}>
        {content}
      </Mark>
    );
  }

  private getEmojiBlockProps(node: Node) {
    return {
      ...this.getProps(node),
      fitToHeight: bigEmojiHeight,
    };
  }

  private getProps(node: Node) {
    return {
      text: node.text,
      providers: this.providers,
      eventHandlers: this.eventHandlers,
      extensionHandlers: this.extensionHandlers,
      portal: this.portal,
      rendererContext: this.rendererContext,
      serializer: this,
      ...node.attrs,
    };
  }

  private getMarkProps(mark: Mark): any {
    return {
      eventHandlers: this.eventHandlers,
      ...mark.attrs,
    };
  }

  static getChildNodes(fragment: Fragment): (Node | TextWrapper)[] {
    const children: Node[] = [];
    fragment.forEach(node => {
      children.push(node);
    });
    return mergeTextNodes(children) as Node[];
  }

  static getMarks(node: Node): Mark[] {
    if (!node.marks || node.marks.length === 0) {
      return [];
    }

    return getMarksByOrder(node.marks);
  }

  static buildMarkStructure(content: Node[]) {
    let currentMarkNode: any;
    return content.reduce(
      (acc, node, index) => {
        const nodeMarks = this.getMarks(node);

        if (nodeMarks.length === 0) {
          currentMarkNode = node;
          acc.push(currentMarkNode);
        } else {
          nodeMarks.forEach((mark, markIndex) => {
            const isSameAsPrevious = isSameMark(mark, currentMarkNode as Mark);
            const previousIsInMarks =
              markIndex > 0 &&
              nodeMarks.some(m => isSameMark(m, currentMarkNode));

            if (!isSameAsPrevious) {
              let newMarkNode: any = {
                ...mark,
                content: [],
              };

              if (previousIsInMarks) {
                currentMarkNode.content!.push(newMarkNode);
                currentMarkNode = newMarkNode;
              } else {
                acc.push(newMarkNode);
                currentMarkNode = newMarkNode;
              }
            }
          });

          currentMarkNode.content!.push(node);
        }

        return acc;
      },
      [] as Mark[],
    );
  }

  static fromSchema(
    schema: Schema,
    { providers, eventHandlers, extensionHandlers }: ConstructorParams,
  ): ReactSerializer {
    // TODO: Do we actually need the schema here?
    return new ReactSerializer({ providers, eventHandlers, extensionHandlers });
  }
}
