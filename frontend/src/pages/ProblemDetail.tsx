import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProblem } from '../api/problems';
import DifficultyBadge from '../components/DifficultyBadge';
import type { Problem } from '../types';

export default function ProblemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProblem() {
      try {
        const data = await getProblem(Number(id));
        if (!data) {
          setError('Problem not found');
        } else {
          setProblem(data);
        }
      } catch (err) {
        setError('Failed to load problem');
      } finally {
        setLoading(false);
      }
    }
    fetchProblem();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-background-cream rounded w-1/3"></div>
          <div className="h-6 bg-background-cream rounded w-1/4"></div>
          <div className="h-32 bg-background-cream rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-error bg-opacity-10 text-error p-4 rounded-xl mb-4">
          {error || 'Problem not found'}
        </div>
        <Link to="/problems" className="text-primary hover:underline">
          ← Back to Problems
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <Link to="/problems" className="text-primary hover:underline mb-4 inline-block font-medium">
        ← Back to Problems
      </Link>

      <div className="flex items-start justify-between mb-4">
        <h1 className="text-4xl font-bold text-text">
          {problem.title}
        </h1>
        <DifficultyBadge difficulty={problem.difficulty} />
      </div>

      <p className="text-lg text-text-secondary mb-8">
        {problem.description}
      </p>

      <div className="bg-white p-6 rounded-2xl border border-border shadow-card mb-6">
        <h2 className="text-xl font-semibold text-text mb-4">
          Requirements
        </h2>
        <ul className="space-y-2">
          {problem.requirements.map((req, index) => (
            <li key={index} className="flex items-start text-text-secondary">
              <span className="text-primary mr-2">•</span>
              {req}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-border shadow-card mb-8">
        <h2 className="text-xl font-semibold text-text mb-4">
          Related Course
        </h2>
        <p className="text-text-secondary mb-3">
          {problem.relatedModule}
        </p>
        <a
          href={problem.courseLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          View Course →
        </a>
      </div>

      <button
        onClick={() => navigate(`/attempts/new?problemId=${problem.id}`)}
        className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-dark transition shadow-button"
      >
        Start Attempt
      </button>
    </div>
  );
}
