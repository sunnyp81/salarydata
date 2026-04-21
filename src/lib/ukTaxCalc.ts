// UK take-home pay calculator — 2024/25 tax year.
// England, Wales, NI rates. (Scottish rates differ — see notes at bottom.)

export type StudentLoanPlan = 'none' | 'plan1' | 'plan2' | 'plan4' | 'plan5' | 'postgrad';

export interface TakeHomeOptions {
  studentLoan: StudentLoanPlan;
  pensionPercent: number; // salary-sacrifice style: reduces taxable income
  taxYear: '2024-25';
}

export interface TakeHomeResult {
  grossAnnual: number;
  pensionContribution: number;
  taxableIncome: number;
  personalAllowance: number;
  incomeTax: number;
  nationalInsurance: number;
  studentLoanRepayment: number;
  netAnnual: number;
  netMonthly: number;
  netWeekly: number;
  effectiveTaxRate: number;
  marginalRate: number;
}

// 2024/25 bands (England, Wales, NI)
const BANDS_2024_25 = {
  personalAllowance: 12570,
  paTaperThreshold: 100000, // PA reduces by £1 for every £2 over £100k
  basicRateUpper: 50270,
  basicRate: 0.20,
  higherRateUpper: 125140,
  higherRate: 0.40,
  additionalRate: 0.45,
  // NI Class 1 employee (Apr 2024 rates)
  niPrimaryThreshold: 12570,
  niUpperEarningsLimit: 50270,
  niMainRate: 0.08,
  niUpperRate: 0.02,
};

// Student loan thresholds (Apr 2024)
const STUDENT_LOAN_2024_25: Record<StudentLoanPlan, { threshold: number; rate: number }> = {
  none: { threshold: 0, rate: 0 },
  plan1: { threshold: 24990, rate: 0.09 },
  plan2: { threshold: 27295, rate: 0.09 },
  plan4: { threshold: 31395, rate: 0.09 }, // Scottish Plan 4
  plan5: { threshold: 25000, rate: 0.09 }, // Plan 5 (Aug 2023 onward)
  postgrad: { threshold: 21000, rate: 0.06 },
};

function calculatePersonalAllowance(gross: number): number {
  const { personalAllowance, paTaperThreshold } = BANDS_2024_25;
  if (gross <= paTaperThreshold) return personalAllowance;
  const taper = (gross - paTaperThreshold) / 2;
  return Math.max(0, personalAllowance - taper);
}

function calculateIncomeTax(taxable: number, personalAllowance: number): number {
  const { basicRateUpper, basicRate, higherRateUpper, higherRate, additionalRate } = BANDS_2024_25;
  if (taxable <= personalAllowance) return 0;

  let tax = 0;
  const basicBand = Math.max(0, basicRateUpper - personalAllowance);
  const higherBand = Math.max(0, higherRateUpper - basicRateUpper);

  const afterPA = taxable - personalAllowance;

  const inBasic = Math.min(afterPA, basicBand);
  tax += inBasic * basicRate;

  const afterBasic = Math.max(0, afterPA - basicBand);
  const inHigher = Math.min(afterBasic, higherBand);
  tax += inHigher * higherRate;

  const afterHigher = Math.max(0, afterBasic - higherBand);
  tax += afterHigher * additionalRate;

  return tax;
}

function calculateNI(gross: number): number {
  const { niPrimaryThreshold, niUpperEarningsLimit, niMainRate, niUpperRate } = BANDS_2024_25;
  if (gross <= niPrimaryThreshold) return 0;
  const mainBand = Math.min(gross, niUpperEarningsLimit) - niPrimaryThreshold;
  const upperBand = Math.max(0, gross - niUpperEarningsLimit);
  return mainBand * niMainRate + upperBand * niUpperRate;
}

function calculateStudentLoan(gross: number, plan: StudentLoanPlan): number {
  const { threshold, rate } = STUDENT_LOAN_2024_25[plan];
  if (plan === 'none' || gross <= threshold) return 0;
  return (gross - threshold) * rate;
}

function marginalRateAt(taxable: number): number {
  // Combined marginal rate: income tax + NI (ignoring student loan)
  const { basicRateUpper, higherRateUpper, niUpperEarningsLimit, paTaperThreshold } = BANDS_2024_25;
  if (taxable > paTaperThreshold && taxable <= higherRateUpper) return 0.62; // 40% + 2% NI + PA taper = effective 60%+
  if (taxable > higherRateUpper) return 0.47; // 45% + 2% NI
  if (taxable > basicRateUpper) return 0.42; // 40% + 2% NI
  if (taxable > 12570 && taxable <= niUpperEarningsLimit) return 0.28; // 20% + 8% NI
  return 0;
}

export function calculateTakeHome(
  grossSalary: number,
  options: TakeHomeOptions = { studentLoan: 'none', pensionPercent: 0, taxYear: '2024-25' }
): TakeHomeResult {
  const gross = Math.max(0, grossSalary);
  const pensionContribution = gross * (options.pensionPercent / 100);
  const taxable = gross - pensionContribution;

  const personalAllowance = calculatePersonalAllowance(taxable);
  const incomeTax = calculateIncomeTax(taxable, personalAllowance);
  const nationalInsurance = calculateNI(taxable);
  const studentLoanRepayment = calculateStudentLoan(taxable, options.studentLoan);

  const netAnnual = taxable - incomeTax - nationalInsurance - studentLoanRepayment;
  const netMonthly = netAnnual / 12;
  const netWeekly = netAnnual / 52;
  const totalDeductions = incomeTax + nationalInsurance + studentLoanRepayment + pensionContribution;
  const effectiveTaxRate = gross > 0 ? totalDeductions / gross : 0;
  const marginalRate = marginalRateAt(taxable);

  return {
    grossAnnual: gross,
    pensionContribution: Math.round(pensionContribution),
    taxableIncome: Math.round(taxable),
    personalAllowance: Math.round(personalAllowance),
    incomeTax: Math.round(incomeTax),
    nationalInsurance: Math.round(nationalInsurance),
    studentLoanRepayment: Math.round(studentLoanRepayment),
    netAnnual: Math.round(netAnnual),
    netMonthly: Math.round(netMonthly),
    netWeekly: Math.round(netWeekly),
    effectiveTaxRate: Math.round(effectiveTaxRate * 10000) / 10000,
    marginalRate,
  };
}

export function formatGBP(n: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatGBPPrecise(n: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 2,
  }).format(n);
}
