// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import SideNavigation, { type SideNavigationProps } from '@cloudscape-design/components/side-navigation';

const items: SideNavigationProps['items'] = [
  { type: 'link', text: 'Meetings', href: '/meetings/index.html' },
  {
    type: 'section',
    text: 'Learning',
    items: [
      {
        type: 'section',
        text: 'API',
        items: [
          { type: 'link', text: 'REST Overview', href: '/learning/api/#overview' },
          {
            type: 'section',
            text: 'RESTful API Constraints',
            items: [
              { type: 'link', text: '1️⃣ Uniform Interface', href: '/learning/api/#uniform-interface' },
              { type: 'link', text: '2️⃣ Client-Server', href: '/learning/api/#client-server' },
              { type: 'link', text: '3️⃣ Stateless', href: '/learning/api/#stateless' },
              { type: 'link', text: '4️⃣ Cacheable', href: '/learning/api/#cacheable' },
              { type: 'link', text: '5️⃣ Layered System', href: '/learning/api/#layered-system' },
              { type: 'link', text: '6️⃣ Code on Demand', href: '/learning/api/#code-on-demand' }
            ]
          },
          {
            type: 'section',
            text: 'API Resources',
            items: [
              { type: 'link', text: '📋 API Cheat Sheet', href: '/learning/api/#cheat-sheet' },
              { type: 'link', text: '⚙️ How It Works', href: '/learning/api/#how-it-works' },
              { type: 'link', text: '🔗 Project Resources', href: '/learning/api/#resources' }
            ]
          }
        ]
      }
    ]
  }
];

interface NavigationProps {
  onFollow?: (event: { detail: { href: string } }) => void;
}

export default function Navigation({ onFollow }: NavigationProps = {}) {
  return (
    <>
      <SideNavigation
        activeHref={location.pathname}
        header={{ href: '/home/index.html', text: 'User Group Home' }}
        items={items}
        onFollow={onFollow}
      />
    </>
  );
}
