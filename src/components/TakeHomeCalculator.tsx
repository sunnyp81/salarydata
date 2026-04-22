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

  const ctx = jobTitle && location ? `${jobTitle}, ${location}` : jobTitle ?? 'UK';

  return (
    <div
      style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--rule)',
        borderTop: '3px solid var(--ink-1)',
        borderRadius: 'var(--r-md)',
        padding: '1.75rem',
        margin: '2rem 0',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div style={{ marginBottom: '1.25rem' }}>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '.72rem', color: 'var(--ink-3)', fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 .35rem',
        }}>Take-home pay calculator · 2024/25</p>
        <h3 style={{
          margin: 0, fontSize: '1.35rem',
          fontFamily: 'var(--font-display)', fontVariationSettings: '"opsz" 96',
          fontWeight: 600, letterSpacing: '-.015em', color: 'var(--ink-1)',
        }}>{ctx}</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.1rem' }}>
        <label style={{ display: 'block' }}>
          <span style={fieldLabelStyle}>Gross annual salary</span>
          <input
            type="number"
            value={salary}
            step={1000}
            min={0}
            max={500000}
            onChange={(e) => setSalary(Number(e.target.value) || 0)}
            style={inputStyle}
          />
        </label>

        <label style={{ display: 'block' }}>
          <span style={fieldLabelStyle}>Student loan plan</span>
          <select
            value={studentLoan}
            onChange={(e) => setStudentLoan(e.target.value as StudentLoanPlan)}
            style={{ ...inputStyle, background: 'var(--surface-1)' }}
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
          <span style={fieldLabelStyle}>
            Pension contribution: <strong style={{ color: 'var(--ink-1)' }}>{pensionPercent}%</strong>
          </span>
          <input
            type="range"
            min={0}
            max={25}
            value={pensionPercent}
            onChange={(e) => setPensionPercent(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent)', marginTop: '.6rem' }}
          />
        </label>
      </div>

      <div
        style={{
          marginTop: '1.5rem',
          padding: '1.25rem 1.5rem',
          background: 'var(--surface-2)',
          border: '1px solid var(--rule)',
          borderRadius: 'var(--r-md)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '.75rem', marginBottom: '.5rem', flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontVariationSettings: '"opsz" 144',
            fontSize: 'clamp(2rem, 5vw, 2.75rem)', fontWeight: 700, color: 'var(--ink-1)',
            letterSpacing: '-.03em', lineHeight: 1, fontVariantNumeric: 'tabular-nums',
          }}>{formatGBP(result.netMonthly)}</span>
          <span style={{ color: 'var(--ink-3)', fontSize: '.9rem' }}>take-home per month</span>
        </div>
        <p style={{ margin: '0 0 1rem', color: 'var(--ink-3)', fontSize: '.88rem', fontVariantNumeric: 'tabular-nums' }}>
          {formatGBP(result.netAnnual)}/yr · {formatGBP(result.netWeekly)}/wk · effective rate {(result.effectiveTaxRate * 100).toFixed(1)}%
        </p>

        <table style={{ width: '100%', fontSize: '.9rem', fontVariantNumeric: 'tabular-nums', borderCollapse: 'collapse' }}>
          <tbody>
            <tr style={rowStyle}><td style={tdLabel}>Gross salary</td><td style={tdValue}>{formatGBP(result.grossAnnual)}</td></tr>
            {result.pensionContribution > 0 && (
              <tr style={rowStyle}><td style={tdLabel}>Pension ({pensionPercent}%)</td><td style={tdValue}>−{formatGBP(result.pensionContribution)}</td></tr>
            )}
            <tr style={rowStyle}><td style={tdLabel}>Income tax</td><td style={tdValue}>−{formatGBP(result.incomeTax)}</td></tr>
            <tr style={rowStyle}><td style={tdLabel}>National Insurance</td><td style={tdValue}>−{formatGBP(result.nationalInsurance)}</td></tr>
            {result.studentLoanRepayment > 0 && (
              <tr style={rowStyle}><td style={tdLabel}>Student loan</td><td style={tdValue}>−{formatGBP(result.studentLoanRepayment)}</td></tr>
            )}
            <tr style={{ fontWeight: 700, borderTop: '2px solid var(--ink-1)' }}>
              <td style={{ ...tdLabel, color: 'var(--ink-1)', fontWeight: 600, paddingTop: '.6rem' }}>Net take-home</td>
              <td style={{ ...tdValue, color: 'var(--positive)', fontWeight: 700, paddingTop: '.6rem' }}>{formatGBP(result.netAnnual)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

const fieldLabelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-body)',
  fontSize: '.78rem',
  color: 'var(--ink-3)',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '.05em',
  marginBottom: '.45rem',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '.65rem .85rem',
  border: '1px solid var(--rule-strong)',
  borderRadius: 'var(--r-sm)',
  fontSize: '1rem',
  fontFamily: 'inherit',
  fontVariantNumeric: 'tabular-nums',
  color: 'var(--ink-1)',
  background: 'var(--surface-1)',
};

const rowStyle: React.CSSProperties = {};
const tdLabel: React.CSSProperties = { padding: '.4rem 0', color: 'var(--ink-2)' };
const tdValue: React.CSSProperties = { padding: '.4rem 0', textAlign: 'right', color: 'var(--ink-1)' };
