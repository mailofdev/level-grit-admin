const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  plugins: [
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'google-fonts-stylesheets',
          },
        },
      ],
      // Don't cache external analytics/tracking scripts
      navigateFallback: '/index.html',
      navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
    }),
  ],
};