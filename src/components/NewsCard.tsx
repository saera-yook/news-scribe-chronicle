
import { ExternalLink, Calendar, User } from 'lucide-react';
import { NewsArticle } from '../types/news';
import { Card, CardContent, CardHeader } from './ui/card';

interface NewsCardProps {
  article: NewsArticle;
  onClick: () => void;
}

export function NewsCard({ article, onClick }: NewsCardProps) {
  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-l-4 border-l-newstapa-blue bg-gradient-to-r from-blue-50/50 to-white"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <h3 className="font-semibold text-lg text-gray-900 leading-tight line-clamp-2">
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
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {article.history.length}개 버전
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
