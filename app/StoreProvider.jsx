"use client";
import store, { persistor } from "@/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";



export default function StoreProvider({ children }) {
  return (
    <Provider store={store}>

      <PersistGate persistor={persistor}>{children}</PersistGate>
    </Provider>
  );
}

