type TestResultType = {
  test: string;
  name: string;
  message: string;
  pass: boolean;
  node: { id: string };
};

type TestResultsProps = {
  results: TestResultType[];
};

export {
  TestResultType,
  TestResultsProps
}
