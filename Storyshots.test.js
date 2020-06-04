import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import initStoryshots from '@storybook/addon-storyshots';
import { createSerializer } from 'enzyme-to-json';

Enzyme.configure({ adapter: new Adapter() });

function removeMaterialUIInternals(json) {
  // Remove Portal containerInfo
  if (json.type === 'Portal') {
    return {
      ...json,
      props: {
        ...json.props,
        containerInfo: undefined,
      },
    };
  }

  // Remove all props of these components
  if (['Transition', 'TrapFocus'].includes(json.type)) {
    return {
      ...json,
      props: {},
    };
  }

  // Skip HOC components (single children)
  if (json.type.match(/^(ForwardRef|WithStyles)/)) {
    return json.children && json.children[0];
  }

  return json;
}

initStoryshots({
  renderer: mount,
  snapshotSerializers: [createSerializer({ map: removeMaterialUIInternals })],
});
