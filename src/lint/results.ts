import { LintingResult } from "./types";

let results: LintingResult[] = [];

const clearResults = () => {
  results = [];
  figma.ui.postMessage({ type: "clear-results" });
}

const addResult = (result: LintingResult) => {
  results.push(result);
  console.warn('result', result)
}
const getResults = () => {
  return results;
}

export { clearResults, addResult, getResults };
