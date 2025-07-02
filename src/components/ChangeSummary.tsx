
import { Badge } from './ui/badge';
import { AlertTriangle, FileText, Pencil } from 'lucide-react';
import { NewsVersion } from '../types/news';

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
    
    return { type, summary };
  };

  const { type, summary } = analyzeChanges();
  
  const getChangeIcon = () => {
    switch (type) {
      case 'major': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'moderate': return <FileText className="h-4 w-4 text-yellow-500" />;
      default: return <Pencil className="h-4 w-4 text-green-500" />;
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
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {getChangeIcon()}
        <span className="font-medium text-gray-900">변경 이력 분석</span>
        {getChangeBadge()}
      </div>
      
      <p className="text-sm text-gray-700">{summary}</p>
      
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="text-xs text-gray-600 space-y-1">
          <div>• 총 {history.length}개 버전</div>
          <div>• 첫 게시: {history[0]?.timestamp}</div>
          <div>• 최종 수정: {history[history.length - 1]?.timestamp}</div>
        </div>
      </div>
      
      <button
        onClick={onProceed}
        className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm"
      >
        상세 변경 이력 확인하기
      </button>
    </div>
  );
}
