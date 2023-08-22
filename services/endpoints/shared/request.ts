export default function createRequest(BASE_URL: string): 
(method: 'get' | 'post', endpoint: string, data?: any) => Promise<any> {
  return async function request<T>(method: 'get' | 'post', endpoint: string, data?: any): Promise<T> {
    const response = await axios({
      method,
      url: `${BASE_URL}/${endpoint}`,
      data,
    });
    return response.data;
  }
}