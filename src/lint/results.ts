import { LintingResult } from "../types/results";

let results: LintingResult[] = [];

const clearResults = () => {
  results = [];
  figma.ui.postMessage({ type: "clear-results" });
};

const addResult = (result: LintingResult) => {
  results.push(result);
};

const getResults = () => {
  // Remove results that are marked as ignored
  results = results.filter((result) => !result.ignore);
  return results;
};

export { clearResults, addResult, getResults };
