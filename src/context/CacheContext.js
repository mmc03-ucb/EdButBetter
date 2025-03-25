import React, { createContext, useContext, useState } from 'react';

// Create a context for caching data
const CacheContext = createContext(null);

// Cache expiration time (in milliseconds)
const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes

export function CacheProvider({ children }) {
  // State to store various cached data
  const [threadCache, setThreadCache] = useState({});
  const [threadListCache, setThreadListCache] = useState({});
  const [insightsCache, setInsightsCache] = useState({});

  // Function to cache a specific thread by ID
  const cacheThread = (threadId, threadData) => {
    setThreadCache(prev => ({
      ...prev,
      [threadId]: {
        data: threadData,
        timestamp: Date.now()
      }
    }));
  };

  // Function to get a thread from cache, if available and not expired
  const getCachedThread = (threadId) => {
    const cachedData = threadCache[threadId];
    
    if (!cachedData) return null;
    
    // Check if cache is expired
    if (Date.now() - cachedData.timestamp > CACHE_EXPIRATION) {
      // Cache expired, remove it
      const newCache = { ...threadCache };
      delete newCache[threadId];
      setThreadCache(newCache);
      return null;
    }
    
    return cachedData.data;
  };

  // Function to cache thread list by section
  const cacheThreadList = (section, threadListData) => {
    setThreadListCache(prev => ({
      ...prev,
      [section]: {
        data: threadListData,
        timestamp: Date.now()
      }
    }));
  };

  // Function to get thread list from cache
  const getCachedThreadList = (section) => {
    const cachedData = threadListCache[section];
    
    if (!cachedData) return null;
    
    // Check if cache is expired
    if (Date.now() - cachedData.timestamp > CACHE_EXPIRATION) {
      // Cache expired, remove it
      const newCache = { ...threadListCache };
      delete newCache[section];
      setThreadListCache(newCache);
      return null;
    }
    
    return cachedData.data;
  };

  // Function to cache insights by section
  const cacheInsights = (section, insightsData) => {
    setInsightsCache(prev => ({
      ...prev,
      [section]: {
        data: insightsData,
        timestamp: Date.now()
      }
    }));
  };

  // Function to get insights from cache
  const getCachedInsights = (section) => {
    const cachedData = insightsCache[section];
    
    if (!cachedData) return null;
    
    // Check if cache is expired
    if (Date.now() - cachedData.timestamp > CACHE_EXPIRATION) {
      // Cache expired, remove it
      const newCache = { ...insightsCache };
      delete newCache[section];
      setInsightsCache(newCache);
      return null;
    }
    
    return cachedData.data;
  };

  // Function to invalidate all cache
  const invalidateCache = () => {
    setThreadCache({});
    setThreadListCache({});
    setInsightsCache({});
  };

  // Function to invalidate a specific thread in cache
  const invalidateThread = (threadId) => {
    const newCache = { ...threadCache };
    delete newCache[threadId];
    setThreadCache(newCache);
  };

  // Function to invalidate thread list cache for a section
  const invalidateThreadList = (section) => {
    const newCache = { ...threadListCache };
    delete newCache[section];
    setThreadListCache(newCache);
  };

  // Function to invalidate insights cache for a section
  const invalidateInsights = (section) => {
    const newCache = { ...insightsCache };
    delete newCache[section];
    setInsightsCache(newCache);
  };

  return (
    <CacheContext.Provider
      value={{
        // Thread functions
        cacheThread,
        getCachedThread,
        invalidateThread,
        // Thread list functions
        cacheThreadList,
        getCachedThreadList,
        invalidateThreadList,
        // Insights functions
        cacheInsights,
        getCachedInsights,
        invalidateInsights,
        // Global functions
        invalidateCache
      }}
    >
      {children}
    </CacheContext.Provider>
  );
}

// Custom hook to use the cache context
export function useCache() {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error('useCache must be used within a CacheProvider');
  }
  return context;
} 