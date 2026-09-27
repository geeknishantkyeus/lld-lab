import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFeedback, retryAttempt, getAttempt } from '../api/attempts';
import { getProblem } from '../api/problems';
import FeedbackPanel from '../components/FeedbackPanel';
import type { Feedback, Problem } from '../types';

export default function FeedbackPage() {
  const { id } = useParams();
  const attemptId = Number(id);

  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    async function fetchFeedback() {
      try {
        const data = await getFeedback(attemptId);
        if (data) {
          setFeedback(data);
          const attempt = await getAttempt(attemptId);
          if (attempt) {
            const prob = await getProblem(attempt.problemId);
            if (prob) setProblem(prob);
          }
        } else {
          setError('Feedback not ready yet');
        }
      } catch (err) {
        setError('Failed to load feedback');
      } finally {
        setLoading(false);
      }
    }
    fetchFeedback();
  }, [attemptId]);

  async function handleRetry() {
    setRetrying(true);
    try {
      await retryAttempt(attemptId);
      window.location.reload();
    } catch (err) {
      setError('Retry failed');
      setRetrying(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-background-cream rounded w-1/3"></div>
          <div className="h-64 bg-background-cream rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error || !feedback) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-error bg-opacity-10 text-error p-4 rounded-xl mb-4">
          {error || 'Feedback not ready'}
        </div>
        <div className="flex gap-4 items-center">
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition shadow-button disabled:opacity-50"
          >
            {retrying ? 'Retrying...' : 'Retry Evaluation'}
          </button>
          <Link to="/problems" className="text-primary hover:underline font-medium">
            ← Back to Problems
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <Link to="/problems" className="text-primary hover:underline mb-4 inline-block font-medium">
        ← Back to Problems
      </Link>

      <h1 className="text-4xl font-bold text-text mb-2">Feedback</h1>
      <p className="text-text-secondary mb-6">
        Review your solution and improve.
      </p>

      {problem?.courseLink && (
        <div className="bg-white border border-border rounded-2xl p-6 mb-6 shadow-card">
          <p className="text-sm text-text-secondary mb-1">Related Course</p>
          <p className="font-medium text-text mb-2">{problem.relatedModule}</p>
          <a
            href={problem.courseLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline font-medium"
          >
            View Course →
          </a>
        </div>
      )}

      <FeedbackPanel feedback={feedback} />

      <div className="flex gap-4 mt-8">
        <Link
          to={`/attempts/new?problemId=${feedback.attemptId}`}
          className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition shadow-button"
        >
          Try Again
        </Link>
        <Link
          to="/history"
          className="bg-white border border-border text-text px-6 py-3 rounded-xl font-semibold hover:border-primary transition shadow-card"
        >
          View History
        </Link>
      </div>
    </div>
  );
}
