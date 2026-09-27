interface WeakArea {
  key: string;
  label: string;
  averageScore: number;
  lowestScore: number;
  attemptCount: number;
  isWeak: boolean;
}

interface Props {
  weakAreas: WeakArea[];
}

export default function WeakAreasList({ weakAreas }: Props) {
  if (!weakAreas || weakAreas.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-2xl border border-border shadow-card mb-6">
      <h2 className="text-xl font-semibold text-text mb-2">Weak Areas</h2>
      <p className="text-sm text-text-secondary mb-4">
        Based on your past attempts, focus on these areas:
      </p>
      <div className="space-y-3">
        {weakAreas.slice(0, 5).map((area) => (
          <div key={area.key} className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-text">{area.label}</span>
              <span className="text-xs text-text-secondary ml-2">
                ({area.attemptCount} attempts)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-border rounded overflow-hidden">
                <div
                  className={`h-full ${
                    area.averageScore >= 7 ? 'bg-success' :
                    area.averageScore >= 5 ? 'bg-warning' :
                    'bg-error'
                  }`}
                  style={{ width: `${area.averageScore * 10}%` }}
                ></div>
              </div>
              <span className={`text-sm font-semibold ${
                area.averageScore >= 7 ? 'text-success' :
                area.averageScore >= 5 ? 'text-warning' :
                'text-error'
              }`}>
                {area.averageScore}/10
              </span>
            </div>
          </div>
        ))}
      </div>
      {weakAreas.filter((a) => a.isWeak).length > 0 && (
        <div className="mt-4 p-3 bg-warning bg-opacity-10 rounded-xl">
          <p className="text-sm text-warning font-medium">
            <strong>Focus areas:</strong> {weakAreas.filter((a) => a.isWeak).map((a) => a.label).join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}
