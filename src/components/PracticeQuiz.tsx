import { useState } from 'react';
import { ContentRenderer } from './ContentRenderer';

interface PracticeProblem {
  question: string;
  answer: string;
  hint?: string;
}

interface PracticeQuizProps {
  problems: PracticeProblem[];
}

export function PracticeQuiz({ problems }: PracticeQuizProps) {
  if (!Array.isArray(problems) || problems.length === 0) {
    return null;
  }

  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggleProblem = (index: number) => {
    setExpanded(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <section className="mt-12 pt-12 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Zadania do przećwiczenia</h2>
      <div className="space-y-4">
        {problems.map((problem, index) => {
          const isOpen = !!expanded[index];
          return (
            <div
              key={index}
              className="border border-blue-100 rounded-lg shadow-sm bg-white overflow-hidden"
            >
              <div className="px-6 py-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-blue-600 uppercase tracking-wide mb-1">
                      Pytanie {index + 1}
                    </p>
                    <ContentRenderer content={problem.question} />
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleProblem(index)}
                    className="self-start text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
                  >
                    {isOpen ? 'Ukryj odpowiedź' : 'Pokaż odpowiedź'}
                  </button>
                </div>

                {isOpen && (
                  <div className="space-y-4 bg-blue-50 border border-blue-100 rounded-md px-4 py-3">
                    {problem.hint && (
                      <div>
                        <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
                          Podpowiedź
                        </p>
                        <ContentRenderer content={problem.hint} />
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
                        Odpowiedź
                      </p>
                      <ContentRenderer content={String(problem.answer)} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
