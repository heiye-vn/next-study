import { useState, useEffect, useCallback } from 'react';

/**
 * 自定义钩子，用于与 localStorage 同步状态.
 * 优雅地处理序列化、反序列化和错误状态.
 *
 * @param {string} key - 用于存储值的键名。
 * @param {any} initialValue - 如果 localStorage 中没有对应的值时的默认初始值。
 * @returns {[any, Function]} - 包含状态值和更新函数的数组。
 */
export function useLocalStorage(key, initialValue) {
  // 从本地存储读取值，解析存储的 JSON 或返回初始值
  const readValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`读取 localStorage 的键名 "${key}" 时出错:`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState(readValue);

  // 返回一个封装好的 setter 函数，将新值同步持久化到 localStorage
  const setValue = useCallback((value) => {
    try {
      // 允许传入函数，使其 API 与 useState 保持一致
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`设置 localStorage 的键名 "${key}" 时出错:`, error);
    }
  }, [key, storedValue]);

  // 如果其他标签页修改了数据，同步更新状态（多标签同步）
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`解析 "${key}" 的同步事件出错:`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}
