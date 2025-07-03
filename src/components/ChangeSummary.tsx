
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.tsx';
import { Badge } from './ui/badge.tsx';
import { AlertTriangle, FileText, Pencil } from 'lucide-react';
import { NewsVersion } from '../types/news.ts';

interface ChangeSummaryProps {
  history: NewsVersion[];
  onProceed: () => void;
}

export function ChangeSummary({ history, onProceed }: ChangeSummaryProps) {
  const analyzeChanges = () => {
    if (history.length < 2) return { type: 'minor', summary: '변경 사항이 없습니다.' };
    
    const firstVersion = history[0];
    const lastVersion = history[history.length - 1];
    
    const titleChanged = firstVersion.title !== lastVersion.title;
    const bodyChanged = firstVersion.body !== lastVersion.body;
    
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
  };

  const { type, summary } = analyzeChanges();
  
  const getChangeIcon = () => {
    switch (type) {
      case 'major': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'moderate': return <FileText className="h-5 w-5 text-yellow-500" />;
      default: return <Pencil className="h-5 w-5 text-green-500" />;
    }
  };
  
  const getChangeBadge = () => {
    const variants = {
      major: 'destructive',
      moderate: 'secondary',
      minor: 'default'
    } as const;
    
    const labels = {
      major: '중대한 변경',
      moderate: '보통 변경',
      minor: '경미한 변경'
    };
    
    return <Badge variant={variants[type]}>{labels[type]}</Badge>;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          {getChangeIcon()}
          <CardTitle>변경 이력 분석</CardTitle>
          {getChangeBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-700">{summary}</p>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">변경 정보</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 총 {history.length}개 버전</li>
            <li>• 첫 게시: {history[0]?.timestamp}</li>
            <li>• 최종 수정: {history[history.length - 1]?.timestamp}</li>
          </ul>
        </div>
        
        <button
          onClick={onProceed}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          상세 변경 이력 확인하기
        </button>
      </CardContent>
    </Card>
  );
}
