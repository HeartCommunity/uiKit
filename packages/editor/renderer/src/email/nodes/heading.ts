import { typography } from '@findable/theme';
import { NodeSerializerOpts } from '../interfaces';
import { createTag, applyMarks } from '../util';

const getTypoMixin = (tagName: string) => {
  switch (tagName) {
    case 'h1':
      return typography.h800();
    case 'h2':
      return typography.h700();
    case 'h3':
      return typography.h600();
    case 'h4':
      return typography.h500();
    case 'h5':
      return typography.h400();
    case 'h6':
      return typography.h300();
    default:
      throw new Error(`Unknown tagName: ${tagName}`);
  }
};

export default function heading({ attrs, marks, text }: NodeSerializerOpts) {
  const tagName = `h${attrs.level}`;
  const css = (getTypoMixin(tagName) as any).join().trim();

  const headingTag = createTag(tagName, { style: css }, text);
  return applyMarks(marks, headingTag);
}
