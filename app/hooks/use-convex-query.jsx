import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useConvexQuery = (query, ...args) => {
  const response = useQuery(query, ...args);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (response === undefined) {
      setIsLoading(true);
    } else {
      try {
        setData(response);
        setError(null);
      } catch (error) {
        setError(error);
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  }, [response]);

  return { data, isLoading, error };
};

export const useConvexMutation = (mutataion) => {
  const mutataionFn = useMutation(mutataion);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (...args) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await mutataionFn(...args);
      setData(response);
      setError(null);
      return response;
    } catch (error) {
      setError(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, data, isLoading, error };
};
