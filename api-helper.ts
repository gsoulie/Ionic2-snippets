import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment, SERVER_URL } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiHelperService {
  private _url: string;

  constructor(private http: HttpClient) {
    this._url = SERVER_URL;
  }

  /**
   * Manage HTTP queries
   * @param action : api endpoint action
   * @param method : http pethod
   * @param datas : data payload
   **/
  requestApi({action, method = 'GET', datas = {}}:
  { action: string, method?: string, datas?: any }): Promise<any> {
    const methodWanted = method.toLowerCase();
    const urlToUse = this.url + action;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };

    let req = null;

    switch (methodWanted) {
      case 'post' :
        req = this.http.post(urlToUse, datas, httpOptions);
        break;
      case 'put' :
        req = this.http.put(urlToUse, datas, httpOptions);
        break;
      case 'delete' :
        req = this.http.delete(urlToUse, httpOptions);
        break;
      default:
        req = this.http.get(urlToUse, httpOptions);
        break;
    }

    return req // Return observable by default
            .toPromise(); // wich can be converted to promise
  }

  get url(): string {
    return this._url;
  }
}
