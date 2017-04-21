import { Inject, Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { StorageService } from './storage.service';
import { IConfigService } from './interfaces';
import 'rxjs/add/operator/map';
import * as _ from 'underscore';

@Injectable()
export class ConnectorService {

  esbConnectorConfig: any;
  esbBaseUrl: String;
  endPoint: String;

  constructor (
    private http: Http,
    private lsService: StorageService,
    @Inject('APP_CONFIG') config: IConfigService ) { 

    this.esbBaseUrl = config.ESBConnectorUrl;
    this.esbConnectorConfig = config.esbConnectorConfig;
  }


  connect (url, payload):any {
    return this.lsService.get('token')
    .flatMap((res) => {
      return this.http.post(this.setUri(url), this.prepareData(payload), this.sessionInformation(res)).map(res => res.json())  
    })
  }

  sessionInformation (token) : RequestOptions {
    //Session Information
    let headerObject = {
      'Content-Type': 'application/json',
    };
    
    if (token !== null) {
      headerObject['x-access-token'] = token;
    }

    let headers = new Headers(headerObject);
    return new RequestOptions({ headers: headers });
  }

  prepareData (payload): any {
    let data = {}
    //Set Payload object;
    if (!_.isEmpty(payload)) {
        _.extend(data, payload)
    }
    _.extend(data, this.esbConnectorConfig);
    return data;
  }

  setUri (url): string {
    //External Resouce/ 
    let resource;
    if (url.split(':').length > 1){
      resource = url;
    } else {
      resource = this.esbBaseUrl + url;
    }
    return resource;
  }
}
