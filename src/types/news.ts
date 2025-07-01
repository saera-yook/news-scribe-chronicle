
export interface NewsArticle {
  id: number;
  url: string;
  title: string;
  date: string;
  desc: string;
  source?: string;
  reporter?: string;
  history: NewsVersion[];
}

export interface NewsVersion {
  timestamp: string;
  title: string;
  body: string;
  changeType?: 'title' | 'content' | 'both';
}

export interface UserArticle {
  url: string;
  title?: string;
  date?: string;
  desc?: string;
  history: NewsVersion[];
}

export interface SubscriptionData {
  subscribedOrgs: string[];
  subscribedReporters: string[];
  likedArticles: UserArticle[];
}
