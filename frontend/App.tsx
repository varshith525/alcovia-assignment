import React, { useState } from "react";
import { View, Button } from "react-native";

import FocusScreen from "./src/screens/FocusScreen";
import SyllabusScreen from "./src/screens/SyllabusScreen";

export default function App() {
  const [screen, setScreen] =
    useState("focus");

  return (
    <View style={{ flex: 1 }}>
      <Button
        title="Focus Screen"
        onPress={() =>
          setScreen("focus")
        }
      />

      <Button
        title="Syllabus Screen"
        onPress={() =>
          setScreen("syllabus")
        }
      />

      {screen === "focus" ? (
        <FocusScreen />
      ) : (
        <SyllabusScreen />
      )}
    </View>
  );
}