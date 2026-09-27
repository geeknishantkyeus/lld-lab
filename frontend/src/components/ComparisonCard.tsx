import type { Attempt } from '../types';

interface ComparisonData {
  attempt1: Attempt & { feedback: any };
  attempt2: Attempt & { feedback: any };
}

interface Props {
  comparison: ComparisonData;
  onClose: () => void;
}

export default function ComparisonCard({ comparison, onClose }: Props) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-border shadow-card mb-6">
      <h2 className="text-xl font-semibold text-text mb-4">Comparison</h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium text-text mb-2">Attempt #{comparison.attempt1.id}</h3>
          <p className="text-sm text-text-secondary mb-1">
            Date: {new Date(comparison.attempt1.createdAt).toLocaleString()}
          </p>
          <p className="text-sm text-text-secondary mb-1">
            Score: <span className="font-semibold">{comparison.attempt1.feedback?.deterministicResults?.score || 0}/100</span>
          </p>
          <p className="text-sm text-text-secondary">Status: {comparison.attempt1.status}</p>
        </div>
        <div>
          <h3 className="font-medium text-text mb-2">Attempt #{comparison.attempt2.id}</h3>
          <p className="text-sm text-text-secondary mb-1">
            Date: {new Date(comparison.attempt2.createdAt).toLocaleString()}
          </p>
          <p className="text-sm text-text-secondary mb-1">
            Score: <span className="font-semibold">{comparison.attempt2.feedback?.deterministicResults?.score || 0}/100</span>
          </p>
          <p className="text-sm text-text-secondary">Status: {comparison.attempt2.status}</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="mt-4 text-sm text-primary hover:underline font-medium"
      >
        Close Comparison
      </button>
    </div>
  );
}
