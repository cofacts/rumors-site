import React from 'react';

import Tooltip from './Tooltip';

export default {
  title: 'Tooltip',
  component: 'Tooltip',
};

// eslint-disable-next-line
const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eu ex augue. Etiam posuere sagittis iaculis. Vestibulum sollicitudin nec felis a mollis. Phasellus ut est velit. Proin fermentum arcu ornare quam vulputate, vel eleifend velit ultrices. Fusce tincidunt vel urna at luctus. Quisque fermentum magna sit amet nunc faucibus, quis fringilla massa maximus. Aliquam tincidunt orci et felis rutrum, et egestas ante egestas. Duis vel dolor sed risus pulvinar pretium at in lorem. Duis sed odio at orci tincidunt pharetra. Mauris ut erat at diam mattis ultrices eget et dui. Maecenas sit amet ultrices nunc. Vivamus hendrerit odio sit amet ex congue tincidunt. Phasellus id enim in enim congue pharetra eget id lacus. Donec sit amet erat vel augue aliquam tristique et non justo. Suspendisse lorem dui, vestibulum vel ante vel, sagittis malesuada leo. Aenean aliquam vestibulum tortor a suscipit. Maecenas a diam suscipit, semper leo ut, aliquam felis. Donec ex mi, lobortis eget feugiat ac, facilisis eu nunc. Nullam lacinia quis quam id rutrum. In pellentesque lacus ac ipsum faucibus pharetra. Mauris vulputate magna nec enim maximus, sed porta lacus posuere. Maecenas felis ipsum, iaculis a enim sed, aliquet interdum dolor. Phasellus id arcu in nisi facilisis volutpat fermentum sodales magna. Etiam ornare vel mauris in faucibus. Ut consequat eget felis sed vulputate. Fusce dapibus aliquet turpis, in ultricies tortor congue porttitor. Integer a quam orci. Donec eu ligula blandit, dapibus neque a, mollis sapien. Nam maximus lectus augue, vel iaculis mi dignissim vitae.";

export const Normal = () => (
  <>
    <p>Material UI tooltip with customized styles and props.</p>
    <p>
      Consult <a href="https://material-ui.com/api/tooltip/">Material UI doc</a>{' '}
      for props.
    </p>
    <hr />
    <p
      style={{
        display: 'flex',
        flexFlow: 'row wrap',
        justifyContent: 'space-around',
      }}
    >
      <Tooltip title="1989-06-04">
        <span>20 years ago</span>
      </Tooltip>

      <Tooltip
        title={
          <>
            Some <em>HTML</em> <b>text</b>
          </>
        }
      >
        <span>HTML title</span>
      </Tooltip>
    </p>
  </>
);

export const Placements = () => (
  <p
    style={{
      margin: 50,
      display: 'flex',
      flexFlow: 'row wrap',
      justifyContent: 'space-around',
    }}
  >
    <Tooltip title="top" placement="top">
      <code>placement=top</code>
    </Tooltip>
    <Tooltip title="bottom" placement="bottom">
      <code>placement=bottom</code>
    </Tooltip>
    <Tooltip title="right" placement="right">
      <code>placement=right</code>
    </Tooltip>
    <Tooltip title="bottom-end" placement="bottom-end">
      <code>placement=bottom-end</code>
    </Tooltip>
  </p>
);
