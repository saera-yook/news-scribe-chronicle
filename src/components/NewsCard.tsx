
import { ExternalLink, Calendar, User, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { NewsArticle } from '../types/news';
import { Card, CardContent, CardHeader } from './ui/card';
import { ChangeSummary } from './ChangeSummary';

interface NewsCardProps {
  article: NewsArticle;
  onClick: () => void;
}

export function NewsCard({ article, onClick }: NewsCardProps) {
  const [showSummary, setShowSummary] = useState(false);

  const handleCardClick = () => {
    setShowSummary(!showSummary);
  };

  const handleProceedToHistory = () => {
    setShowSummary(false);
    onClick();
  };

  return (
    <Card className="border-l-4 border-l-newstapa-blue bg-gradient-to-r from-blue-50/50 to-white">
      <CardHeader 
        className="pb-3 cursor-pointer transition-all duration-200 hover:bg-gray-50"
        onClick={handleCardClick}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 leading-tight line-clamp-2 mb-2">
              {article.title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{article.date}</span>
              </div>
              {article.source && (
                <div className="flex items-center gap-1">
                  <span className="text-newstapa-blue font-medium">{article.source}</span>
                </div>
              )}
              {article.reporter && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{article.reporter}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {article.history.length}개 버전
            </span>
            {showSummary ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-gray-700 text-sm leading-relaxed line-clamp-3 mb-3">
          {article.desc}
        </p>
        <div className="flex items-center justify-between">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-newstapa-blue hover:text-newstapa-blue-light text-sm font-medium transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-3 w-3" />
            원문 보기
          </a>
        </div>

        {showSummary && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <ChangeSummary
              history={article.history}
              onProceed={handleProceedToHistory}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
