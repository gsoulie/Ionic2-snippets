*api-message.model.ts*
````typescript
import { Constructor } from "@angular/material/core/common-behaviors/constructor";

export abstract class ApiMessage {
  public fromHub = false;
  loadFromJson(json: object): this {
    Object.keys(json).forEach(key => {
      if (this.hasOwnProperty(key)) {
        this[key] = json[key];
      }
    });
    return this;
  }
  mapForServer(): object {
    return this as object;
  }
  public constructor() {}
}

export function createApiMessageInstance<T extends ApiMessage>(c: Constructor<T>): T {
  return new c();
}
````

*http-client-extended.ts*
````typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import { ConfigurationProvider } from '../../config';
import { ApiMessage, createApiMessageInstance } from '../../models/api-message.model';
import { map } from 'rxjs/operators';
import { Constructor } from '@angular/material/core/common-behaviors/constructor';

@Injectable({
  providedIn: 'root',
})
export class HttpClientExtended {

  constructor(
    protected http: HttpClient, 
    protected config: ConfigurationProvider,
    protected logger: NGXLogger) { }

  // public mapFromServer<T extends ApiMessage>(c: Constructor<T>) {
  //   return map((json: T) => { 
  //     return createApiMessageInstance(c).loadFromJson(json);
  //   });
  // }
  
  public mapFromServer<T extends ApiMessage>(c: Constructor<T>) {
    return map((json: T) => { 
      if (json) {
        return createApiMessageInstance(c).loadFromJson(json);
      } else {
        return undefined;
      }
    });
  }

  // public mapArrayFromServer<T extends ApiMessage>(c: Constructor<T>) {
  //   return map((jsonList: T[]) => { 
  //     return jsonList.map(jsonItem => createApiMessageInstance(c).loadFromJson(jsonItem));
  //   });
  // }
  
  public mapArrayFromServer<T extends ApiMessage>(c: Constructor<T>) {
    return map((jsonList: T[]) => { 
      if (jsonList) {
        return jsonList.map(jsonItem => createApiMessageInstance(c).loadFromJson(jsonItem));
      } else {
        return undefined;
      }
    });
  }

  public get(url: string, options?: any): Observable<object> {
    return this.http.get(url, options);
  }

  public getData<T extends ApiMessage>(c: Constructor<T>, url: string, options?: any): Observable<T> {
    const obsResult$ = this.get(url, options);
    return obsResult$.pipe(
      this.mapFromServer(c)
    );
  }
  
  // public getMultipleData<T extends ApiMessage>(c: Constructor<T>, url: string, options?: any): Observable<T[]> {
  //   const obsResult$ = this.get(url, options);
  //   return obsResult$.pipe(
  //     this.mapArrayFromServer(c)
  //   );
  // }
  
  public getMultipleData<T extends ApiMessage>(c: Constructor<T>, url: string, withShareReplay: boolean = true, options?: any): Observable<T[]> {
    const obsResult$ = this.get(url, options);
    let returnValue$ =  obsResult$.pipe(
      this.mapArrayFromServer(c)
    );
    if (withShareReplay) {
      returnValue$ = returnValue$.pipe(
        shareReplay({
          bufferSize: 1,
          refCount: true
        })
      );
    }
    return returnValue$;
  }
    
  public post(url: string, data?: any): Observable<object> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const dataSerialized = JSON.stringify(data);
    return this.http.post(url, dataSerialized, {headers: headers});
  }

  // public postData<T extends ApiMessage>(c: Constructor<T>, url: string, data?: T): Observable<T> {
  //   const obsResult$ = this.post(url, data?.mapForServer());
  //   return obsResult$.pipe(
  //     this.mapFromServer(c)
  //   );    
  // }
  public postData<T extends ApiMessage>(c: Constructor<T>, url: string, data?: T | any): Observable<T> {
    let param = data;
    if (param instanceof ApiMessage) {
      param = param?.mapForServer();
    }
    const obsResult$ = this.post(url, param);
    return obsResult$.pipe(
      this.mapFromServer(c)
    );    
  }

  // public postMultipleData<T extends ApiMessage>(c: Constructor<T>, url: string, data?: T[]): Observable<T[]> {
  //   const obsResult$ = this.post(url, data?.map(d => d.mapForServer()));
  //   return obsResult$.pipe(
  //     this.mapArrayFromServer(c)
  //   );    
  // }
  
  public postMultipleData<T extends ApiMessage>(c: Constructor<T>, url: string, data?: T[] | any): Observable<T[]> {
    let param = data;
    if (param && Array.isArray(param) && param.length > 0) {
      if (param[0] instanceof ApiMessage) {
        param = param.map(d => d.mapForServer());
      }
    }
    const obsResult$ = this.post(url, param);
    return obsResult$.pipe(
      this.mapArrayFromServer(c)
    );    
  }
  
  public delete(url: string): Observable<object> {
    return this.http.delete(url);
  }

  public deleteData<T extends ApiMessage>(c: Constructor<T>, url: string): Observable<T> {
    const obsResult$ = this.delete(url);
    return obsResult$.pipe(
      this.mapFromServer(c)
    );    
  }

  public deleteMultipleData<T extends ApiMessage>(c: Constructor<T>, url: string): Observable<T[]> {
    const obsResult$ = this.delete(url);
    return obsResult$.pipe(
      this.mapArrayFromServer(c)
    );    
  }

  public getFromAuthApi(path: string, options?: any): Observable<any> {
    const suffix = (this.config.params.authJwtApiOnGateway) ? '' : '/api';
    return this.get(this.config.params.authJwtApi + suffix + path, options);
  }

  public postToAuthApi(path: string, data?: any): Observable<object> {
    const suffix = (this.config.params.authJwtApiOnGateway) ? '' : '/api';
    return this.post(this.config.params.authJwtApi + suffix + path, data);
  }
}
````
