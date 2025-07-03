import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs.tsx';
import { NewsCard } from './NewsCard.tsx';
import { NewsFilter, SortOption } from './NewsFilter.tsx';
import { mockNewsData } from '../data/mockData.ts';
import { NewsArticle, SubscriptionData } from '../types/news.ts';
import { filterNewsBySearch, sortNews } from '../utils/newsUtils.ts';

interface SubscriptionTabsProps {
  subscriptionData: SubscriptionData;
  onShowHistory: (articleId: number) => void;
  likedArticleIds?: Set<number>;
  onLikeToggle?: (articleId: number) => void;
}

export function SubscriptionTabs({ 
  subscriptionData, 
  onShowHistory, 
  likedArticleIds = new Set(),
  onLikeToggle 
}: SubscriptionTabsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

  const getSubscribedOrgArticles = (): NewsArticle[] => {
    return mockNewsData.filter(article => 
      article.source && subscriptionData.subscribedOrgs.some(org => 
        article.source?.toLowerCase().includes(org.toLowerCase())
      )
    );
  };

  const getSubscribedReporterArticles = (): NewsArticle[] => {
    return mockNewsData.filter(article => 
      article.reporter && subscriptionData.subscribedReporters.some(reporter => 
        article.reporter?.includes(reporter.replace('기자', ''))
      )
    );
  };

  const filteredAndSortedOrgArticles = useMemo(() => {
    const articles = getSubscribedOrgArticles();
    const filtered = filterNewsBySearch(articles, searchTerm);
    return sortNews(filtered, sortBy);
  }, [subscriptionData.subscribedOrgs, searchTerm, sortBy]);

  const filteredAndSortedReporterArticles = useMemo(() => {
    const articles = getSubscribedReporterArticles();
    const filtered = filterNewsBySearch(articles, searchTerm);
    return sortNews(filtered, sortBy);
  }, [subscriptionData.subscribedReporters, searchTerm, sortBy]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">구독 중인 뉴스</h2>
      
      <NewsFilter 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      
      <Tabs defaultValue="orgs" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="orgs" className="flex items-center gap-2">
            📰 구독 언론사 ({filteredAndSortedOrgArticles.length})
          </TabsTrigger>
          <TabsTrigger value="reporters" className="flex items-center gap-2">
            🧑‍💼 구독 기자 ({filteredAndSortedReporterArticles.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="orgs" className="space-y-4">
          {filteredAndSortedOrgArticles.length > 0 ? (
            <div className="grid gap-4">
              {filteredAndSortedOrgArticles.map(article => (
                <NewsCard
                  key={article.id}
                  article={article}
                  onClick={() => onShowHistory(article.id)}
                  isLiked={likedArticleIds.has(article.id)}
                  onLikeToggle={onLikeToggle}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>구독한 언론사의 기사가 없습니다.</p>
              <p className="text-sm mt-2">기사 상세 페이지에서 언론사를 구독해보세요.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="reporters" className="space-y-4">
          {filteredAndSortedReporterArticles.length > 0 ? (
            <div className="grid gap-4">
              {filteredAndSortedReporterArticles.map(article => (
                <NewsCard
                  key={article.id}
                  article={article}
                  onClick={() => onShowHistory(article.id)}
                  isLiked={likedArticleIds.has(article.id)}
                  onLikeToggle={onLikeToggle}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>구독한 기자의 기사가 없습니다.</p>
              <p className="text-sm mt-2">기사 상세 페이지에서 기자를 구독해보세요.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}