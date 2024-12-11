import useSWR from 'swr';
import { client } from "@/utils/sanity/client";

const fetcher = async (query) => {
  const data = await client.fetch(query);
  return data;
};

export const useServiceFees = () => {
  const { data, error, mutate } = useSWR(
    `*[_type == "serviceFee"]`,
    fetcher
  );

  return {
    serviceFees: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};
