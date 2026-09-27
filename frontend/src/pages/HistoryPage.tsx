import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { compareAttempts } from '../api/attempts';
import { getWeakAreas, getProgress } from '../api/users';
import type { Attempt, ApiResponse } from '../types';

interface AttemptWithProblem extends Attempt {
  problemTitle?: string;
}

interface ComparisonData {
  attempt1: Attempt & { feedback: any };
  attempt2: Attempt & { feedback: any };
}

export default function HistoryPage() {
  const [attempts, setAttempts] = useState<AttemptWithProblem[]>([]);
  const [weakAreas, setWeakAreas] = useState<any[]>([]);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAttempts, setSelectedAttempts] = useState<number[]>([]);
  const [comparison, setComparison] = useState<ComparisonData | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await api.get<ApiResponse<AttemptWithProblem[]>>('/users/1/attempts');
        const data = res.data.data || [];
        setAttempts(data.reverse());
        const weakData = await getWeakAreas(1);
        if (weakData?.weakAreas) {
          setWeakAreas(weakData.weakAreas);
        }
        const progressData = await getProgress(1);
        if (progressData) {
          setProgress(progressData);
        }
      } catch (err) {
        setError('Failed to load history');
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  const toggleAttempt = (id: number) => {
    if (selectedAttempts.includes(id)) {
      setSelectedAttempts(selectedAttempts.filter((a) => a !== id));
    } else if (selectedAttempts.length < 2) {
      setSelectedAttempts([...selectedAttempts, id]);
    }
  };

  const handleCompare = async () => {
    if (selectedAttempts.length !== 2) return;
    const data = await compareAttempts(selectedAttempts[0], selectedAttempts[1]);
    setComparison(data);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-background-cream rounded w-1/3"></div>
          <div className="h-24 bg-background-cream rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-error bg-opacity-10 text-error p-4 rounded-xl">{error}</div>
      </div>
    );
  }

  if (attempts.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-text mb-4">History</h1>
        <div className="bg-white p-8 rounded-2xl border border-border shadow-card text-center">
          <p className="text-text-secondary mb-4">No attempts yet.</p>
          <Link to="/problems" className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition shadow-button">
            Start Practicing
          </Link>
        </div>
      </div>
    );
  }

  const statusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-success bg-opacity-10 text-success';
      case 'EVALUATING': return 'bg-warning bg-opacity-10 text-warning';
      case 'FAILED': return 'bg-error bg-opacity-10 text-error';
      default: return 'bg-primary bg-opacity-10 text-primary';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-text mb-2">History</h1>
      <p className="text-text-secondary mb-6">
        Your past attempts. Select 2 to compare.
      </p>

      {selectedAttempts.length === 2 && (
        <button
          onClick={handleCompare}
          className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition shadow-button mb-6"
        >
          Compare Selected
        </button>
      )}

      {comparison && (
        <div className="bg-white p-6 rounded-2xl border border-border shadow-card mb-6">
          <h2 className="text-xl font-semibold text-text mb-4">Comparison</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-text mb-2">Attempt #{comparison.attempt1.id}</h3>
              <p className="text-sm text-text-secondary mb-1">Date: {new Date(comparison.attempt1.createdAt).toLocaleString()}</p>
              <p className="text-sm text-text-secondary mb-1">Score: <span className="font-semibold">{comparison.attempt1.feedback?.deterministicResults?.score || 0}/100</span></p>
              <p className="text-sm text-text-secondary">Status: {comparison.attempt1.status}</p>
            </div>
            <div>
              <h3 className="font-medium text-text mb-2">Attempt #{comparison.attempt2.id}</h3>
              <p className="text-sm text-text-secondary mb-1">Date: {new Date(comparison.attempt2.createdAt).toLocaleString()}</p>
              <p className="text-sm text-text-secondary mb-1">Score: <span className="font-semibold">{comparison.attempt2.feedback?.deterministicResults?.score || 0}/100</span></p>
              <p className="text-sm text-text-secondary">Status: {comparison.attempt2.status}</p>
            </div>
          </div>
          <button
            onClick={() => setComparison(null)}
            className="mt-4 text-sm text-primary hover:underline font-medium"
          >
            Close Comparison
          </button>
        </div>
      )}

      {weakAreas.length > 0 && (
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
      )}

      {progress && progress.totalAttempts > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-border shadow-card mb-6">
          <h2 className="text-xl font-semibold text-text mb-4">Progress</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-sm text-text-secondary">Total Attempts</p>
              <p className="text-2xl font-bold text-text">{progress.totalAttempts}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Completed</p>
              <p className="text-2xl font-bold text-text">{progress.completedAttempts}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Average Score</p>
              <p className="text-2xl font-bold text-text">{progress.averageScore}/100</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Best Score</p>
              <p className="text-2xl font-bold text-text">{progress.bestScore}/100</p>
            </div>
          </div>

          {progress.improvement !== 0 && (
            <div className={`p-3 rounded-xl mb-6 ${
              progress.improvement > 0
                ? 'bg-success bg-opacity-10 text-success'
                : 'bg-error bg-opacity-10 text-error'
            }`}>
              <p className="text-sm font-medium">
                {progress.improvement > 0 ? '📈' : '📉'} Improvement: {progress.improvement > 0 ? '+' : ''}{progress.improvement} points
              </p>
            </div>
          )}

          {progress.scoreTrend.length > 0 && (
            <div>
              <p className="text-sm font-medium text-text mb-3">Score Trend</p>
              <div className="flex items-end gap-2 h-32">
                {progress.scoreTrend.map((point: any) => (
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
          )}
        </div>
      )}

      <div className="space-y-4">
        {attempts.map((attempt) => (
          <div key={attempt.id} className="bg-white p-6 rounded-2xl border border-border shadow-card hover:shadow-card-hover transition">
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                checked={selectedAttempts.includes(attempt.id)}
                onChange={() => toggleAttempt(attempt.id)}
                className="mt-1 w-5 h-5 cursor-pointer accent-primary"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-text">Attempt #{attempt.id}</h3>
                    <p className="text-sm text-text-secondary">{new Date(attempt.createdAt).toLocaleString()}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${statusColor(attempt.status)}`}>
                    {attempt.status}
                  </span>
                </div>
                <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                  {attempt.submission?.slice(0, 200)}...
                </p>
                <div className="flex gap-3">
                  <Link to={`/attempts/${attempt.id}/feedback`} className="text-sm text-primary hover:underline font-medium">
                    View Feedback →
                  </Link>
                  {attempt.status === 'FAILED' && (
                    <button
                      onClick={async () => {
                        await api.post(`/attempts/${attempt.id}/retry`);
                        window.location.reload();
                      }}
                      className="text-sm text-secondary hover:underline font-medium"
                    >
                      Retry
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Link to="/problems" className="text-primary hover:underline font-medium">← Back to Problems</Link>
      </div>
    </div>
  );
}
