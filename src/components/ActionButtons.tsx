
import { useState } from 'react';
import { Heart, Bell, Download, FileText, CheckCircle, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useToast } from '@/hooks/use-toast';

interface ActionButtonsProps {
  onLikeOrg: () => void;
  onSubscribeReporter: () => void;
  onLikeArticle: () => void;
  onShowSummary: () => void;
  onSaveImage: () => void;
  likeStatus?: string;
}

export function ActionButtons({ 
  onLikeOrg, 
  onSubscribeReporter, 
  onLikeArticle, 
  onShowSummary, 
  onSaveImage,
  likeStatus 
}: ActionButtonsProps) {
  const { toast } = useToast();
  const [showSummary, setShowSummary] = useState(false);

  const handleSummary = () => {
    setShowSummary(!showSummary);
    onShowSummary();
  };

  const handleSaveImage = () => {
    toast({
      title: "이미지 저장",
      description: "실제 서비스에서는 html2canvas 등을 활용하여 구현됩니다.",
    });
    onSaveImage();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={onLikeOrg}
          variant="outline"
          className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
        >
          <Bell className="h-4 w-4 mr-2" />
          언론사 구독
        </Button>
        
        <Button
          onClick={onSubscribeReporter}
          variant="outline"
          className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
        >
          <Bell className="h-4 w-4 mr-2" />
          기자 구독
        </Button>
        
        <Button
          onClick={onLikeArticle}
          variant="outline"
          className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
        >
          <Heart className="h-4 w-4 mr-2" />
          기사 좋아요
        </Button>
        
        <Button
          onClick={handleSummary}
          variant="outline"
          className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
        >
          <FileText className="h-4 w-4 mr-2" />
          요약 보기
        </Button>
        
        <Button
          onClick={handleSaveImage}
          variant="outline"
          className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
        >
          <Download className="h-4 w-4 mr-2" />
          이미지 저장
        </Button>
      </div>

      {likeStatus && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">{likeStatus}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
