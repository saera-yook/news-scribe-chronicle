import { ExternalLink, Calendar, User, AlertTriangle, FileText, Pencil } from 'lucide-react';
import { NewsArticle } from '../types/news.ts';
import { Card, CardContent, CardHeader } from './ui/card.tsx';
import { Badge } from './ui/badge.tsx';

interface NewsCardProps {
  article: NewsArticle;
  onClick: () => void;
}

// 변경 성격을 분석하는 함수
function analyzeChangeSeverity(article: NewsArticle): 'none' | 'minor' | 'moderate' | 'major' {
  if (article.history.length < 2) return 'none';
  
  const firstVersion = article.history[0];
  const lastVersion = article.history[article.history.length - 1];
  
  const titleChanged = firstVersion.title !== lastVersion.title;
  const bodyChanged = firstVersion.body !== lastVersion.body;
  
  // 변경이 없는 경우
  if (!titleChanged && !bodyChanged) return 'none';
  
  // 제목 변경 비율 계산
  const titleWords = firstVersion.title.split(' ');
  const lastTitleWords = lastVersion.title.split(' ');
  const titleChangeRatio = Math.abs(titleWords.length - lastTitleWords.length) / titleWords.length;
  
  // 본문 변경 비율 계산
  const bodyWords = firstVersion.body.split(' ');
  const lastBodyWords = lastVersion.body.split(' ');
  const bodyChangeRatio = Math.abs(bodyWords.length - lastBodyWords.length) / bodyWords.length;
  
  // 변경 횟수도 고려
  const changeCount = article.history.length;
  
  // 중대한 변경: 제목이 크게 바뀌었거나, 본문이 20% 이상 변경되었거나, 변경 횟수가 많은 경우
  if (titleChangeRatio > 0.3 || bodyChangeRatio > 0.2 || changeCount > 4) {
    return 'major';
  }
  
  // 보통 변경: 제목이 바뀌었거나 본문이 10% 이상 변경된 경우
  if (titleChanged || bodyChangeRatio > 0.1 || changeCount > 2) {
    return 'moderate';
  }
  
  // 경미한 변경: 그 외의 경우 (주로 오타 수정 등)
  return 'minor';
}

// 변경 분석 정보를 생성하는 함수
function analyzeChanges(article: NewsArticle) {
  if (article.history.length < 2) return { type: 'none', summary: '변경 사항이 없습니다.' };
  
  const firstVersion = article.history[0];
  const lastVersion = article.history[article.history.length - 1];
  
  const titleChanged = firstVersion.title !== lastVersion.title;
  const bodyChanged = firstVersion.body !== lastVersion.body;
  
  // 변경이 없는 경우
  if (!titleChanged && !bodyChanged) {
    return { type: 'none', summary: '변경 사항이 없습니다.' };
  }
  
  // 간단한 분석 로직 (실제로는 더 정교한 AI 분석이 필요)
  const titleWords = firstVersion.title.split(' ');
  const lastTitleWords = lastVersion.title.split(' ');
  const titleChangeRatio = Math.abs(titleWords.length - lastTitleWords.length) / titleWords.length;
  
  const bodyWords = firstVersion.body.split(' ');
  const lastBodyWords = lastVersion.body.split(' ');
  const bodyChangeRatio = Math.abs(bodyWords.length - lastBodyWords.length) / bodyWords.length;
  
  let changeType: 'minor' | 'moderate' | 'major' = 'minor';
  let summary = '';
  
  if (titleChangeRatio > 0.3 || bodyChangeRatio > 0.2) {
    changeType = 'major';
    summary = '기사의 핵심 내용이나 보도 방향성에 영향을 주는 중대한 변경이 감지되었습니다.';
  } else if (titleChanged || bodyChangeRatio > 0.1) {
    changeType = 'moderate';
    summary = '제목 또는 본문에 의미있는 변경사항이 있습니다.';
  } else {
    changeType = 'minor';
    summary = '주로 오타 수정이나 문체 개선 수준의 경미한 변경입니다.';
  }
  
  return { type: changeType, summary };
}

// 변경 성격에 따른 배지 컴포넌트
function ChangeSeverityBadge({ severity }: { severity: 'minor' | 'moderate' | 'major' }) {
  const config = {
    minor: {
      label: '경미한 수정',
      className: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
    },
    moderate: {
      label: '보통 수정',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200'
    },
    major: {
      label: '중대한 수정',
      className: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200'
    }
  };

  const { label, className } = config[severity];

  return (
    <Badge 
      className={`text-xs font-medium px-2 py-1 ${className}`}
    >
      {label}
    </Badge>
  );
}

// 변경 분석 아이콘
function getChangeIcon(type: 'none' | 'minor' | 'moderate' | 'major') {
  switch (type) {
    case 'major': return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case 'moderate': return <FileText className="h-4 w-4 text-yellow-500" />;
    case 'minor': return <Pencil className="h-4 w-4 text-green-500" />;
    default: return <FileText className="h-4 w-4 text-gray-400" />;
  }
}

export function NewsCard({ article, onClick }: NewsCardProps) {
  const changeSeverity = analyzeChangeSeverity(article);
  const changeAnalysis = analyzeChanges(article);
  const hasChanges = changeSeverity !== 'none';

  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-l-4 border-l-newstapa-blue bg-gradient-to-r from-blue-50/50 to-white relative"
      onClick={onClick}
    >
      {/* 변경 성격 플래그 - 우측 상단 (변경 사항이 있을 때만 표시) */}
      {hasChanges && changeSeverity !== 'none' && (
        <div className="absolute top-3 right-3 z-10">
          <ChangeSeverityBadge severity={changeSeverity} />
        </div>
      )}

      <CardHeader className={`pb-3 ${hasChanges ? 'pr-24' : 'pr-6'}`}>
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
        <p className="text-gray-700 text-sm leading-relaxed line-clamp-3 mb-4">
          {article.desc}
        </p>
        
        {/* 변경 이력 분석 섹션 */}
        <div className="bg-gray-50 p-3 rounded-lg mb-3 border">
          <div className="flex items-start gap-3">
            {getChangeIcon(changeAnalysis.type)}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 text-sm mb-1">변경 이력 분석</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{changeAnalysis.summary}</p>
              <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                <span>• 총 {article.history.length}개 버전</span>
                {article.history.length > 0 && (
                  <>
                    <span>• 첫 게시: {article.history[0]?.timestamp}</span>
                    <span>• 최종 수정: {article.history[article.history.length - 1]?.timestamp}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
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
          <div className="text-xs text-white bg-newstapa-blue px-3 py-1 rounded-full font-medium">
            상세 이력 확인 →
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
