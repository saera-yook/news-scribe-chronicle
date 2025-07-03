
import { NewsVersion } from '../types/news.ts';
import { diffText } from '../utils/diffUtils.ts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.tsx';

interface VersionCompareProps {
  versionA: NewsVersion;
  versionB: NewsVersion;
}

export function VersionCompare({ versionA, versionB }: VersionCompareProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6 version-compare">
      <Card className="border-newstapa-green/30">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
          <CardTitle className="text-lg text-newstapa-green">
            새 버전 ({versionA.timestamp})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">제목</h4>
            <div 
              className="text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: diffText(versionB.title, versionA.title) 
              }}
            />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">본문</h4>
            <div 
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: diffText(versionB.body, versionA.body) 
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-300">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b">
          <CardTitle className="text-lg text-gray-600">
            이전 버전 ({versionB.timestamp})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">제목</h4>
            <div 
              className="text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: diffText(versionA.title, versionB.title) 
              }}
            />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">본문</h4>
            <div 
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: diffText(versionA.body, versionB.body) 
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
