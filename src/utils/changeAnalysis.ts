
import { NewsArticle } from '../types/news';

export type ChangeSeverity = 'none' | 'minor' | 'moderate' | 'major';

export function analyzeChangeSeverity(article: NewsArticle): ChangeSeverity {
  if (article.history.length < 2) return 'none';
  
  const firstVersion = article.history[0];
  const lastVersion = article.history[article.history.length - 1];
  
  const titleChanged = firstVersion.title !== lastVersion.title;
  const bodyChanged = firstVersion.body !== lastVersion.body;
  
  // 변경이 없는 경우
  if (!titleChanged && !bodyChanged) return 'none';
  
  // 제목 변경 비율 계산
  const titleWords = firstVersion.title.split(' ');
  const lastTitleWords = lastVersion.title.split(' ');
  const titleChangeRatio = Math.abs(titleWords.length - lastTitleWords.length) / titleWords.length;
  
  // 본문 변경 비율 계산
  const bodyWords = firstVersion.body.split(' ');
  const lastBodyWords = lastVersion.body.split(' ');
  const bodyChangeRatio = Math.abs(bodyWords.length - lastBodyWords.length) / bodyWords.length;
  
  // 변경 횟수도 고려
  const changeCount = article.history.length;
  
  // 중대한 변경: 제목이 크게 바뀌었거나, 본문이 20% 이상 변경되었거나, 변경 횟수가 많은 경우
  if (titleChangeRatio > 0.3 || bodyChangeRatio > 0.2 || changeCount > 4) {
    return 'major';
  }
  
  // 보통 변경: 제목이 바뀌었거나 본문이 10% 이상 변경된 경우
  if (titleChanged || bodyChangeRatio > 0.1 || changeCount > 2) {
    return 'moderate';
  }
  
  // 경미한 변경: 그 외의 경우 (주로 오타 수정 등)
  return 'minor';
}
