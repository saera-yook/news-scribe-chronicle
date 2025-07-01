
import { Clock } from 'lucide-react';
import { NewsVersion } from '../types/news';

interface TimelineProps {
  history: NewsVersion[];
  selectedA: number;
  selectedB: number;
  onSelectVersion: (index: number) => void;
}

export function Timeline({ history, selectedA, selectedB, onSelectVersion }: TimelineProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
        <Clock className="h-4 w-4" />
        수정 이력
      </h3>
      
      <div className="space-y-2">
        {history.map((version, index) => (
          <div
            key={index}
            className={`
              flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200
              ${(index === selectedA || index === selectedB)
                ? 'bg-newstapa-blue text-white shadow-md'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }
            `}
            onClick={() => onSelectVersion(index)}
          >
            <div className={`
              w-3 h-3 rounded-full flex-shrink-0
              ${(index === selectedA || index === selectedB)
                ? 'bg-white'
                : 'bg-newstapa-blue'
              }
            `} />
            
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                {version.timestamp}
              </div>
              {version.changeType && (
                <div className={`
                  text-xs mt-1 px-2 py-0.5 rounded-full inline-block
                  ${(index === selectedA || index === selectedB)
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
          </div>
        ))}
      </div>
    </div>
  );
}
