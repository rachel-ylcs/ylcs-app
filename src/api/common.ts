import Toast from 'react-native-simple-toast';

let lastShowTime = 0;

function showError(error: unknown) {
    if (!__DEV__) {
        if (Date.now() - lastShowTime > 1000) {
            Toast.show('无法连接至服务器，请检查网络连接', Toast.SHORT);
            lastShowTime = Date.now();
        }
    } else {
        Toast.show(`请求出错: ${error}`, Toast.LONG);
    }
}

export type RequestOptions = RequestInit & Record<string, any>;

export interface ClientOptions<T> {
    headers?: Record<string, string>;
    beforeRequest?: (url: string, data: Record<string, any>, options: RequestOptions) => boolean;
    afterResponse?: (response: Response) => Promise<T> | T;
    onError?: (error: unknown) => void;
    throwError?: boolean;
}

export function createHttpClient<T>(baseUrl: string, options: ClientOptions<T>) {
    return {
        async get(url: string, params: Record<string, any> = {}, init?: RequestOptions) {
            try {
                init = {
                    method: 'GET',
                    ...init,
                    headers: {
                        ...options.headers,
                        ...init?.headers,
                    },
                };
                if (options.beforeRequest && !options.beforeRequest?.(url, params, init)) {
                    return;
                }
                let query = Object.keys(params).length > 0 ? '?' + new URLSearchParams(params).toString() : '';
                let response = await fetch(`${baseUrl}${url}${query}`, init);
                return await options.afterResponse?.(response) as T ?? response;
            } catch (error) {
                showError(error);
                options.onError?.(error);
                if (options.throwError) {
                    throw error;
                }
            }
        },

        async post(url: string, data: Record<string, any> = {}, init?: RequestOptions) {
            try {
                init = {
                    method: 'POST',
                    ...init,
                    headers: {
                        'Content-Type': 'application/json',
                        ...options.headers,
                        ...init?.headers,
                    },
                    body: JSON.stringify(data),
                };
                if (options.beforeRequest && !options.beforeRequest?.(url, data, init)) {
                    return;
                }
                let response = await fetch(`${baseUrl}${url}`, init);
                return await options.afterResponse?.(response) as T ?? response;
            } catch (error) {
                showError(error);
                options.onError?.(error);
                if (options.throwError) {
                    throw error;
                }
            }
        },

        async postForm(url: string, data: Record<string, any> = {}, init?: RequestOptions) {
            try {
                let formData = new FormData();
                for (let key in data) {
                    formData.append(key, data[key]);
                }
                init = {
                    method: 'POST',
                    ...init,
                    headers: {
                        ...options.headers,
                        ...init?.headers,
                    },
                    body: formData,
                };
                if (options.beforeRequest && !options.beforeRequest?.(url, data, init)) {
                    return;
                }
                let response = await fetch(`${baseUrl}${url}`, init);
                return await options.afterResponse?.(response) as T ?? response;
            } catch (error) {
                showError(error);
                options.onError?.(error);
                if (options.throwError) {
                    throw error;
                }
            }
        },
    };
}
