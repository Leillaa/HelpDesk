const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app: any) {
  // Proxy API requests to backend
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000',
      changeOrigin: true,
    })
  );

  // Fallback for SPA routing - serve index.html for all non-API routes
  app.get('*', (req: any, res: any, next: any) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/static')) {
      return next();
    }
    res.sendFile('index.html', { root: 'public' });
  });
};