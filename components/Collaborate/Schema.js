// Ref: https://github.com/yjs/yjs-demos/blob/main/prosemirror-versions/schema.js
//
import { Schema } from 'prosemirror-model';

const calcYChangeStyle = ychange => {
  switch (ychange.type) {
    case 'removed':
      return `color:${ychange.color.dark}`;
    case 'added':
      return `background-color:${ychange.color.light}`;
    case null:
      return '';
  }
};

const calcYchangeDomAttrs = (attrs, domAttrs = {}) => {
  domAttrs = Object.assign({}, domAttrs);
  if (attrs.ychange !== null) {
    domAttrs.ychange_user = attrs.ychange.user;
    domAttrs.ychange_type = attrs.ychange.type;
    domAttrs.ychange_color = attrs.ychange.color.light;
    domAttrs.style = calcYChangeStyle(attrs.ychange);
  }
  return domAttrs;
};

/**
 * @param {any} ychange
 * @param {Array<any>}
 */
const hoverWrapper = (ychange, els) => {
  if (ychange === null) {
    return els;
  } else {
    let name = '';
    try {
      name = ychange.user ? JSON.parse(ychange.user).name : 'Unknown';
    } catch (e) {
      // JSON.parse error
      // console.error(e);
    } finally {
      name = name || ychange.user;
    }

    return [
      [
        'span',
        {
          class: 'ychange-hover',
          style: `background-color:${ychange.color.dark}`,
        },
        name,
      ],
      ['span', ...els],
    ];
  }
};

// :: Object
// [Specs](#model.NodeSpec) for the nodes defined in this schema.
export const nodes = {
  // :: NodeSpec The top level document node.
  doc: {
    content: 'paragraph+',
  },

  paragraph: {
    attrs: { ychange: { default: null } },
    content: 'text*',
    code: true,
    parseDOM: [{ tag: 'p' }],
    toDOM(node) {
      // only render changes if no child nodes
      const renderChanges = node.content.size === 0;
      const attrs = renderChanges
        ? calcYchangeDomAttrs(node.attrs)
        : node.attrs;
      const defChildren = [0];
      const children = renderChanges
        ? hoverWrapper(node.attrs.ychange, defChildren)
        : defChildren;
      return ['p', attrs, ...children];
    },
  },

  // :: NodeSpec The text node.
  text: {},
};

// :: Object [Specs](#model.MarkSpec) for the marks in the schema.
export const marks = {
  ychange: {
    attrs: {
      user: { default: null },
      type: { default: null },
      color: { default: null },
    },
    inclusive: false,
    parseDOM: [{ tag: 'ychange' }],
    toDOM(node) {
      return [
        'ychange',
        {
          ychange_user: node.attrs.user,
          ychange_type: node.attrs.type,
          style: calcYChangeStyle(node.attrs),
          ychange_color: node.attrs.color.light,
        },
        ...hoverWrapper(node.attrs, [0]),
      ];
    },
  },
};

// :: Schema
// This schema rougly corresponds to the document schema used by
// [CommonMark](http://commonmark.org/), minus the list elements,
// which are defined in the [`prosemirror-schema-list`](#schema-list)
// module.
//
// To reuse elements from this schema, extend or read from its
// `spec.nodes` and `spec.marks` [properties](#model.Schema.spec).
export const schema = new Schema({ nodes, marks });
