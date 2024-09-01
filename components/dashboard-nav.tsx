'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types';
import { Dispatch, SetStateAction } from 'react';
import { useSidebar } from '@/hooks/useSidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from './ui/tooltip';
import cookies from 'js-cookie';

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileNav?: boolean;
}

export function DashboardNav({
  items,
  setOpen,
  isMobileNav = false
}: DashboardNavProps) {
  const path = usePathname();
  const router = useRouter(); // Use the Next.js router
  const { isMinimized } = useSidebar();

  if (!items?.length) {
    return null;
  }

  const handleItemClick = (item: NavItem) => {
    if (item.href === '/logout') {
      handleLogout();
    } else if (item.href) {
      router.push(item.href); // Navigate to the href
    }

    if (setOpen) setOpen(false); // Close the sidebar if applicable
  };

  const handleLogout = () => {
    cookies.remove('custom-auth-token'); // Remove the cookie using js-cookie
    router.push('/');
  };

  return (
    <nav className="grid items-start gap-2">
      <TooltipProvider>
        {items.map((item, index) => {
          const Icon = Icons[item.icon || 'arrowRight'];
          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    'flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                    path === item.href ? 'bg-accent' : 'transparent',
                    item.disabled && 'cursor-not-allowed opacity-80'
                  )}
                  onClick={() => handleItemClick(item)}
                >
                  <Icon className={`ml-3 size-5 flex-none`} />

                  {isMobileNav || (!isMinimized && !isMobileNav) ? (
                    <span className="mr-2 truncate">{item.title}</span>
                  ) : (
                    ''
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent
                align="center"
                side="right"
                sideOffset={8}
                className={!isMinimized ? 'hidden' : 'inline-block'}
              >
                {item.title}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </TooltipProvider>
    </nav>
  );
}
