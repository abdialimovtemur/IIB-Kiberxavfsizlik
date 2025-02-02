import { useQuery, useMutation, useQueryClient, QueryKey } from "@tanstack/react-query";
import axios, { AxiosRequestConfig } from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

interface AxiosRequestProps {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  params?: Record<string, any>;
  headers?: AxiosRequestConfig["headers"];
}

interface QueryProps {
  key: QueryKey;
  url: string;
  params?: Record<string, any>;
  headers?: AxiosRequestConfig["headers"];
  enabled?: boolean;
}

interface MutationProps {
  url: string;
  method: "POST" | "PUT" | "DELETE";
  onSuccess?: () => void;
}

export const useAxiosQuery = () => {
  const queryClient = useQueryClient();

  const axiosRequest = async ({ url, method = "GET", body, params, headers }: AxiosRequestProps) => {
    const response = await axios({
      url: `${baseUrl}${url}`,
      method,
      data: body,
      params,
      headers,
    });
    return response.data;
  };

  const query = ({ key, url, params, headers, enabled = true }: QueryProps) => {
    return useQuery({
      queryKey: key,
      queryFn: () => axiosRequest({ url, method: "GET", params, headers }),
      enabled,
    });
  };

  const mutation = ({ url, method, onSuccess }: MutationProps) => {
    return useMutation({
      mutationFn: (body: any) => axiosRequest({ url, method, body }),
      onSuccess: () => {
        queryClient.invalidateQueries();
        if (onSuccess) onSuccess();
      },
    });
  };

  return { query, mutation };
};
