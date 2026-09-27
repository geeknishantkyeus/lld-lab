import { lazy, Suspense } from 'react';

const Editor = lazy(() => import('@monaco-editor/react'));

interface Props {
  textSolution: string;
  codeSolution: string;
  onTextChange: (value: string) => void;
  onCodeChange: (value: string) => void;
}

export default function SolutionEditor({ textSolution, codeSolution, onTextChange, onCodeChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-text mb-2">
          Design Explanation (Text)
        </label>
        <textarea
          value={textSolution}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Explain your design: classes, responsibilities, relationships, patterns..."
          className="w-full h-40 p-4 border border-border rounded-lg font-mono text-sm focus:outline-none focus:border-primary resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-2">
          Code (Optional)
        </label>
        <div className="border border-border rounded-lg overflow-hidden">
          <Suspense fallback={<div className="h-[300px] bg-background-cream rounded-xl animate-pulse"></div>}>
            <Editor
              height="300px"
              defaultLanguage="java"
              value={codeSolution}
              onChange={(value) => onCodeChange(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
