import React from 'react';
import { FilteredField, LintingResult } from "../types/results";

function getResultField(result: LintingResult, field: FilteredField) {
  return result[field];
}

interface SelectFilterProps {
  results: LintingResult[];
  setFilteredResults: (results: LintingResult[]) => void;
  filteredField: FilteredField;
  resultFieldToFilter: string;
  setResultFieldToFilter: (value: string) => void;
  otherFilters: Array<(value: string) => void>;
}

const SelectFilter: React.FC<SelectFilterProps> = ({
  results,
  setFilteredResults,
  filteredField,
  resultFieldToFilter,
  setResultFieldToFilter,
  otherFilters,
}) => {

  const setOtherFilters = (value: string) => {
    otherFilters.forEach(filter => filter(value));
  };

  let zeroOptionText;
  let sortedResultsForThisField;
  switch (filteredField) {
    case 'id':
      zeroOptionText = 'All Tests';
      sortedResultsForThisField = (results).sort((a: LintingResult, b: LintingResult) => a.id.localeCompare(b.id));
      break;
    case 'nodeType':
      zeroOptionText = 'All Types';
      sortedResultsForThisField = (results).sort((a: LintingResult, b: LintingResult) => a.nodeType.localeCompare(b.nodeType));
      break;
    case 'testType':
      zeroOptionText = 'Color and Typography';
      sortedResultsForThisField = (results).sort((a: LintingResult, b: LintingResult) => a.nodeType.localeCompare(b.nodeType));
      break;
    default:
      throw new Error(`Unsupported filter type: ${filteredField}`);
  }

  return (
    <select
      value={resultFieldToFilter}
      onChange={e => {
        const filteredFieldValue = e.target.value;
        if (filteredFieldValue === "") {
          setFilteredResults(results);
          setResultFieldToFilter("");
        } else {
          setFilteredResults(results.filter((result) => {
            return getResultField(result, filteredField) === filteredFieldValue
          }));
          setResultFieldToFilter(filteredFieldValue);
          setOtherFilters("");
        }
      }}
    >
      <option value="">{zeroOptionText}</option>
      {[...new Set(sortedResultsForThisField.map((result) => result[filteredField]))].map((optionValue, index) => (
        <option key={index} value={optionValue}>
          {optionValue}
        </option>
      ))}
    </select>
  );
};

export {
  SelectFilter
};
