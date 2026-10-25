import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import createOrderHandler from './api/create-order';
import verifyPaymentHandler from './api/verify-payment';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        {
          name: 'razorpay-api-dev-server',
          configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
              const url = req.url?.split('?')[0];
              if (url === '/api/create-order') {
                try {
                  await createOrderHandler(req, res);
                } catch (err: any) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
                }
                return;
              }
              if (url === '/api/verify-payment') {
                try {
                  await verifyPaymentHandler(req, res);
                } catch (err: any) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: false, error: err.message || 'Internal Server Error' }));
                }
                return;
              }
              next();
            });
          }
        }
      ],
      define: {
        'process.env.OPENROUTER_API_KEY': JSON.stringify(env.OPENROUTER_API_KEY),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        }
      },
      build: {
        sourcemap: false,
        rollupOptions: {
          output: {
            manualChunks: {
              'vendor-react': ['react', 'react-dom'],
              'vendor-motion': ['framer-motion'],
              'vendor-supabase': ['@supabase/supabase-js'],
            }
          }
        }
      }
    };
});
