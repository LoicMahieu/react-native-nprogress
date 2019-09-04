import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  container: {}
});

const clamp = (n: number, min: number, max: number) => {
  if (n < min) {
    return min;
  }
  if (n > max) {
    return max;
  }
  return n;
};

type IQueueFn = (next: () => void) => void;

const queue = (() => {
  const pending: IQueueFn[] = [];

  function next() {
    const fn = pending.shift();
    if (fn) {
      fn(next);
    }
  }

  return (fn: IQueueFn) => {
    pending.push(fn);
    if (pending.length === 1) {
      next();
    }
  };
})();

export const NProgress = ({
  enabled = false,
  minimum = 0.8,
  speed = 200,
  trickleSpeed = 200,
  height = 2,
  backgroundColor = "blue"
}) => {
  const status = useRef<number>();
  const [width, setWidth] = useState(0);
  const [animated] = useState(new Animated.Value(0));
  const progressStyle = {
    backgroundColor,
    height,
    transform: [
      {
        translateX: animated.interpolate({
          inputRange: [0, 1],
          outputRange: [width / -1, 0]
        })
      }
    ]
  };

  const start = () => {
    if (!status.current) {
      set(0);
    }

    const work = () => {
      setTimeout(() => {
        if (!status.current) {
          return;
        }
        inc();
        work();
      }, trickleSpeed);
    };

    work();
  };

  const stop = () => {
    if (!status.current) {
      return;
    }

    inc(0.3 + 0.5 * Math.random());
    set(1);
  };

  const set = (n: number) => {
    n = clamp(n, minimum, 1);
    status.current = n === 1 ? undefined : n;

    queue(next => {
      Animated.timing(animated, {
        toValue: status.current || 0,
        useNativeDriver: true
      }).start();

      if (n === 1) {
        Animated.timing(animated, {
          toValue: 1,
          useNativeDriver: true
        }).start(() => {
          animated.setValue(0);
        });
      } else {
        setTimeout(next, speed);
      }
    });
  };

  const inc = (amount?: number) => {
    let n = status.current;

    if (!n) {
      start();
    } else if (n <= 1) {
      if (typeof amount !== "number") {
        if (n >= 0 && n < 0.2) {
          amount = 0.1;
        } else if (n >= 0.2 && n < 0.5) {
          amount = 0.04;
        } else if (n >= 0.5 && n < 0.8) {
          amount = 0.02;
        } else if (n >= 0.8 && n < 0.99) {
          amount = 0.005;
        } else {
          amount = 0;
        }
      }

      n = clamp(n + amount, 0, 0.994);
      set(n);
    }
  };

  useEffect(() => {
    if (width) {
      if (enabled) {
        start();
      } else {
        stop();
      }
    }
  }, [enabled, width]);

  return (
    <View
      style={styles.container}
      onLayout={e => setWidth(e.nativeEvent.layout.width)}
    >
      <Animated.View style={progressStyle} />
    </View>
  );
};
