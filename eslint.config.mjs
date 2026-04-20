import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 用于桥接 Next.js 传统的强力插件
const compat = new FlatCompat({
    baseDirectory: __dirname,
});

export default tseslint.config(
    {
        ignores: ['**/dist', '**/node_modules', '**/.next'], // 忽略所有子项目的构建产物
    },
    // 1. 继承 Next.js 核心规则 (包含 core-web-vitals 优化)
    ...compat.extends("next/core-web-vitals"),

    // 2. 你的基础配置组合
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            // 注意：react-hooks 的规则其实 next/core-web-vitals 已经包含了，
            // 但显式声明也没有问题，或者你可以依赖 Next.js 的内置处理。
        ],
        languageOptions: {
            ecmaVersion: 2022,
            globals: {
                ...globals.browser,
                ...globals.node, // Next.js 有服务端渲染，需要 Node 全局变量
            },
        },
        rules: {
            // ==========================================
            // 保留你原本非常好的个人规范
            // ==========================================
            '@typescript-eslint/no-unused-vars': ['warn', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
            }],

            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'no-debugger': 'warn',
            'prefer-const': 'error',
            'no-var': 'error',
            'arrow-body-style': ['warn', 'as-needed'],

            // ==========================================
            // Next.js 特定规则微调 (按需开启)
            // ==========================================
            // 举例：如果你在写简单的 demo 不想被 Image 组件强制约束，可以临时设为 warn
            // "@next/next/no-img-element": "warn" 
        }
    },

    // 3. Prettier 永远放在最后，关闭所有冲突规则
    prettier
);