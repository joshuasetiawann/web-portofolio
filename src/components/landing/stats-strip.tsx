// Stats strip: bordered auto-fit row of label / big tabular value / note.
// Values are derived from the real data layer in page.tsx — never hardcoded.
export interface LandingStat {
  label: string;
  value: string;
  note: string;
}

export function StatsStrip({ stats }: { stats: LandingStat[] }) {
  return (
    <section className="relative" aria-label="Key numbers">
      <div className="l-container">
        <dl className="l-stats">
          {stats.map((stat) => (
            <div key={stat.label} className="l-stat">
              <dt className="l-stat-label">{stat.label}</dt>
              <dd className="l-stat-value">{stat.value}</dd>
              <dd className="l-stat-note">{stat.note}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
