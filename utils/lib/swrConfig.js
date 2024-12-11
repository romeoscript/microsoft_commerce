import { SWRConfig, mutate as swrMutate } from 'swr';
import { client } from '../sanity/client';

// Fetcher function
const fetcher = async (query) => {
  const data = await client.fetch(query);
  return data;
};

// Custom mutate function
const universalMutate = async (query, data, shouldRevalidate = true) => {
  // Manually mutate the cache for the given query
  await swrMutate(query, data, shouldRevalidate);
};

const swrConfig = {
  fetcher,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  shouldRetryOnError: false,
  errorRetryCount: 2,
  // Expose the custom mutate function
  mutate: universalMutate,
};

export const SWRProvider = ({ children }) => (
  <SWRConfig value={swrConfig}>
    {children}
  </SWRConfig>
);
