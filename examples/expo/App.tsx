import React, { useState, useEffect } from "react";
import { NProgress } from "react-native-nprogress";
import { View } from "react-native";

export default function App() {
  const [enabled, setEnabled] = useState(false);

  // Change `enabled` each second to mimic loader
  useEffect(() => {
    const int = setInterval(() => {
      setEnabled(e => !e);
    }, 2000);

    return () => {
      clearInterval(int);
    };
  }, []);

  return (
    <View
      style={{
        marginVertical: "auto",
        flex: 1,
        flexGrow: 1,
        justifyContent: "center"
      }}
    >
      <NProgress enabled={enabled} />
    </View>
  );
}
