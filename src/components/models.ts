export interface Variables {
  id: number,
  name: string;
  age: number;
  retirementAge: number;
  annualIncome: number;
  neededIncomePercent: number,
  annualSavingsPercent: number,
  annualReturnPercent: number
}

export interface TableData {
  year: number;
  invested: number;
  accYield: number;
  yearlyYield: number;
  amountSaved: number
}

export interface ChartOptionSeries {
  name: string;
  data: Array<number>;
}
