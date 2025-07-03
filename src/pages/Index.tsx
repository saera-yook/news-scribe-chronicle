import { useState, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

import { AppSidebar } from '../components/AppSidebar.tsx';
import { NewsCard } from '../components/NewsCard.tsx';
import { NewsFilter, SortOption } from '../components/NewsFilter.tsx';
import { UrlInput } from '../components/UrlInput.tsx';
import { Timeline } from '../components/Timeline.tsx';
import { VersionCompare } from '../components/VersionCompare.tsx';
import { ActionButtons } from '../components/ActionButtons.tsx';
import { SubscriptionTabs } from '../components/SubscriptionTabs.tsx';

import { mockNewsData, mockUserArticles } from '../data/mockData.ts';
import { generateRandomHistory, getOrgFromUrl, getReporterFromHistory } from '../utils/diffUtils.ts';
import { filterNewsBySearch, sortNews } from '../utils/newsUtils.ts';
import { NewsVersion, UserArticle, SubscriptionData } from '../types/news.ts';

const Index = () => {
  const { toast } = useToast();
  const [currentView, setCurrentView] = useState('home');
  const [currentHistory, setCurrentHistory] = useState<NewsVersion[]>([]);
  const [selectedA, setSelectedA] = useState(0);
  const [selectedB, setSelectedB] = useState(0);
  const [likeStatus, setLikeStatus] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 검색 및 정렬 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  
  // User data
  const [myArticles, setMyArticles] = useState<UserArticle[]>(mockUserArticles);
  const [myArticlesMap, setMyArticlesMap] = useState<Record<string, boolean>>({
    'https://newstapa.org/article/20250627-education-seminar': true,
    'https://hankyoreh.com/article/20250626-climate-policy': true,
    'https://ytn.co.kr/article/20250625-housing-crisis': true,
    'https://chosun.com/article/20250624-tech-news': true,
    'https://donga.com/article/20250623-sports-news': true,
    'https://joongang.co.kr/article/20250622-economy-news': true,
  });
  
  // Subscription data
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    subscribedOrgs: ['newstapa.org', 'hankyoreh.com'],
    subscribedReporters: ['홍길동', '김기자'],
    likedArticles: [
      {
        url: 'https://newstapa.org/article/20250627-education-seminar',
        title: '대한교조, 리박스쿨, 뉴라이트의 극우 역사 세미나',
        date: '2025-06-27',
        history: []
      }
    ]
  });

  // 필터링 및 정렬된 기사 목록
  const filteredAndSortedNews = useMemo(() => {
    const filtered = filterNewsBySearch(mockNewsData, searchTerm);
    return sortNews(filtered, sortBy);
  }, [searchTerm, sortBy]);

  // 기사 클릭 시 바로 상세 변경 이력 페이지로 이동
  const showHistory = (articleId?: number, customHistory?: NewsVersion[]) => {
    let history: NewsVersion[] = [];
    
    if (articleId) {
      const article = mockNewsData.find(n => n.id === articleId);
      if (article) {
        history = article.history;
      }
    } else if (customHistory) {
      history = customHistory;
    }
    
    if (history.length === 0) return;
    
    setCurrentHistory(history);
    setSelectedA(history.length - 1);
    setSelectedB(Math.max(0, history.length - 2));
    setCurrentView('history'); // 바로 상세 이력 페이지로 이동
    setLikeStatus('');
  };

  const handleUrlSubmit = (url: string) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const found = mockNewsData.find(n => n.url === url);
      
      if (found) {
        showHistory(found.id);
      } else {
        // Add to user articles if not already there
        if (!myArticlesMap[url]) {
          const history = generateRandomHistory(url);
          const newArticle: UserArticle = { url, history };
          
          setMyArticles(prev => [newArticle, ...prev.slice(0, 9)]);
          setMyArticlesMap(prev => ({ ...prev, [url]: true }));
        }
        
        showHistory(undefined, generateRandomHistory(url));
      }
      
      setLoading(false);
    }, 1000);
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

  const handleLikeOrg = () => {
    if (!currentHistory.length) return;
    
    const org = getOrgFromUrl('https://newstapa.org');
    const isSubscribed = subscriptionData.subscribedOrgs.includes(org);
    
    setSubscriptionData(prev => ({
      ...prev,
      subscribedOrgs: isSubscribed 
        ? prev.subscribedOrgs.filter(o => o !== org)
        : [...prev.subscribedOrgs, org]
    }));
    
    setLikeStatus(isSubscribed ? `${org} 구독 취소` : `${org} 구독!`);
    
    toast({
      title: isSubscribed ? "구독 취소" : "구독 완료",
      description: isSubscribed ? `${org} 구독을 취소했습니다.` : `${org}를 구독했습니다.`,
    });
  };

  const handleSubscribeReporter = () => {
    if (!currentHistory.length) return;
    
    const reporter = getReporterFromHistory(currentHistory);
    const isSubscribed = subscriptionData.subscribedReporters.includes(reporter);
    
    setSubscriptionData(prev => ({
      ...prev,
      subscribedReporters: isSubscribed
        ? prev.subscribedReporters.filter(r => r !== reporter)
        : [...prev.subscribedReporters, reporter]
    }));
    
    setLikeStatus(isSubscribed ? `${reporter} 구독 취소` : `${reporter} 구독!`);
    
    toast({
      title: isSubscribed ? "구독 취소" : "구독 완료",
      description: isSubscribed ? `${reporter} 구독을 취소했습니다.` : `${reporter}를 구독했습니다.`,
    });
  };

  const handleLikeArticle = () => {
    if (!currentHistory.length) return;
    
    const articleUrl = 'https://newstapa.org/current-article';
    const isLiked = subscriptionData.likedArticles.some(a => a.url === articleUrl);
    
    if (isLiked) {
      setSubscriptionData(prev => ({
        ...prev,
        likedArticles: prev.likedArticles.filter(a => a.url !== articleUrl)
      }));
      setLikeStatus('기사 좋아요 취소');
    } else {
      const newLikedArticle: UserArticle = {
        url: articleUrl,
        title: currentHistory[0].title,
        date: new Date().toISOString().split('T')[0],
        history: currentHistory
      };
      
      setSubscriptionData(prev => ({
        ...prev,
        likedArticles: [...prev.likedArticles, newLikedArticle]
      }));
      setLikeStatus('기사 좋아요!');
    }
    
    toast({
      title: isLiked ? "좋아요 취소" : "좋아요 완료",
      description: isLiked ? "기사 좋아요를 취소했습니다." : "기사를 좋아요 했습니다.",
    });
  };

  const renderHomeSection = () => (
    <div className="space-y-8">
      <UrlInput onSubmit={handleUrlSubmit} loading={loading} />
      
      <SubscriptionTabs 
        subscriptionData={subscriptionData}
        onShowHistory={showHistory}
      />
      
      <section className="space-y-6" aria-labelledby="recent-news-heading">
        <h2 id="recent-news-heading" className="text-2xl font-bold text-high-contrast">
          최근 뉴스 기사
        </h2>
        
        <NewsFilter 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
        
        <div className="grid gap-4" role="list">
          {filteredAndSortedNews.length > 0 ? (
            filteredAndSortedNews.map(article => (
              <div key={article.id} role="listitem">
                <NewsCard
                  article={article}
                  onClick={() => showHistory(article.id)}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>검색 결과가 없습니다.</p>
              <p className="text-sm mt-2">다른 키워드로 검색해보세요.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );

  const renderHistorySection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          onClick={() => {
            setCurrentView('home');
          }}
          variant="outline"
          className="flex items-center gap-2"
          aria-label="기사 목록으로 돌아가기"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          기사 목록으로
        </Button>
      </div>

      <ActionButtons
        onLikeOrg={handleLikeOrg}
        onSubscribeReporter={handleSubscribeReporter}
        onLikeArticle={handleLikeArticle}
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
        return renderHomeSection();
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {/* Skip link for keyboard navigation */}
        <a href="#main-content" className="skip-link">
          메인 콘텐츠로 바로가기
        </a>
        
        <AppSidebar currentView={currentView} onViewChange={setCurrentView} />
        
        <main className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="lg:hidden" />
              <div className="flex-1">
                <h1 className="text-xl font-bold text-high-contrast">
                  뉴스 수정 이력 조회 서비스
                </h1>
                <p className="text-sm text-medium-contrast">
                  투명하고 신뢰할 수 있는 뉴스를 위한 도구
                </p>
              </div>
            </div>
          </header>
          
          <div id="main-content" className="flex-1 p-6" tabIndex={-1}>
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
