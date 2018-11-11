export default {
  props: {
    type: { type: 'enum', values: ['extension'] },
    attrs: {
      props: {
        extensionKey: { type: 'string', minLength: 1 },
        extensionType: { type: 'string', minLength: 1 },
        parameters: { type: 'object', optional: true },
        text: { type: 'string', optional: true },
        layout: {
          type: 'enum',
          values: ['wide', 'full-width', 'default'],
          optional: true,
        },
      },
    },
  },
};
