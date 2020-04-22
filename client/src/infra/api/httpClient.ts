import axios, { AxiosResponse } from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:9000/api'
});

export async function post(path: string, body: {}): Promise<any> {
  const response: AxiosResponse = await axiosInstance.post(path, body);
  const message: any = response.data.message;
  return message;
}

export async function get(path: string): Promise<any> {
  const response: AxiosResponse = await axiosInstance.get(path);
  const message: any = response.data.message;
  return message;
}
