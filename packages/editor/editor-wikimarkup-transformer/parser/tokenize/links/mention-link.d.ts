import { ContentLink } from './link-parser';
import { Schema, Node as PMNode } from 'prosemirror-model';
export declare function mentionLinkResolver(link: ContentLink, schema: Schema): PMNode[] | undefined;
