import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createMount, createRender } from '@material-ui/core/test-utils';
import initStoryshots from '@storybook/addon-storyshots';

Enzyme.configure({ adapter: new Adapter() });

initStoryshots({
  renderer: createMount(),
  // snapshotSerializers: [createRender()],
});
