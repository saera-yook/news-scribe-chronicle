
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { NewsCard } from './NewsCard';
import { mockNewsData } from '../data/mockData';
import { NewsArticle, SubscriptionData } from '../types/news';

interface SubscriptionTabsProps {
  subscriptionData: SubscriptionData;
  onShowHistory: (articleId: number) => void;
}

export function SubscriptionTabs({ subscriptionData, onShowHistory }: SubscriptionTabsProps) {
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

  const subscribedOrgArticles = getSubscribedOrgArticles();
  const subscribedReporterArticles = getSubscribedReporterArticles();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">구독 중인 뉴스</h2>
      
      <Tabs defaultValue="orgs" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="orgs" className="flex items-center gap-2">
            📰 구독 언론사 ({subscribedOrgArticles.length})
          </TabsTrigger>
          <TabsTrigger value="reporters" className="flex items-center gap-2">
            🧑‍💼 구독 기자 ({subscribedReporterArticles.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="orgs" className="space-y-4">
          {subscribedOrgArticles.length > 0 ? (
            <div className="grid gap-4">
              {subscribedOrgArticles.map(article => (
                <NewsCard
                  key={article.id}
                  article={article}
                  onClick={() => onShowHistory(article.id)}
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
          {subscribedReporterArticles.length > 0 ? (
            <div className="grid gap-4">
              {subscribedReporterArticles.map(article => (
                <NewsCard
                  key={article.id}
                  article={article}
                  onClick={() => onShowHistory(article.id)}
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
