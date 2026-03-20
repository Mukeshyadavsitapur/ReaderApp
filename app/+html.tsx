import React from 'react';

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" />
        {/* PWA Full-Height Fix: ensure app fills the entire screen without blank space at bottom */}
        <style dangerouslySetInnerHTML={{ __html: `
          html, body, #root { height: 100%; margin: 0; padding: 0; }
          body { overflow: hidden; }
        ` }} />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta name="theme-color" content="#E6F4FE" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ReaderApp" />
        <link rel="apple-touch-icon" href="/icon.png" />

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
                    // console.log('ServiceWorker registration successful with scope: ', registration.scope);
                  }, function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  });
                });
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
