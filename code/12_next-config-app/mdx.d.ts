declare module '*.mdx' {
  import type { ComponentType } from 'react';
  const component: ComponentType<any>;
  export default component;
}

declare module '*.md' {
  import type { ComponentType } from 'react';
  const component: ComponentType<any>;
  export default component;
}
