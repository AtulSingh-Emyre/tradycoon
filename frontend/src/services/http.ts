import _axios, {AxiosRequestConfig} from 'axios';
import {getEnvVariable} from '../environment';
import {ToastAndroid} from 'react-native';

export class Http {
  private static axios = _axios.create({
    baseURL: getEnvVariable().base_api_url,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  static async get(url: string, config?: AxiosRequestConfig) {
    const response = await Http.axios.get(url, config);
    if (response) {
      // console.log(
      //   url + '..............' + '.........' + JSON.stringify(response.data),
      // );
      if (response.data.success) return response.data;
      else {
        throw new Error(response.data.message);
      }
    }
  }

  static async head(url: string, config?: AxiosRequestConfig) {
    const response = await Http.axios.get(url, config);
    if (response) {
      // console.log(
      //   url + '..............' + '.........' + JSON.stringify(response.data),
      // );

      if (response.data.success) return response.data;
      else {
        throw new Error(response.data.message);
      }
    }
  }

  static async delete(url: string, body?: object, config?: AxiosRequestConfig) {
    const response = await Http.axios.delete(url, config);
    if (response) {
      // console.log(
      //   url +
      //     '..............' +
      //     JSON.stringify(body) +
      //     '.........' +
      //     JSON.stringify(response.data),
      // );

      if (response.data.success) return response.data;
      else {
        throw new Error(response.data.message);
      }
    }
  }

  static async post(url: string, body?: object, config?: AxiosRequestConfig) {
    const response = await Http.axios.post(url, body, config);
    if (response) {
      // console.log(
      //   url +
      //     '..............' +
      //     JSON.stringify(body) +
      //     '.........' +
      //     JSON.stringify(response.data),
      // );

      if (response.data.success) return response.data;
      else {
        throw new Error(response.data.message);
      }
    }
  }

  static async put(url: string, body?: object, config?: AxiosRequestConfig) {
    const response = await Http.axios.put(url, body, config);
    if (response) {
      // console.log(
      //   url +
      //     '..............' +
      //     JSON.stringify(body) +
      //     '.........' +
      //     JSON.stringify(response.data),
      // );

      if (response.data.success) return response.data;
      else {
        throw new Error(response.data.message);
      }
    }
  }

  static async patch(url: string, body?: object, config?: AxiosRequestConfig) {
    const response = await Http.axios.patch(url, body, config);
    if (response) {
      // console.log(
      //   url +
      //     '..............' +
      //     JSON.stringify(body) +
      //     '.........' +
      //     JSON.stringify(response.data),
      // );

      if (response.data.success) return response.data;
      else {
        throw new Error(response.data.message);
      }
    }
  }

  public static handleErrors(error: any) {
    if (error.response) {
      const message = error.response.data.message;
      const errorMessage = message
        ? message
        : 'Something Went Wrong. Please Try Again';
      ToastAndroid.show(errorMessage, ToastAndroid.LONG);
    } else {
      ToastAndroid.show(
        'Something Went Wrong.Please Try Again',
        ToastAndroid.LONG,
      );
    }
  }
}
