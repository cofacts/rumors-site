import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import initStoryshots, {
  multiSnapshotWithOptions,
} from '@storybook/addon-storyshots';
import { createSerializer } from 'enzyme-to-json';

Enzyme.configure({ adapter: new Adapter() });

const MAKE_STYLE_REGEXP = /(makeStyles-.+?)-\d+/g;

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

  // Skip HOC components (single children) or excessive wrapper
  if (json.type.match(/^(ForwardRef|WithStyles|ThemeProvider|Styled)/)) {
    // When skipping HOC or wrapper, the first children are usually setups (such as <CssBaseline>),
    // we should ignore together
    return (
      json.children &&
      removeMaterialUIInternals(json.children[json.children.length - 1])
    );
  }

  // Remove makeStyle className serial numbers
  if (
    json.props &&
    json.props.className &&
    json.props.className.match(MAKE_STYLE_REGEXP)
  ) {
    json = {
      ...json,
      props: {
        ...json.props,
        className: json.props.className.replace(MAKE_STYLE_REGEXP, '$1'),
      },
    };
  }

  return json;
}

initStoryshots({
  test: multiSnapshotWithOptions({
    renderer: mount,
  }),
  snapshotSerializers: [createSerializer({ map: removeMaterialUIInternals })],
});
