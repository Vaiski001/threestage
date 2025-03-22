
// Export everything from a barrel file
export { useSidebar, SidebarProvider } from './context';
export { Sidebar } from './sidebar';
export { SidebarTrigger } from './trigger';
export { SidebarRail } from './rail';
export { SidebarInset } from './inset';
export { SidebarInput } from './input';
export { 
  SidebarHeader, 
  SidebarFooter, 
  SidebarSeparator, 
  SidebarContent 
} from './sections';
export { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupAction, 
  SidebarGroupContent 
} from './group';
export { SidebarMenu, SidebarMenuItem } from './menu';
export { 
  SidebarMenuButton, 
  SidebarMenuAction, 
  SidebarMenuBadge,
  sidebarMenuButtonVariants 
} from './menu-button';
export { SidebarMenuSkeleton } from './menu-skeleton';
export { 
  SidebarMenuSub, 
  SidebarMenuSubItem, 
  SidebarMenuSubButton 
} from './menu-sub';

// Export types
export type { SidebarContext } from './types';
