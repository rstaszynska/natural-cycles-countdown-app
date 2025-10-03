export default {
  bootstrap: () => import('./main.server.mjs').then((m) => m.default),
  inlineCriticalCss: true,
  baseHref: '/natural-cycles-countdown-app/',
  locale: undefined,
  routes: [
    {
      renderMode: 2,
      route: '/natural-cycles-countdown-app',
    },
  ],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {
      size: 9318,
      hash: '647fa5a55dc7d6b67a88bdc3b15df82bb3aff4a2eda92a661a625df3020a6de6',
      text: () => import('./assets-chunks/index_csr_html.mjs').then((m) => m.default),
    },
    'index.server.html': {
      size: 1767,
      hash: '1595e9f2b4f2ef0ba0cfa93b81a679fe60329d5150741d9d40da7a2c591ecf32',
      text: () => import('./assets-chunks/index_server_html.mjs').then((m) => m.default),
    },
    'index.html': {
      size: 50888,
      hash: '9e4f817a87052e19af6dc5e540fd5224a26f06f86f2e6abbaa9f5d9e89cdc5fc',
      text: () => import('./assets-chunks/index_html.mjs').then((m) => m.default),
    },
    'styles-WXYCF54O.css': {
      size: 8109,
      hash: 'j+taau7qsHo',
      text: () => import('./assets-chunks/styles-WXYCF54O_css.mjs').then((m) => m.default),
    },
  },
};
