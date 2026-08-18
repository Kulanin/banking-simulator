import { useState, useCallback } from "react";
import { PathUtils_BuildBackEndServerUrl } from "../utils/pathUtils";

type RequestOptionProps = {
  method?: "POST" | "GET" | "DELETE" | "PATCH" | "PUT";
  querydata?: Record<string, any>; 
  authorization?: boolean;
  idempotencyKey?:string;
};

function useFetch(loadingState = false) {
  const [data, setData] = useState<any>(null); 
  const [loading, setLoading] = useState(loadingState);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const isError = error !== null;
  const isSuccess = message !== "";
  const getFetchResponse = isSuccess || isError;

  const resetMessageErrorStatuses = useCallback(() => {
    setMessage("");
    setError(null);
  }, []);

  const customFetchData = useCallback(async (
    p_Url: string,
    p_Options: RequestOptionProps = {},
    p_b_AwaitResults = false
  ) => {
    const token: string | null = localStorage.getItem("accessToken");
    const { method = "POST", querydata = {}, authorization = false, idempotencyKey = false } = p_Options;

    let requestOptions: RequestInit = {
      method,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json", 
        ...(authorization && token ? { Authorization: `Bearer ${token}` } : {}),
         ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
      },
      credentials: "include",
    };

    if (method !== "GET") {
      requestOptions.body = JSON.stringify(querydata);
    }

    setLoading(true);
    setError(null);
    setMessage("");

    const url = PathUtils_BuildBackEndServerUrl(p_Url)

    try {
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error ${response.status}`);
      }

      const results = await response.json();

      if (results.code !== 0) {
        if (results.message) {
          setError(results.message);
        }
        return results;
      }

      const extractedData = results.data?.result ?? results;

      if (p_b_AwaitResults) {
        return extractedData;
      } else {
        setData(extractedData);
        if (results.message) {
          setMessage(results.message);
        }
      }

      return results;
    } catch (err: any) {
      const errMsg = err.message || "An unexpected error occurred";
      setError(errMsg);
      throw err; 
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshDB = useCallback((p_Url: string, p_Options: RequestOptionProps) => {
    return customFetchData(p_Url, p_Options);
  }, [customFetchData]);

  return {
    data,
    loading,
    error,
    message,
    customFetchData,
    refreshDB,
    isError,        
    isSuccess,      
    getFetchResponse,
    resetMessageErrorStatuses,
    setLoading,
  };
}

export default useFetch;
