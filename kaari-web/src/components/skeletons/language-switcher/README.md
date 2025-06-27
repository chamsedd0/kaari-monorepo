# Language Switcher Components

This directory contains language switcher components for the Kaari application.

## Components

### 1. LanguageSwitcher

The standard language switcher component for desktop and larger screens.

```jsx
import { LanguageSwitcher } from '../../components/skeletons/language-switcher';

// Usage
<LanguageSwitcher />
```

### 2. MobileLanguageSwitcher

An optimized language switcher component for mobile screens with a more compact design.

```jsx
import { MobileLanguageSwitcher } from '../../components/skeletons/language-switcher';

// Basic usage
<MobileLanguageSwitcher />

// With dark mode (changes the color scheme)
<MobileLanguageSwitcher darkMode={true} />

// For light backgrounds (applies purple-themed style)
<MobileLanguageSwitcher lightBackground={true} />

// With custom class name
<MobileLanguageSwitcher className="my-custom-class" />
```

## Props

### LanguageSwitcher Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | string | undefined | Optional CSS class name to apply to the component |

### MobileLanguageSwitcher Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | string | undefined | Optional CSS class name to apply to the component |
| darkMode | boolean | false | When true, applies a darker color scheme |
| lightBackground | boolean | false | When true, applies a purple-themed style for light backgrounds |

## Responsive Usage

For responsive applications, you can conditionally render the appropriate component:

```jsx
import { useState, useEffect } from 'react';
import { LanguageSwitcher, MobileLanguageSwitcher } from '../../components/skeletons/language-switcher';

const MyComponent = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  return (
    <div>
      {isMobile ? <MobileLanguageSwitcher /> : <LanguageSwitcher />}
    </div>
  );
};
``` 