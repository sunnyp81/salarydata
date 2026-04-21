import React, { useState, useMemo } from 'react';
import { calculateTakeHome, formatGBP, type StudentLoanPlan } from '../lib/ukTaxCalc';

interface Props {
  defaultSalary: number;
  jobTitle?: string;
  location?: string;
}

export default function TakeHomeCalculator({ defaultSalary, jobTitle, location }: Props) {
  const [salary, setSalary] = useState(defaultSalary);
  const [studentLoan, setStudentLoan] = useState<StudentLoanPlan>('none');
  const [pensionPercent, setPensionPercent] = useState(5);

  const result = useMemo(
    () => calculateTakeHome(salary, { studentLoan, pensionPercent, taxYear: '2024-25' }),
    [salary, studentLoan, pensionPercent]
  );

  const ctx = jobTitle && location ? `${jobTitle} in ${location}` : jobTitle ?? 'UK';

  return (
    <div
      style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        padding: '1.5rem',
        margin: '1.5rem 0',
      }}
    >
      <h3 style={{ marginTop: 0, fontSize: '1.2rem' }}>Take-home pay calculator — {ctx}</h3>
      <p style={{ fontSize: '.85rem', color: '#475569', margin: '0 0 1rem' }}>
        Tax year 2024/25 · England, Wales, Northern Ireland
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <label style={{ display: 'block' }}>
          <span style={{ display: 'block', fontSize: '.85rem', color: '#475569', marginBottom: '.35rem' }}>Gross annual salary</span>
          <input
            type="number"
            value={salary}
            step={1000}
            min={0}
            max={500000}
            onChange={(e) => setSalary(Number(e.target.value) || 0)}
            style={{ width: '100%', padding: '.6rem .75rem', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: '1rem' }}
          />
        </label>

        <label style={{ display: 'block' }}>
          <span style={{ display: 'block', fontSize: '.85rem', color: '#475569', marginBottom: '.35rem' }}>Student loan plan</span>
          <select
            value={studentLoan}
            onChange={(e) => setStudentLoan(e.target.value as StudentLoanPlan)}
            style={{ width: '100%', padding: '.6rem .75rem', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: '1rem', background: '#fff' }}
          >
            <option value="none">None</option>
            <option value="plan1">Plan 1</option>
            <option value="plan2">Plan 2</option>
            <option value="plan4">Plan 4 (Scotland)</option>
            <option value="plan5">Plan 5</option>
            <option value="postgrad">Postgraduate</option>
          </select>
        </label>

        <label style={{ display: 'block' }}>
          <span style={{ display: 'block', fontSize: '.85rem', color: '#475569', marginBottom: '.35rem' }}>
            Pension contribution: {pensionPercent}%
          </span>
          <input
            type="range"
            min={0}
            max={25}
            value={pensionPercent}
            onChange={(e) => setPensionPercent(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </label>
      </div>

      <div
        style={{
          marginTop: '1.25rem',
          padding: '1rem 1.25rem',
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '.75rem', marginBottom: '.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '2rem', fontWeight: 800, color: '#0369a1' }}>{formatGBP(result.netMonthly)}</span>
          <span style={{ color: '#475569', fontSize: '.95rem' }}>take-home per month</span>
        </div>
        <p style={{ margin: '0 0 1rem', color: '#475569', fontSize: '.9rem' }}>
          {formatGBP(result.netAnnual)} per year · {formatGBP(result.netWeekly)} per week ·
          Effective rate {(result.effectiveTaxRate * 100).toFixed(1)}%
        </p>

        <table style={{ width: '100%', fontSize: '.9rem' }}>
          <tbody>
            <tr><td>Gross salary</td><td style={{ textAlign: 'right' }}>{formatGBP(result.grossAnnual)}</td></tr>
            {result.pensionContribution > 0 && (
              <tr><td>Pension ({pensionPercent}%)</td><td style={{ textAlign: 'right' }}>−{formatGBP(result.pensionContribution)}</td></tr>
            )}
            <tr><td>Income tax</td><td style={{ textAlign: 'right' }}>−{formatGBP(result.incomeTax)}</td></tr>
            <tr><td>National Insurance</td><td style={{ textAlign: 'right' }}>−{formatGBP(result.nationalInsurance)}</td></tr>
            {result.studentLoanRepayment > 0 && (
              <tr><td>Student loan</td><td style={{ textAlign: 'right' }}>−{formatGBP(result.studentLoanRepayment)}</td></tr>
            )}
            <tr style={{ fontWeight: 700, borderTop: '2px solid #0f172a' }}>
              <td>Net take-home</td><td style={{ textAlign: 'right', color: '#15803d' }}>{formatGBP(result.netAnnual)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
