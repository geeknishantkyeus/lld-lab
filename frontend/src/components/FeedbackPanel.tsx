import type { Feedback } from '../types';

interface Props {
  feedback: Feedback;
}

const dimensions = [
  { key: 'responsibilityClarity', label: 'Responsibility Clarity' },
  { key: 'solidCompliance', label: 'SOLID Compliance' },
  { key: 'couplingCohesion', label: 'Coupling & Cohesion' },
  { key: 'encapsulation', label: 'Encapsulation' },
  { key: 'patternAppropriateness', label: 'Pattern Appropriateness' },
  { key: 'extensibility', label: 'Extensibility' },
  { key: 'designTradeoffs', label: 'Design Trade-offs' },
];

export default function FeedbackPanel({ feedback }: Props) {
  const { deterministicResults, aiResults, cached } = feedback;

  return (
    <div className="space-y-6">
      {cached && (
        <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-lg text-sm">
          Cached feedback — this solution was evaluated before.
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl border border-border shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-text">
            Deterministic Checks
          </h2>
          <span className={`text-lg font-bold ${
            deterministicResults.score >= 70 ? 'text-success' :
            deterministicResults.score >= 40 ? 'text-warning' :
            'text-error'
          }`}>
            {deterministicResults.score}/100
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className={deterministicResults.checks.compilation ? 'text-success' : 'text-error'}>
              {deterministicResults.checks.compilation ? '✓' : '✗'}
            </span>
            <span className="text-text-secondary">Compilation</span>
          </div>

          <div>
            <p className="text-sm font-medium text-text mb-1">Classes Detected:</p>
            <div className="flex flex-wrap gap-2">
              {deterministicResults.checks.classNames.length > 0 ? (
                deterministicResults.checks.classNames.map((cls, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-success bg-opacity-10 text-success rounded">
                    {cls}
                  </span>
                ))
              ) : (
                <span className="text-sm text-text-secondary">None detected</span>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-text mb-1">Methods Detected:</p>
            <div className="flex flex-wrap gap-2">
              {deterministicResults.checks.methods.length > 0 ? (
                deterministicResults.checks.methods.map((m, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-primary bg-opacity-10 text-primary rounded">
                    {m}()
                  </span>
                ))
              ) : (
                <span className="text-sm text-text-secondary">None detected</span>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-text mb-1">Interfaces Detected:</p>
            <div className="flex flex-wrap gap-2">
              {deterministicResults.checks.interfaces.length > 0 ? (
                deterministicResults.checks.interfaces.map((iface, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-secondary bg-opacity-10 text-secondary rounded">
                    {iface}
                  </span>
                ))
              ) : (
                <span className="text-sm text-text-secondary">None detected</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-border shadow-card">
        <h2 className="text-xl font-semibold text-text mb-4">
          AI Feedback (Gemini)
        </h2>

        {aiResults.status === 'failed' && (
          <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-lg text-sm mb-4">
            AI evaluation failed. Showing deterministic results only.
          </div>
        )}

        {aiResults.status === 'pending' ? (
          <p className="text-text-secondary">
            AI evaluation pending or not available.
          </p>
        ) : (
          <div className="space-y-4">
            {aiResults.feedback && (
              <p className="text-text-secondary">
                {aiResults.feedback}
              </p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {dimensions.map(({ key, label }) => {
                const value = aiResults[key as keyof typeof aiResults];
                if (typeof value !== 'number') return null;
                return (
                  <div key={key}>
                    <p className="text-sm text-text-secondary">{label}</p>
                    <p className="text-lg font-semibold text-text">{value}/10</p>
                  </div>
                );
              })}
            </div>

            {aiResults.suggestions && aiResults.suggestions.length > 0 && (
              <div>
                <p className="text-sm font-medium text-text mb-2">Suggestions:</p>
                <ul className="space-y-1">
                  {aiResults.suggestions.map((s, i) => (
                    <li key={i} className="text-sm text-text-secondary flex items-start">
                      <span className="text-primary mr-2">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
