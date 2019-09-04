# react-native-nprogress

[![npm version](https://badge.fury.io/js/react-native-nprogress.svg)](https://badge.fury.io/js/react-native-nprogress)

A nanoscopic progress bar. With realistic trickle animations to tell your users that something's happening!

Completely inspired by [NProgress](https://github.com/rstacruz/nprogress), all credit goes back to their maintainers and contributors.

## Installation

```bash
yarn add react-native-nprogress
```

## Usage

Here is the quick how-to example:

```jsx
import React, { useRef, useState } from "react";
import { NProgress } from "react-native-nprogress";

export const MyApp = () => {
  const [enabled, setEnabled] = useState(false);

  // Change `enabled` each second to mimic loader
  useEffect(() => {
    const int = setInterval(() => {
      setEnabled(e => !e);
    }, 1000);

    return () => {
      clearInterval(int);
    };
  }, []);

  return <NProgress enabled={enabled} />;
};
```
