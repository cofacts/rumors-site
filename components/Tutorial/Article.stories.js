import React from 'react';
import Article from './Article';
import { withKnobs, text, select } from '@storybook/addon-knobs';

export default {
  title: 'Tutorial/Article',
  component: 'Article',
  decorators: [withKnobs],
};

export const normal = () => (
  <div style={{ padding: '20px' }}>
    <Article
      label={text('label', '1')}
      theme={select('theme', ['yellow', 'blue'], 'yellow')}
      title={text(
        'title',
        '先看看別人是怎麼查核，從複核別人的查核回應開始吧！'
      )}
      subTitle={text(
        'subTitle',
        '想寫出好的查核訊息前，先看看別人是怎麼查核的吧！'
      )}
      content={text(
        'content',
        '「Cofacts 真的假的」上的訊息查核，是由世界各地的網友編輯，無償自主查核貢獻的喔！但是編輯們的查核成果，不見得就是正確完整的呢！因此，需要網友編輯們來覆核評價，協助篩選出好的查核結果。新手編輯們，也可以從中學習別人是怎麼查核闢謠呢！'
      )}
      subContent={[
        {
          label: '第 1 步',
          title: '尋找需要被覆核的回應',
          content: [
            {
              type: 'text',
              data: `「最新查核」會列出其他志工編輯查核回應，以下不同篩選能幫你篩選出——
              「還未有效查核」：目前還沒有使用者覺得好的可疑訊息，推薦使用。
              「熱門回報」：目前很多使用者想問真假的可疑訊息。
              「熱門討論」：目前很多編輯查核回應的可疑訊息。
              `,
            },
            {
              type: 'image',
              data: 'https://fakeimg.pl/400x300/',
            },
            {
              type: 'text',
              data: `「最新查核」會列出其他志工編輯查核回應，以下不同篩選能幫你篩選出——
              「還未有效查核」：目前還沒有使用者覺得好的可疑訊息，推薦使用。
              「熱門回報」：目前很多使用者想問真假的可疑訊息。
              「熱門討論」：目前很多編輯查核回應的可疑訊息。`,
            },
            {
              type: 'image',
              data: 'https://fakeimg.pl/400x300/',
            },
          ],
        },
        {
          label: '第 2 步',
          title: '尋找需要被覆核的回應',
          content: [
            {
              type: 'text',
              data: `「最新查核」會列出其他志工編輯查核回應，以下不同篩選能幫你篩選出——
              「還未有效查核」：目前還沒有使用者覺得好的可疑訊息，推薦使用。
              「熱門回報」：目前很多使用者想問真假的可疑訊息。
              「熱門討論」：目前很多編輯查核回應的可疑訊息。
              `,
            },
            {
              type: 'image',
              data: 'https://fakeimg.pl/400x300/',
            },
            {
              type: 'text',
              data: `「最新查核」會列出其他志工編輯查核回應，以下不同篩選能幫你篩選出——
              「還未有效查核」：目前還沒有使用者覺得好的可疑訊息，推薦使用。
              「熱門回報」：目前很多使用者想問真假的可疑訊息。
              「熱門討論」：目前很多編輯查核回應的可疑訊息。`,
            },
            {
              type: 'image',
              data: 'https://fakeimg.pl/400x300/',
            },
          ],
        },
      ]}
    />
  </div>
);
