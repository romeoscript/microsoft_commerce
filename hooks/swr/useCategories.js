import useSWR from 'swr';
import { client } from "@/utils/sanity/client";

// Define a fetcher function that SWR will use to fetch data
const fetcher = async (query) => {
  const data = await client.fetch(query);
  return data;
};
const query = `*[_type == "category"] {
    _id,
    title,
    description,
    active,
    "dishCount": count(*[_type == "dish" && references(^._id)])
  }`;
// Create a custom hook to fetch categories
export const useCategories = () => {
  const { data, error, mutate } = useSWR(
    `*[_type == "category"] {
      _id,
      title,
      description,
      active,
      "dishCount": count(*[_type == "dish" && references(^._id)])
    }`,
    fetcher
  );

  return {
    categories: data,
    isLoading: !error && !data,
    isError: error,
    mutate, // Allows for manual revalidation
    query
  };
};
