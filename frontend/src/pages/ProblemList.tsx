import { useEffect, useState } from 'react';
import { getProblems } from '../api/problems';
import ProblemCard from '../components/ProblemCard';
import type { Problem } from '../types';

export default function ProblemList() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProblems() {
      try {
        const data = await getProblems();
        setProblems(data);
      } catch (err) {
        setError('Failed to load problems');
      } finally {
        setLoading(false);
      }
    }
    fetchProblems();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-background-cream rounded w-1/4"></div>
          <div className="h-32 bg-background-cream rounded-2xl"></div>
          <div className="h-32 bg-background-cream rounded-2xl"></div>
          <div className="h-32 bg-background-cream rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-error bg-opacity-10 text-error p-4 rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-text mb-3">Problems</h1>
      <p className="text-lg text-text-secondary mb-10">
        Choose a problem to practice your LLD skills.
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {problems.map((problem) => (
          <ProblemCard key={problem.id} problem={problem} />
        ))}
      </div>
    </div>
  );
}
