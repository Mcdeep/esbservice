import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { IConfigService } from './interfaces';
import {ShareDataService} from './shared.service';
@Injectable()
export class ResponseHandlerService {
  channel: String
  constructor(
    @Inject('APP_CONFIG') config: IConfigService,
    private sdService :ShareDataService
  ) {
    this.channel = config.esbConnectorConfig.channel
  }

  handleResponse(request : Observable < any >, callback) : any {
    
    request.subscribe((res) => {
      //Handle Response
      switch (res.code){
        case '00':
          res["success"] = true;
          callback(res); 
          break;
        case '49': 
          this.sdService.setData({
            code: '49',
            message: 'Session Expired'
          })
          res["success"] = false;
          callback(res);
          break;
        case 'NA': 
          res["success"] = false;
          callback(res);
          break;
        default: 
          res["success"] = false;
          callback(res);
      }
    }, err => {
      console.log(err)
    })
  }
}
