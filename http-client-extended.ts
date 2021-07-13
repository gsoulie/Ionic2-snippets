import { Injectable, NgModule } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpHandler, HttpRequest } from '@angular/common/http';
import { HashTable } from 'angular-hashtable';
import { String } from 'typescript-string-operations';
import { environment } from 'src/environments/environment';
import { catchError, filter, take, switchMap } from 'rxjs/operators';

/** USAGE

fetchItems(): Observable<Item[]> {
    const endpoint = '/myendpoint';

    return this.http.get(
      `${endpoint}`)
    .pipe(
      map((jsonArray: Object[]) =>
        jsonArray.map((jsonItem) =>
          createApiMessageInstance(Item).loadFromJson(jsonItem)
        )
      )
    );
  }

  fetchItemDetail(id: number): Observable<Item> {
    const endpoint = `/myendpoint/${id}`;
    return this.http.get(endpoint)
    .pipe(map((jsonItem) => createApiMessageInstance(Item).loadFromJson(jsonItem)));
  }


**/


@Injectable({
  providedIn: 'root',
})
export class HttpClientExtended {
  public isConnected = false;

  constructor(protected http: HttpClient) { }

  public get(url: string, options?: any): Observable<Object> {
    const obsResult = this.http.get(url, options);
    return obsResult;
  }

  public getFromExampleApi(path: string, options?: any): Observable<any> {
    return this.get(environment.exampleApi + path, options);
  }

  public getFromAuthApi(path: string, options?: any): Observable<any> {
    return this.get(environment.authJwtApi + path, options);
  }

  public post<T>(url: string, data: any): Observable<T> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const dataSerialized = JSON.stringify(data);
    const obsResult = this.http.post<T>(url, dataSerialized, {headers: headers});
    return obsResult;
  }

  public postToExampleApi<T>(path: string, data: any): Observable<T> {
    return this.post<T>(environment.exampleApi + path, data);
  }

  public postMultipartFormToExampleApi<T>(path: string, data: any): Observable<T> {
    const obsResult = this.http.post<T>(environment.exampleApi + path, data);
    return obsResult;
  }

  public postToAuthApi<T>(path: string, data?: any): Observable<T> {
    return this.post<T>(environment.authJwtApi + path, data);
  }
}
