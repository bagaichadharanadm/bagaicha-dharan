'use client';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import * as React from 'react';

const navData = [
  {
    trigger: 'Bill',
    content: [
      {
        title: 'Create Bill',
        href: '/dashboard/bill/create',
        description: 'Open a form to input and save a new bill record.',
      },
      {
        title: 'Update Bill',
        href: '/dashboard/bill/edit',
        description: 'Edit existing bill records and update their details.',
      },
      {
        title: 'View Daily Bills',
        href: '/dashboard/bill/daily',
        description: 'Display a list of bills generated on a specific day.',
      },
    ],
  },
  {
    trigger: 'Expenses',
    content: [
      {
        title: 'Add Expense',
        href: '/dashboard/expense-tracking/create',
        description: 'Open a form to input and save a new expense record.',
      },
      {
        title: 'Unreviewed expenses',
        href: '/dashboard/expense-tracking/edit',
        description: 'Review and edit expenses that have not been finalized.',
      },
      {
        title: 'View daily expense',
        href: '/dashboard/expense-tracking/daily',
        description: 'Display a list of expenses incurred on a specific day.',
      },
      {
        title: 'Expense statistics',
        href: '/dashboard/expense-tracking/statistics',
        description: 'Analyze and visualize expense data through charts and graphs.',
      },
    ],
  },
  {
    trigger: 'Future Items',
    href: '/docs',
  },
];

export function HeaderNavigation() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {navData.map((navItem, index) => (
          <NavigationMenuItem key={index}>
            {navItem.content ? (
              <>
                <NavigationMenuTrigger>{navItem.trigger}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    {navItem.content.map((component) => (
                      <ListItem key={component.title} title={component.title} href={component.href}>
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <Link href={navItem.href} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>{navItem.trigger}</NavigationMenuLink>
              </Link>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  },
);
ListItem.displayName = 'ListItem';
