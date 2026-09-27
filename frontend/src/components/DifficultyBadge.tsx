interface Props {
  difficulty: string;
}

export default function DifficultyBadge({ difficulty }: Props) {
  const colors =
    difficulty === 'Easy' ? 'bg-success bg-opacity-10 text-success' :
    difficulty === 'Medium' ? 'bg-warning bg-opacity-10 text-warning' :
    'bg-error bg-opacity-10 text-error';

  return (
    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${colors}`}>
      {difficulty}
    </span>
  );
}
