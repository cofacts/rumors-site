import React from 'react';
import { withKnobs, text, number } from '@storybook/addon-knobs';

import ExpandableText from './ExpandableText';

export default {
  title: 'ExpandableText',
  component: 'ExpandableText',
  decorators: [withKnobs],
};

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eu ex augue. Etiam posuere sagittis iaculis. Vestibulum sollicitudin nec felis a mollis. Phasellus ut est velit. Proin fermentum arcu ornare quam vulputate, vel eleifend velit ultrices. Fusce tincidunt vel urna at luctus. Quisque fermentum magna sit amet nunc faucibus, quis fringilla massa maximus. Aliquam tincidunt orci et felis rutrum, et egestas ante egestas. Duis vel dolor sed risus pulvinar pretium at in lorem. Duis sed odio at orci tincidunt pharetra. Mauris ut erat at diam mattis ultrices eget et dui. Maecenas sit amet ultrices nunc. Vivamus hendrerit odio sit amet ex congue tincidunt. Phasellus id enim in enim congue pharetra eget id lacus. Donec sit amet erat vel augue aliquam tristique et non justo. Suspendisse lorem dui, vestibulum vel ante vel, sagittis malesuada leo. Aenean aliquam vestibulum tortor a suscipit. Maecenas a diam suscipit, semper leo ut, aliquam felis. Donec ex mi, lobortis eget feugiat ac, facilisis eu nunc. Nullam lacinia quis quam id rutrum. In pellentesque lacus ac ipsum faucibus pharetra. Mauris vulputate magna nec enim maximus, sed porta lacus posuere. Maecenas felis ipsum, iaculis a enim sed, aliquet interdum dolor. Phasellus id arcu in nisi facilisis volutpat fermentum sodales magna. Etiam ornare vel mauris in faucibus. Ut consequat eget felis sed vulputate. Fusce dapibus aliquet turpis, in ultricies tortor congue porttitor. Integer a quam orci. Donec eu ligula blandit, dapibus neque a, mollis sapien. Nam maximus lectus augue, vel iaculis mi dignissim vitae.';

export const WithWordCountGiven = () => (
  <ExpandableText wordCount={number('wordCount', 40)}>
    {text('Content', lorem)}
  </ExpandableText>
);

export const WithLineClampGiven = () => (
  <div>
    <p style={{ fontSize: 12 }}>
      Calculating line clamp base on container height. <br />
      *Known bug: container&apos;s line-height is not numeric(ex:
      &apos;normal&apos;) will cause error.
    </p>
    <div style={{ lineHeight: '16px' }}>
      <ExpandableText lineClamp={number('lineClamp', 3)}>
        {text('Content', lorem)}
      </ExpandableText>
    </div>
  </div>
);

export const WithDifferentBackground = () => (
  <div>
    <p style={{ fontSize: 12 }}>
      Use <code>--background</code> CSS variable to control background color of
      toggle
    </p>
    <div
      style={{
        color: '#fff',
        background: '#000',
        '--background': '#000',
        lineHeight: 2,
      }}
    >
      <ExpandableText lineClamp={number('lineClamp', 3)}>
        {text('Content', lorem)}
      </ExpandableText>
    </div>
  </div>
);
