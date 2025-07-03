
import { Badge } from './ui/badge';
import { ChangeSeverity } from '../utils/changeAnalysis';

interface ChangeSeverityBadgeProps {
  severity: Exclude<ChangeSeverity, 'none'>;
}

export function ChangeSeverityBadge({ severity }: ChangeSeverityBadgeProps) {
  const config = {
    minor: {
      label: '경미한 수정',
      className: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
    },
    moderate: {
      label: '보통 수정',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200'
    },
    major: {
      label: '중대한 수정',
      className: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200'
    }
  };

  const { label, className } = config[severity];

  return (
    <Badge 
      className={`text-xs font-medium px-2 py-1 ${className}`}
    >
      {label}
    </Badge>
  );
}
