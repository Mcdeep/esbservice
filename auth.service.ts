import { Inject, Injectable } from '@angular/core';
import { ConnectorService } from './connector.service';
import { Observable } from 'rxjs/Observable';
import { IConfigService } from './interfaces';
import 'rxjs/add/operator/mergeMap';

import { StorageService } from './storage.service';

@Injectable()
export class AuthService {
  createSessionEndPoint: String;
  serviceEndPoint: String;
  //Inject Connector Service and Local Storage Service
  constructor(private conn : ConnectorService,
   private lsService : StorageService,
   @Inject('APP_CONFIG') config: IConfigService
   ) {
    this.createSessionEndPoint = config.endpoint.createSession;
    this.serviceEndPoint = config.endpoint.service;
  }

  private createSession() {
    //Create Session
    return this
      .conn
      .connect(this.createSessionEndPoint, {})
  }

  userSession ():any {
    return this.lsService.get('token')
    .flatMap((token) => {
      if(token == undefined){
          return new Observable((observer) => {
             observer.next({code: 'NA', message: 'Token Not available'})
             observer.complete()
          })
      }
      return this.conn.connect(this.serviceEndPoint, {})
    })
  }

  requestOtp(Payload) {
    Payload['action'] = 'LOGIN';
    //Request OTP
    return this
      .createSession()
      .flatMap(res => {
        if (res.code == "00" && res.token) {
         return this.lsService.set('token', res.token).flatMap(() => {
               return this.conn.connect(this.serviceEndPoint, Payload)
          });
          //Calling Service For OTP
        } else {
          console.log(res);
        }
      });
  }

  loginUser(Payload) {
    Payload['action'] = 'LOGIN';
    //Login
    return this
      .conn
      .connect(this.serviceEndPoint, Payload);
  }

   reIssuePin(Payload) {
    Payload['action'] = 'REISSUE-PIN-CHANGE';
    //Login
    return this
      .conn
      .connect(this.serviceEndPoint, Payload);
  }
}
