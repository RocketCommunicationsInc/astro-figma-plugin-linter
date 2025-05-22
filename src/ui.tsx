import React from "react";
import * as ReactDOM from "react-dom/client";
import { LinterUi } from "./ui/ui";

function App() {
  return <LinterUi />;
}

const rootElement = document.getElementById("react-page");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<App />);
} else {
  console.error("Failed to find the root element with id 'react-page'.");
}
