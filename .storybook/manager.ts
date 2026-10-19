import './manager.css';

import { addons, types } from 'storybook/manager-api';
import theme from './theme';
import { THEMES_ID } from './theme-picker/constants';
import { ThemeList } from './theme-picker/ThemeList';

addons.setConfig({
  theme
});

addons.register(THEMES_ID, () => {
  addons.add(`${THEMES_ID}/panel`, {
    title: 'Themes',
    type: types.PANEL,
    render: ThemeList
  });
});
