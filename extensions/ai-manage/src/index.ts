import routes from './routes';
import locales from './locales';

const menu = {
  parent: 'global',
  name: 'ai-manage',
  title: 'AI_MANAGE',
  icon: 'computing',
  order: 0,
  desc: 'SUB_TITLE',
  skipAuth: true,
};

const extensionConfig = {
  routes,
  menus: [menu],
  locales,
};

export default extensionConfig;
globals.context.registerExtension(extensionConfig);
