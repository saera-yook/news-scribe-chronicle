
import { Clock } from 'lucide-react';
import { NewsVersion } from '../types/news.ts';

interface TimelineProps {
  history: NewsVersion[];
  selectedA: number;
  selectedB: number;
  onSelectVersion: (index: number) => void;
}

export function Timeline({ history, selectedA, selectedB, onSelectVersion }: TimelineProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-high-contrast flex items-center gap-2">
        <Clock className="h-4 w-4" aria-hidden="true" />
        수정 이력
      </h3>
      
      <div className="space-y-2" role="list" aria-label="뉴스 수정 이력">
        {history.map((version, index) => {
          const isSelected = index === selectedA || index === selectedB;
          
          return (
            <button
              key={index}
              className={`
                flex items-center gap-3 p-3 rounded-lg transition-all duration-200 w-full text-left min-h-12
                ${isSelected
                  ? 'bg-newstapa-blue text-white shadow-md'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
              `}
              onClick={() => onSelectVersion(index)}
              role="listitem"
              aria-pressed={isSelected}
              aria-label={`${version.timestamp} 수정 버전${isSelected ? ' 선택됨' : ''}`}
            >
              <div className={`
                w-3 h-3 rounded-full flex-shrink-0
                ${isSelected
                  ? 'bg-white'
                  : 'bg-newstapa-blue'
                }
              `} aria-hidden="true" />
              
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {version.timestamp}
                </div>
                {version.changeType && (
                  <div className={`
                    text-xs mt-1 px-2 py-0.5 rounded-full inline-block
                    ${isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-newstapa-blue/10 text-newstapa-blue'
                    }
                  `}>
                    {version.changeType === 'title' && '제목 수정'}
                    {version.changeType === 'content' && '내용 수정'}
                    {version.changeType === 'both' && '제목·내용 수정'}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
