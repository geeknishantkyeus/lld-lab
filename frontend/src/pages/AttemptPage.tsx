import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { getProblem } from '../api/problems';
import { createAttempt, getAttemptStatus } from '../api/attempts';
import SolutionEditor from '../components/SolutionEditor';
import type { Problem } from '../types';

export default function AttemptPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const problemId = id === 'new' ? Number(searchParams.get('problemId')) : Number(id);

  const [problem, setProblem] = useState<Problem | null>(null);
  const [textSolution, setTextSolution] = useState('');
  const [codeSolution, setCodeSolution] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProblem() {
      const data = await getProblem(problemId);
      if (data) setProblem(data);
      else setError('Problem not found');
    }
    fetchProblem();
  }, [problemId]);

  async function handleSubmit() {
    if (!textSolution.trim() && !codeSolution.trim()) {
      setError('Please provide a solution');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const submission = `TEXT:\n${textSolution}\n\nCODE:\n${codeSolution}`;
      const attempt = await createAttempt(problemId, submission);
      if (!attempt) throw new Error('Failed to create attempt');

      setStatus('PENDING');

      const interval = setInterval(async () => {
        const statusData = await getAttemptStatus(attempt.id);
        if (statusData) {
          setStatus(statusData.status);
          if (statusData.status === 'COMPLETED' || statusData.status === 'FAILED') {
            clearInterval(interval);
            setTimeout(() => {
              navigate(`/attempts/${attempt.id}/feedback`);
            }, 1000);
          }
        }
      }, 2000);
    } catch (err) {
      setError('Failed to submit attempt');
      setSubmitting(false);
    }
  }

  if (!problem) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-background-cream rounded w-1/3"></div>
          <div className="h-32 bg-background-cream rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <Link to={`/problems/${problem.id}`} className="text-primary hover:underline mb-4 inline-block font-medium">
        ← Back to Problem
      </Link>

      <h1 className="text-4xl font-bold text-text mb-2">
        {problem.title}
      </h1>
      <p className="text-text-secondary mb-6">
        Submit your solution below.
      </p>

      {problem.courseLink && (
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

      <SolutionEditor
        textSolution={textSolution}
        codeSolution={codeSolution}
        onTextChange={setTextSolution}
        onCodeChange={setCodeSolution}
      />

      {error && (
        <div className="bg-error bg-opacity-10 text-error p-4 rounded-xl mt-4">
          {error}
        </div>
      )}

      {status && (
        <div className="bg-primary bg-opacity-10 text-primary p-4 rounded-xl mt-4 font-medium">
          Status: {status}
          {status === 'PENDING' && ' — Waiting for evaluation...'}
          {status === 'EVALUATING' && ' — Evaluating your solution...'}
          {status === 'COMPLETED' && ' — Redirecting to feedback...'}
          {status === 'FAILED' && ' — Evaluation failed. Redirecting...'}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="mt-6 bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-dark transition shadow-button disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Submitting...' : 'Submit Solution'}
      </button>
    </div>
  );
}
