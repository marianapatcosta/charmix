import axios from 'axios';
import { Ref } from 'vue';
import { useState } from '.';
import { HttpMethod, ResponseData } from '@/types';

type useHttpRequestProps = {
  isLoading: Readonly<Ref<boolean>>;
  error: Readonly<Ref<string>>;
  sendRequest: (
    url: string,
    method: HttpMethod,
    headers?: object,
    body?: object
  ) => Promise<ResponseData>;
  clearError: () => void;
};

const useHttpRequest = (): useHttpRequestProps => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const cancelToken = axios.CancelToken;
  const source = cancelToken.source();

  const sendRequest = async (
    url: string,
    method: HttpMethod = HttpMethod.GET,
    headers?: object,
    body?: object
  ): Promise<ResponseData> => {
    setIsLoading(true);

    try {
      const { data: responseData } = await axios({
        url,
        method,
        headers: { ...headers },
        data: body,
        cancelToken: source.token,
      });
      return responseData;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError('');

  return { isLoading, error, sendRequest, clearError };
};

export { useHttpRequest };
