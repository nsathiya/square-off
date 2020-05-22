import axios, { AxiosResponse } from 'axios';

const baseURL = process.env.NODE_ENV === 'production'
? 'https://square-off-backend.onrender.com'
: 'http://localhost:9000';

const axiosInstance = axios.create({
  baseURL: baseURL + '/api'
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
