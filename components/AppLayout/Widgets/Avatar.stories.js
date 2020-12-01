import React from 'react';
import Avatar from './Avatar';

export default {
  title: 'Avatar',
  component: 'Avatar',
};

const users = [
  {
    user: {
      name: '活潑的田中巴里特',
      avatarType: 'OpenPeeps',
      avatarData: `{"accessory":"None","body":"Gaming","face":"Tired","hair":"Buns","facialHair":"None","backgroundColorIndex":0.8677238725450868,"flip":true}`,
      level: 7,
    },
    size: 40,
    showLevel: false,
  },
  {
    user: {
      name: '斯文的五峰瓦妮莎',
      avatarType: 'OpenPeeps',
      avatarData: `{"accessory":"None","body":"Coffee","face":"LoveGrin","hair":"Afro","facialHair":"Imperial","backgroundColorIndex":0.6690943799257243,"flip":false}`,
      level: 5,
    },
    size: 42,
    showLevel: true,
  },
  {
    user: {
      name: '貫徹始終的田尾薩琳娜',
      avatarType: 'OpenPeeps',
      avatarData: `{"accessory":"GlassButterfly","body":"PointingUp","face":"Cyclops","hair":"BunFancy","facialHair":"None","backgroundColorIndex":0.5628659387485422,"flip":false}`,
      level: 20,
    },
    size: 60,
    showLevel: false,
  },
  {
    user: {
      name: '無拘束的望安霍伯特',
      avatarType: 'OpenPeeps',
      avatarData: `{"accessory":"GlassButterfly","body":"Shirt","face":"Blank","hair":"ShortScratch","facialHair":"FullMajestic","backgroundColorIndex":0.7752845572942368,"flip":true}`,
      level: 0,
    },
    size: 60,
    showLevel: true,
  },
  {
    user: {
      name: '卍熱情的金湖摩西卍',
      avatarType: 'OpenPeeps',
      avatarData: `{"accessory":"GlassButterfly","body":"Hoodie","face":"Calm","hair":"DocBouffant","facialHair":"GrayFull","backgroundColorIndex":0.4192742347800349,"flip":true}`,
      level: 1,
    },
    size: 40,
    mdSize: 72,
    showLevel: false,
  },
  {
    user: {
      name: '熱情的南港麥基',
      avatarUrl:
        'https://www.gravatar.com/avatar/111d68d06e2d317b5a59c2c6c5bad808?s=80&d=identicon&r=g',
      level: 15,
    },
    size: 40,
    showLevel: true,
  },
  {
    user: {
      name: '受尊重的福興哲羅',
    },
    size: 40,
    showLevel: false,
  },
];

export const Normal = () => {
  return (
    <div>
      {users.map(({ user, size, mdSize, showLevel }, i) => (
        <div
          key={i}
          style={{
            width: '80px',
            height: '80px',
            display: 'block',
            textAlign: 'center',
            verticalAlign: 'middle',
          }}
        >
          <Avatar
            user={user}
            size={size}
            showLevel={showLevel}
            mdSize={mdSize}
          />
        </div>
      ))}
    </div>
  );
};
