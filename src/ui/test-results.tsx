import React from "react";
import { TestResultsProps, TestResultType } from "./types";

const TestResult: React.FC<{ result: TestResultType }> = ({ result }) => {
  console.log('result', result)
  // Click on result name to select the node in Figma
  const handleClick = () => {
    console.log('result.node', result.node)
    parent.postMessage({ pluginMessage: { type: 'select-node', nodeId: result.node.id } }, '*');
  };
  return (
    <div className="result">
      <h3>{result.test}</h3>
      <p onClick={handleClick} >{result.name}</p>
      <p>{result.message}</p>
      <p>Pass: {(result.pass)? "true": "false"}</p>
    </div>
  );
}

const TestResults: React.FC<TestResultsProps> = ({ results }) => {
  return (
    <div className="results">
      {results.map((result, index) => (
        <TestResult key={index} result={result} />
      ))}
    </div>
  );
};

export {
  TestResult,
  TestResults
}
