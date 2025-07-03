
import { useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { Button } from './ui/button.tsx';
import { Input } from './ui/input.tsx';
import { Card } from './ui/card.tsx';

interface UrlInputProps {
  onSubmit: (url: string) => void;
  loading?: boolean;
}

export function UrlInput({ onSubmit, loading = false }: UrlInputProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('URL을 입력해주세요.');
      return;
    }
    
    if (!/^https?:\/\//.test(url.trim())) {
      setError('유효한 URL을 입력해주세요. (http:// 또는 https://로 시작)');
      return;
    }
    
    setError('');
    onSubmit(url.trim());
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-newstapa-blue/5 to-cyan-50 border-newstapa-blue/20">
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-high-contrast mb-2">
            📰 뉴스 기사 수정 이력 조회
          </h2>
          <p className="text-medium-contrast text-sm">
            기사 URL을 입력하여 수정 이력을 확인해보세요
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3" role="search">
          <div className="space-y-2">
            <label htmlFor="article-url" className="block text-sm font-medium text-high-contrast">
              기사 URL
            </label>
            <div className="flex gap-2">
              <Input
                id="article-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/news/article"
                className="flex-1 border-newstapa-blue/30 focus:border-newstapa-blue"
                disabled={loading}
                required
                aria-describedby={error ? "url-error" : "url-help"}
                aria-invalid={!!error}
              />
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-newstapa-blue hover:bg-newstapa-blue-light px-6"
                aria-label={loading ? '조회 중입니다' : '뉴스 기사 수정 이력 조회'}
              >
                <Search className="h-4 w-4 mr-2" aria-hidden="true" />
                {loading ? '조회 중...' : '조회'}
              </Button>
            </div>
            <div id="url-help" className="text-xs text-medium-contrast">
              조회하려는 뉴스 기사의 전체 URL을 입력해주세요.
            </div>
          </div>
          
          {error && (
            <div 
              id="url-error"
              className="flex items-center gap-2 error-text text-sm bg-red-50 p-3 rounded-lg"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              {error}
            </div>
          )}
        </form>
      </div>
    </Card>
  );
}
