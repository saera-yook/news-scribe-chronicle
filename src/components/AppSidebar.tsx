
import { useState } from 'react';
import { Home, Clock, Heart, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const navigate = useNavigate();
  const location = useLocation();
  const collapsed = state === 'collapsed';

  const menuItems = [
    { id: 'home', title: '기사 목록', icon: Home, path: '/', description: '뉴스 기사 목록 보기' },
    { id: 'myArticles', title: '내가 조회한 기사', icon: Clock, path: '/my-articles', description: '조회한 기사 이력 보기' },
    { id: 'likes', title: '좋아요/구독 관리', icon: Heart, path: '/likes', description: '구독 및 좋아요 관리' },
  ];

  const isActive = (item: any) => {
    if (item.path === '/my-articles') {
      return location.pathname === '/my-articles';
    }
    if (item.path === '/likes') {
      return location.pathname === '/likes';
    }
    return location.pathname === '/' && (currentView === 'home' || currentView === 'history');
  };

  const handleMenuClick = (item: any) => {
    if (item.path === '/my-articles') {
      navigate('/my-articles');
    } else if (item.path === '/likes') {
      navigate('/likes');
    } else {
      navigate('/');
      onViewChange('home');
      
      setTimeout(() => {
        window.scrollTo({ 
          top: 0, 
          behavior: 'smooth' 
        });
      }, 100);
    }
  };

  return (
    <Sidebar 
      className={`${collapsed ? 'w-14' : 'w-64'} transition-all duration-300`} 
      collapsible="icon"
      role="navigation"
      aria-label="메인 네비게이션"
    >
      <SidebarTrigger 
        className="m-2 self-end" 
        aria-label={collapsed ? "사이드바 열기" : "사이드바 닫기"}
      />
      
      <SidebarContent className="bg-sidebar">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-bold text-sm" aria-hidden="true">📰</span>
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
            <SidebarMenu role="menu">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id} role="none">
                  <SidebarMenuButton
                    onClick={() => handleMenuClick(item)}
                    className={`
                      ${isActive(item) 
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium' 
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      } 
                      transition-colors duration-200 min-h-12
                    `}
                    role="menuitem"
                    aria-label={collapsed ? item.description : item.title}
                    aria-current={isActive(item) ? 'page' : undefined}
                  >
                    <item.icon className="h-4 w-4" aria-hidden="true" />
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
