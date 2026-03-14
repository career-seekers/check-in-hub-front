import axios, {
  type AxiosRequestConfig,
  type AxiosResponse,
  isAxiosError,
} from "axios";

import apiConf from "@/api/api.conf";
import type { GenericResponseDto } from "@/api/dto/generic-response.dto";

interface RequestConfig<T> extends AxiosRequestConfig {
  data?: T;
}

class Resolver {
  private readonly endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async request<U, S, T = Record<string, unknown>>(
    url: string,
    method: string,
    data?: U,
    params?: T,
    responseType?: AxiosResponse["request"]["responseType"],
  ): Promise<GenericResponseDto<S>> {
    const fullUrl = `${apiConf.endpoint}/api/v1/${this.endpoint}${url ? `/${url}` : ""}`;

    const config: RequestConfig<U> = {
      url: fullUrl,
      method,
      data,
      params,
      responseType: (responseType || "json") as never,
    };

    try {
      const response: AxiosResponse<GenericResponseDto<S>> = await axios(config);
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return {
          message: error.response?.data.msg
            ? error.response.data.msg
            : error.response?.data
              ? error.response?.data
              : "Network Error",
          status: 500
        };
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(String(error));
    }
  }
}

export default Resolver;