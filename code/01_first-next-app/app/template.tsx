import type { ReactNode } from 'react'

export default function Template({ children }: {
    children: ReactNode
}) {
    return <div>{ children }</div>
}

/*
    template.tsx 用于模板
*/