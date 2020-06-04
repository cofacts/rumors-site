import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import initStoryshots from '@storybook/addon-storyshots';
import { createSerializer } from 'enzyme-to-json';

Enzyme.configure({ adapter: new Adapter() });

initStoryshots({
  renderer: mount,
  snapshotSerializers: [createSerializer()],
});
