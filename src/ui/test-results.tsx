import React from "react";
import { TestResultsProps } from "../types/ui";
import { LintingResult } from "../types/results";

const TestResult: React.FC<{ result: LintingResult }> = ({ result }) => {
  // Click on result name to select the node in Figma
  const handleClick = () => {
    parent.postMessage({ pluginMessage: { type: 'select-node', nodeId: result.node.id } }, '*');
  };

  const resultClass = result.pass ? "pass" : "fail";
  return (
    <div className={`test-result ${resultClass}`} onClick={handleClick}>
      <div className={`result-test ${resultClass}`}>{(result.pass)? "PASS": "FAIL"}</div>
      <div className="result-test-name">{result.test}</div>
      <div className="result-node">{result.name}</div>
      <div className="result-message">{result.message}</div>
      <div className="result-id">{result.id}</div>
    </div>
  );
}

const TestResults: React.FC<TestResultsProps> = ({ results }) => {
  return (
    <div className="test-results">
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
