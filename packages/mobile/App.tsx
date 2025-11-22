import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./src/store/store";
import RootNavigator from "./src/navigation/RootNavigator";
import SplashScreen from "./src/screens/SplashScreen";

export default function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    // Ensure splash screen is visible for at least 2.5 seconds
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={<SplashScreen />} persistor={persistor}>
        {isSplashVisible ? <SplashScreen /> : <RootNavigator />}
      </PersistGate>
    </Provider>
  );
}
