import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./ui.css";

declare function require(path: string): string;

function App() {
 const [output, setOutput] = React.useState(0);

  // const inputRef = React.useRef<HTMLInputElement>(null);

  const onGetStyles = () => {
    // parent.postMessage(
    //   { pluginMessage: { type: "create-rectangles", count } },
    //   "*"
    // );
  };

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  };

  return (
    <main>
      <header>
        <img src={require("./logo.svg")} />
        <h2>Get Astro Tokens via REST</h2>
      </header>
      <section>
        <textarea value={output} readOnly />
      </section>
      <footer>
        <button className="brand" onClick={onGetStyles}>
          Get Styles
        </button>
        <button onClick={onCancel}>Cancel</button>
      </footer>
    </main>
  );
}

const rootElement = document.getElementById("react-page");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<App />);
} else {
  console.error("Failed to find the root element with id 'react-page'.");
}
