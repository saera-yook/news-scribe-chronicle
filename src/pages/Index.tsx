
import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { AppSidebar } from '../components/AppSidebar';
import { UrlInput } from '../components/UrlInput';
import { NewsCard } from '../components/NewsCard';
import { SubscriptionTabs } from '../components/SubscriptionTabs';

import { mockNewsData } from '../data/mockData';
import { NewsArticle, UserArticle, SubscriptionData } from '../types/news';

const Index = () => {
  const [currentView, setCurrentView] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<NewsArticle[]>([]);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    subscribedOrgs: ['한겨레', '경향신문'],
    subscribedReporters: ['김철수 기자', '박영희 기자'],
    likedArticles: []
  });

  // 구독 데이터와 조회한 기사 데이터를 localStorage에서 관리
  const myArticlesMap = JSON.parse(localStorage.getItem('myArticles') || '{}');

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // 실제로는 API 호출
    setTimeout(() => {
      const filtered = mockNewsData.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.desc.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
      setIsSearching(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const addToMyArticles = (article: NewsArticle) => {
    const userArticle: UserArticle = {
      url: article.url,
      title: article.title,
      date: article.date,
      desc: article.desc,
      history: article.history
    };
    
    const myArticlesMap = JSON.parse(localStorage.getItem('myArticles') || '{}');
    myArticlesMap[article.url] = userArticle;
    localStorage.setItem('myArticles', JSON.stringify(myArticlesMap));
  };

  const renderHomeView = () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">뉴스 변경 이력 추적</h1>
        <p className="text-xl text-gray-600">투명하고 신뢰할 수 있는 저널리즘을 위해</p>
      </div>

      <UrlInput />

      <div className="max-w-2xl mx-auto">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="기사 제목이나 내용으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button 
            onClick={handleSearch}
            disabled={isSearching}
            className="px-6"
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">검색 결과</h2>
          <div className="grid gap-4">
            {searchResults.map(article => (
              <NewsCard 
                key={article.id} 
                article={article} 
                onClick={() => addToMyArticles(article)}
              />
            ))}
          </div>
        </div>
      )}

      <SubscriptionTabs 
        subscriptionData={subscriptionData}
        onShowHistory={() => {}} // 더 이상 히스토리 페이지로 이동하지 않음
      />

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">최신 뉴스</h2>
        <div className="grid gap-4">
          {mockNewsData.map(article => (
            <NewsCard 
              key={article.id} 
              article={article} 
              onClick={() => addToMyArticles(article)}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderLikesView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">좋아요 및 구독 관리</h2>
      
      <div className="space-y-4">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">구독 중인 언론사</h3>
          <div className="flex flex-wrap gap-2">
            {subscriptionData.subscribedOrgs.map((org, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {org}
              </span>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">구독 중인 기자</h3>
          <div className="flex flex-wrap gap-2">
            {subscriptionData.subscribedReporters.map((reporter, index) => (
              <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                {reporter}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'likes':
        return renderLikesView();
      default:
        return renderHomeView();
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar currentView={currentView} onViewChange={setCurrentView} />
        
        <main className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="lg:hidden" />
              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900">
                  {currentView === 'likes' ? '좋아요/구독 관리' : '뉴스 변경 이력 추적'}
                </h1>
                <p className="text-sm text-gray-600">
                  {currentView === 'likes' 
                    ? '구독한 언론사와 기자, 좋아요한 기사를 관리하세요'
                    : '투명하고 신뢰할 수 있는 저널리즘을 위해'
                  }
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

export default Index;
