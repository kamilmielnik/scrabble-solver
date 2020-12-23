import React from 'react';

import Tile from './Tile';

export default {
  title: 'Tile',
  argTypes: { onClick: { action: 'clicked' } },
};

const TemplateWithText = (args: any) => <Tile {...args} />;

export const withText = TemplateWithText.bind({});

(withText as any).args = {};
