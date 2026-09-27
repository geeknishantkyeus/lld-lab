import { Link } from 'react-router-dom';
import DifficultyBadge from './DifficultyBadge';
import type { Problem } from '../types';

interface Props {
  problem: Problem;
}

export default function ProblemCard({ problem }: Props) {
  return (
    <Link
      to={`/problems/${problem.id}`}
      className="block bg-white p-6 rounded-2xl border border-border shadow-card hover:shadow-card-hover hover:border-primary transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-text">
          {problem.title}
        </h3>
        <DifficultyBadge difficulty={problem.difficulty} />
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
