import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

export default function placeholder(text) {
  return new Plugin({
    props: {
      decorations(state) {
        const decorations = [];
        const { doc, selection } = state;
        if (doc.textContent) return;
        doc.descendants((node, pos) => {
          if (!node.isBlock || !!node.textContent) return;
          if (selection.empty && selection.from === pos + 1) {
            // The selection is inside the node
            decorations.push(
              Decoration.node(pos, pos + node.nodeSize, {
                class: 'placeholder',
                style: `--placeholder-text: "${text}";`,
              })
            );
          }
          return false;
        });

        return DecorationSet.create(doc, decorations);
      },
    },
  });
}
