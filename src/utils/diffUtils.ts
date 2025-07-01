
export function diffText(oldText: string, newText: string): string {
  if (oldText === newText) return newText;
  
  const oldWords = oldText.split(' ');
  const newWords = newText.split(' ');
  const result: string[] = [];
  
  let i = 0, j = 0;
  
  while (i < oldWords.length && j < newWords.length) {
    if (oldWords[i] === newWords[j]) {
      result.push(newWords[j]);
      i++;
      j++;
    } else {
      result.push(`<span class="highlight-diff">${newWords[j]}</span>`);
      j++;
    }
  }
  
  // Add remaining new words
  for (; j < newWords.length; j++) {
    result.push(`<span class="highlight-diff">${newWords[j]}</span>`);
  }
  
  return result.join(' ');
}

export function getOrgFromUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

export function getReporterFromHistory(history: any[]): string {
  if (!history || !history.length) return '홍길동';
  
  const title = history[0].title;
  const match = title.match(/([가-힣]+)기자/);
  return match ? match[1] + '기자' : '홍길동';
}

export function generateRandomHistory(url: string) {
  const now = new Date();
  const baseTitle = '입력 기사: ' + url.slice(0, 40) + (url.length > 40 ? '...' : '');
  const baseBody = '이 기사는 사용자가 직접 입력한 URL로 조회된 기사입니다. 실제 서비스에서는 해당 기사에 대한 수정 이력을 불러옵니다.';
  
  return [
    {
      timestamp: now.toLocaleString('ko-KR', { hour12: false }),
      title: baseTitle,
      body: baseBody + ' (최초 버전)'
    },
    {
      timestamp: new Date(now.getTime() + 1000 * 60 * 60).toLocaleString('ko-KR', { hour12: false }),
      title: baseTitle + ' (제목 일부 수정)',
      body: baseBody + ' (본문 일부가 수정되었습니다.)'
    },
    {
      timestamp: new Date(now.getTime() + 1000 * 60 * 120).toLocaleString('ko-KR', { hour12: false }),
      title: baseTitle + ' (최신 버전)',
      body: baseBody + ' (최신 버전, 추가 내용이 반영되었습니다.)'
    }
  ];
}
