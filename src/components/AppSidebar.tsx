import { useState } from 'react';
import { Home, Clock, Heart, Menu } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

interface AppSidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function AppSidebar({ currentView, onViewChange }: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const menuItems = [
    { id: 'home', title: '기사 목록', icon: Home },
    { id: 'myArticles', title: '내가 조회한 기사', icon: Clock },
    { id: 'likes', title: '좋아요/구독 관리', icon: Heart },
  ];

  const isActive = (id: string) => currentView === id;

  const handleMenuClick = (id: string) => {
    onViewChange(id);
    
    // "기사 목록" 메뉴 클릭 시 페이지 상단으로 스크롤
    if (id === 'home') {
      setTimeout(() => {
        window.scrollTo({ 
          top: 0, 
          behavior: 'smooth' 
        });
      }, 100);
    }
    
    // "내가 조회한 기사" 메뉴 클릭 시 해당 섹션으로 스크롤
    if (id === 'myArticles') {
      setTimeout(() => {
        const myArticlesSection = document.getElementById('myArticlesSection');
        if (myArticlesSection) {
          myArticlesSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    }
  };

  return (
    <Sidebar className={`${collapsed ? 'w-14' : 'w-64'} transition-all duration-300`} collapsible="icon">
      <SidebarTrigger className="m-2 self-end" />
      
      <SidebarContent className="bg-sidebar">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-bold text-sm">📰</span>
            </div>
            {!collapsed && (
              <div>
                <h1 className="font-bold text-sidebar-foreground text-lg">뉴스 이력</h1>
                <p className="text-xs text-sidebar-foreground/70">투명한 저널리즘</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium">
              메인 메뉴
            </SidebarGroupLabel>
          )}
          
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => handleMenuClick(item.id)}
                    className={`
                      ${isActive(item.id) 
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium' 
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      } 
                      transition-colors duration-200
                    `}
                  >
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4 border-t border-sidebar-border">
          {!collapsed && (
            <div className="text-xs text-sidebar-foreground/60 text-center">
              © 뉴스타파 기반 예시
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
