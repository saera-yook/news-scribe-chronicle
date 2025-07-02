
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

import { AppSidebar } from '../components/AppSidebar';
import { Timeline } from '../components/Timeline';
import { VersionCompare } from '../components/VersionCompare';
import { ActionButtons } from '../components/ActionButtons';

import { mockUserArticles } from '../data/mockData';
import { NewsVersion, UserArticle } from '../types/news';

const MyArticles = () => {
  const [currentView, setCurrentView] = useState('list');
  const [currentHistory, setCurrentHistory] = useState<NewsVersion[]>([]);
  const [selectedA, setSelectedA] = useState(0);
  const [selectedB, setSelectedB] = useState(0);
  const [likeStatus, setLikeStatus] = useState('');

  const showHistory = (customHistory: NewsVersion[]) => {
    if (customHistory.length === 0) return;
    
    setCurrentHistory(customHistory);
    setSelectedA(customHistory.length - 1);
    setSelectedB(Math.max(0, customHistory.length - 2));
    setCurrentView('history');
    setLikeStatus('');
  };

  const handleVersionSelect = (index: number) => {
    if (index === selectedA) return;
    
    if (selectedA === null || Math.abs(index - selectedA) === 1) {
      setSelectedB(selectedA);
      setSelectedA(index);
    } else {
      setSelectedA(index);
    }
  };

  const renderArticlesList = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">내가 조회한 기사</h2>
      <div className="grid gap-4">
        {mockUserArticles.map((article, index) => (
          <div
            key={index}
            className="p-4 bg-cyan-50 border border-cyan-200 rounded-lg cursor-pointer hover:shadow-md transition-all duration-200"
            onClick={() => showHistory(article.history)}
          >
            <h3 className="font-semibold text-gray-900 mb-2">
              {article.title || article.url}
            </h3>
            {article.date && (
              <p className="text-sm text-gray-600 mb-2">{article.date}</p>
            )}
            <p className="text-sm text-gray-700">{article.desc || ''}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHistorySection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          onClick={() => setCurrentView('list')}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          기사 목록으로
        </Button>
      </div>

      <ActionButtons
        onLikeOrg={() => {}}
        onSubscribeReporter={() => {}}
        onLikeArticle={() => {}}
        onShowSummary={() => {}}
        onSaveImage={() => {}}
        likeStatus={likeStatus}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Timeline
            history={currentHistory}
            selectedA={selectedA}
            selectedB={selectedB}
            onSelectVersion={handleVersionSelect}
          />
        </div>
        
        <div className="lg:col-span-2">
          {currentHistory.length > 0 && (
            <VersionCompare
              versionA={currentHistory[selectedA]}
              versionB={currentHistory[selectedB]}
            />
          )}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'history':
        return renderHistorySection();
      default:
        return renderArticlesList();
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar currentView="myArticles" onViewChange={() => {}} />
        
        <main className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="lg:hidden" />
              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900">
                  내가 조회한 기사
                </h1>
                <p className="text-sm text-gray-600">
                  이전에 조회한 기사들의 수정 이력을 확인하세요
                </p>
              </div>
            </div>
          </header>
          
          <div className="flex-1 p-6">
            <div className="max-w-6xl mx-auto">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MyArticles;
