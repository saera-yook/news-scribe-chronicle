
import { NewsArticle } from '../types/news';
import { SortOption } from '../components/NewsFilter';

export function filterNewsBySearch(articles: NewsArticle[], searchTerm: string): NewsArticle[] {
  if (!searchTerm.trim()) return articles;
  
  const term = searchTerm.toLowerCase();
  return articles.filter(article => 
    article.title.toLowerCase().includes(term) ||
    article.desc.toLowerCase().includes(term) ||
    (article.reporter && article.reporter.toLowerCase().includes(term)) ||
    (article.source && article.source.toLowerCase().includes(term))
  );
}

export function sortNews(articles: NewsArticle[], sortBy: SortOption): NewsArticle[] {
  return [...articles].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'date-asc':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'views-desc':
        // 조회수가 없는 경우 히스토리 길이를 기준으로 정렬
        const aViews = a.views || a.history.length;
        const bViews = b.views || b.history.length;
        return bViews - aViews;
      case 'title-asc':
        return a.title.localeCompare(b.title, 'ko');
      default:
        return 0;
    }
  });
}
