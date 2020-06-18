import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiHelperService {
  private _url: string;

  constructor(private http: HttpClient) {
    this._url = 'https://serveur-demo.blabla.fr';
  }

  // Manage HTTP Quesries
  requestApi({action, method = 'GET', datas = {}}:
  { action: string, method?: string, datas?: any }): Promise<any> {
    const methodWanted = method.toLowerCase();
    const urlToUse = this.url + action;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
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

    return req // Il renvoie un observable
            .toPromise(); // Que l'on convertit en promesse
  }

  get url(): string {
    return this._url;
  }
}
