import {Injectable} from '@angular/core';
import {Subject, Observable} from 'rxjs/Rx';

@Injectable()
export class ShareDataService {
  private dataService = new Subject<any>();

  data$ = this.dataService.asObservable();
  data : any;

  setData(data: any) {
    console.log('Setting Service');
    this.dataService.next(data);
  }
}