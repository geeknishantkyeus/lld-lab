interface ScorePoint {
  attemptId: number;
  score: number;
  date: string;
}

interface Props {
  scoreTrend: ScorePoint[];
}

export default function ScoreTrendChart({ scoreTrend }: Props) {
  if (!scoreTrend || scoreTrend.length === 0) return null;

  return (
    <div>
      <p className="text-sm font-medium text-text mb-3">Score Trend</p>
      <div className="flex items-end gap-2 h-32">
        {scoreTrend.map((point) => (
          <div key={point.attemptId} className="flex-1 flex flex-col items-center">
            <div
              className={`w-full rounded-t ${
                point.score >= 70 ? 'bg-success' :
                point.score >= 40 ? 'bg-warning' :
                'bg-error'
              }`}
              style={{ height: `${(point.score / 100) * 100}%`, minHeight: '4px' }}
              title={`Attempt #${point.attemptId}: ${point.score}/100`}
            ></div>
            <span className="text-xs text-text-secondary mt-1">#{point.attemptId}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
