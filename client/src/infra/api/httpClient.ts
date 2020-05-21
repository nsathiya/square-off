import axios, { AxiosResponse } from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:9000/api'
});

export async function post(path: string, body: {}): Promise<any> {
  try {
    const response: AxiosResponse = await axiosInstance.post(path, body);
    const message: any = response.data.message;
    return message;
  } catch (e) {
    console.log(`Error encountered during api call for POST ${path}`, e);
    throw e;
  }
}

export async function get(path: string): Promise<any> {
  try {
    const response: AxiosResponse = await axiosInstance.get(path);
    const message: any = response.data.message;
    return message;
  } catch (e) {
    console.log(`Error encountered during api call for GET ${path}`, e);
    throw e;
  }
}
