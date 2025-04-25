# Layout System

## Overview

This directory contains layout components that provide a consistent structure for all pages in the Kaari Web app. 
The layout system handles header selection based on the current route, ensuring a consistent user experience.

## Components

### MainLayout

`MainLayout` is the primary layout component that wraps all pages in the application. It automatically selects 
the appropriate header based on the current route and user state.

#### Features:

- **Route-based Header Selection**: Displays the correct header variant based on the current route
- **User Role Awareness**: Adapts header content based on user role (advertiser, client, admin)
- **Authentication State**: Handles authenticated and non-authenticated states
- **Conditional Footer**: Shows or hides the footer based on the page type

## Usage

In `App.tsx`, we wrap all routes with the `MainLayout` component:

```tsx
import { MainLayout } from './layouts';

function App() {
  // ...routes definition...
  
  return (
    <Router>
      <MainLayout>
        {routes}
      </MainLayout>
    </Router>
  );
}
```

Individual page components no longer need to include headers or footers, as these are handled automatically by the layout system.

## Header Configuration

The header configuration is centralized in the `getHeaderConfig` function within `MainLayout.tsx`. This function:

1. Determines the current user type
2. Matches the current route to the appropriate header configuration
3. Returns config for `UnifiedHeader` or null if no header should be shown

## Best Practices

- **Never add headers directly to page components** - use the layout system instead
- When creating new pages, no header/footer code is needed - just add the route to `App.tsx`
- To modify header behavior for a specific route, update the `getHeaderConfig` function in `MainLayout.tsx` 