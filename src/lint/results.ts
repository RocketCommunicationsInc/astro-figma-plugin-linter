import { LintingResult } from "./types";

let results: LintingResult[] = [];

const clearResults = () => {
  results = [];
  figma.ui.postMessage({ type: "clear-results" });
}

const addResult = (result: LintingResult) => {
  results.push(result);
  figma.ui.postMessage({ type: "add-result", result });
}
const getResults = () => {
  return results;
}

export { clearResults, addResult, getResults };
