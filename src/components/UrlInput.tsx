
import { useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';

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
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            📰 뉴스 기사 수정 이력 조회
          </h2>
          <p className="text-gray-600 text-sm">
            기사 URL을 입력하여 수정 이력을 확인해보세요
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/news/article"
              className="flex-1 border-newstapa-blue/30 focus:border-newstapa-blue"
              disabled={loading}
            />
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-newstapa-blue hover:bg-newstapa-blue-light px-6"
            >
              <Search className="h-4 w-4 mr-2" />
              {loading ? '조회 중...' : '조회'}
            </Button>
          </div>
          
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </form>
      </div>
    </Card>
  );
}
