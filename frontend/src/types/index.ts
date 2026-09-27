export interface Problem {
  id: number;
  title: string;
  description: string;
  requirements: string[];
  difficulty: string;
  courseLink: string;
  relatedModule: string;
  createdAt: string;
}

export interface Attempt {
  id: number;
  userId: number;
  problemId: number;
  submission: string;
  status: 'PENDING' | 'EVALUATING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
}

export interface DeterministicResults {
  checks: {
    compilation: boolean;
    classNames: string[];
    methods: string[];
    interfaces: string[];
  };
  score: number;
}

export interface AIResults {
  status: string;
  feedback: string;
  responsibilityClarity?: number;
  solidCompliance?: number;
  couplingCohesion?: number;
  encapsulation?: number;
  patternAppropriateness?: number;
  extensibility?: number;
  designTradeoffs?: number;
  suggestions?: string[];
}

export interface Feedback {
  id: number;
  attemptId: number;
  deterministicResults: DeterministicResults;
  aiResults: AIResults;
  cached: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
