# Facebook Pixel Integration - Frontend Implementation

## Backend API Endpoints

✅ **Get Facebook Pixel ID**: `GET /api/settings/facebook-pixel-id`
✅ **Update Settings (including Pixel ID)**: `PATCH /api/settings/`

## Next.js Frontend Implementation

### 1. Create Facebook Pixel Hook

```typescript
// hooks/useFacebookPixel.ts
import { useEffect, useState } from 'react';

interface PixelData {
  facebookPixelId: string | null;
}

export const useFacebookPixel = () => {
  const [pixelId, setPixelId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPixelId = async () => {
      try {
        const response = await fetch('/api/settings/facebook-pixel-id');
        const data: PixelData = await response.json();
        setPixelId(data.facebookPixelId);
      } catch (error) {
        console.error('Failed to fetch Facebook Pixel ID:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPixelId();
  }, []);

  return { pixelId, loading };
};
```

### 2. Create Facebook Pixel Component

```typescript
// components/FacebookPixel.tsx
import { useEffect } from 'react';
import Script from 'next/script';
import { useFacebookPixel } from '../hooks/useFacebookPixel';

declare global {
  interface Window {
    fbq: any;
  }
}

const FacebookPixel = () => {
  const { pixelId, loading } = useFacebookPixel();

  useEffect(() => {
    if (!pixelId || loading) return;

    // Initialize Facebook Pixel
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('init', pixelId);
      window.fbq('track', 'PageView');
    }
  }, [pixelId, loading]);

  if (!pixelId || loading) return null;

  return (
    <>
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
};

export default FacebookPixel;
```

### 3. Add to Layout (_app.tsx or layout.tsx)

```typescript
// pages/_app.tsx (for Pages Router)
import FacebookPixel from '../components/FacebookPixel';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <FacebookPixel />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
```

```typescript
// app/layout.tsx (for App Router)
import FacebookPixel from './components/FacebookPixel';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <FacebookPixel />
        {children}
      </body>
    </html>
  );
}
```

### 4. Track Custom Events (Optional)

```typescript
// utils/facebookPixel.ts
export const trackEvent = (eventName: string, parameters?: any) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, parameters);
  }
};

// Usage examples:
// trackEvent('Purchase', { value: 100, currency: 'USD' });
// trackEvent('AddToCart', { content_ids: ['123'], content_type: 'product' });
// trackEvent('ViewContent', { content_ids: ['123'] });
```

### 5. Admin Panel Integration

```typescript
// Admin component to update Pixel ID
const AdminSettings = () => {
  const [pixelId, setPixelId] = useState('');

  const updatePixelId = async () => {
    try {
      const response = await fetch('/api/settings/', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ facebookPixelId: pixelId }),
      });
      
      if (response.ok) {
        alert('Facebook Pixel ID updated successfully!');
      }
    } catch (error) {
      console.error('Failed to update Pixel ID:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={pixelId}
        onChange={(e) => setPixelId(e.target.value)}
        placeholder="Enter Facebook Pixel ID"
      />
      <button onClick={updatePixelId}>Update Pixel ID</button>
    </div>
  );
};
```

## Key Features

✅ **Dynamic Loading**: Pixel ID is fetched from your backend
✅ **Admin Control**: Can be updated through admin panel
✅ **Performance Optimized**: Uses Next.js Script component
✅ **Type Safe**: Full TypeScript support
✅ **Event Tracking**: Support for custom events
✅ **SSR Compatible**: Works with both Pages and App Router

## Usage Flow

1. Admin sets Facebook Pixel ID in admin panel
2. Frontend fetches Pixel ID from backend API
3. Facebook Pixel script loads with the correct ID
4. Tracks PageView and custom events automatically