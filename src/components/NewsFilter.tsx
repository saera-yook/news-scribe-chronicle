
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export type SortOption = 'date-desc' | 'date-asc' | 'views-desc' | 'title-asc';

interface NewsFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function NewsFilter({ searchTerm, onSearchChange, sortBy, onSortChange }: NewsFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="기사 제목, 내용, 기자명으로 검색..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="w-full sm:w-48">
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger>
            <SelectValue placeholder="정렬 방식" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">최신순</SelectItem>
            <SelectItem value="date-asc">오래된순</SelectItem>
            <SelectItem value="views-desc">조회순</SelectItem>
            <SelectItem value="title-asc">제목순</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
