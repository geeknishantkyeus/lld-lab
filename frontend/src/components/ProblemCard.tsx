import { Link } from 'react-router-dom';
import type { Problem } from '../types';

interface Props {
  problem: Problem;
}

export default function ProblemCard({ problem }: Props) {
  const difficultyColor = 
    problem.difficulty === 'Easy' ? 'bg-success bg-opacity-10 text-success' :
    problem.difficulty === 'Medium' ? 'bg-warning bg-opacity-10 text-warning' :
    'bg-error bg-opacity-10 text-error';

  return (
    <Link
      to={`/problems/${problem.id}`}
      className="block bg-white p-6 rounded-2xl border border-border shadow-card hover:shadow-card-hover hover:border-primary transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-text">
          {problem.title}
        </h3>
        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${difficultyColor}`}>
          {problem.difficulty}
        </span>
      </div>
      <p className="text-text-secondary mb-6 leading-relaxed">
        {problem.description}
      </p>
      <div className="flex items-center text-primary font-semibold">
        Start Attempt <span className="ml-2">→</span>
      </div>
    </Link>
  );
}
