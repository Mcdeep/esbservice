import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Observable} from 'rxjs/Observable';
import {fromPromise} from 'rxjs/observable/fromPromise';

@Injectable()
export class StorageService {

  constructor(public storage : Storage) {}

  public set(key : string, value : any) {
    return fromPromise(this.storage.set(key, JSON.stringify(value)))
  }

  public get(key : string) {
    return fromPromise(this.storage.get(key)).map(res => JSON.parse(res))
  }

  public remove(key : string, value : any) : void {
    if(key && value) {
      this
        .storage
        .remove(key)
        .then(() => {
          console.log("successfully removed:", key);
        })
    }
  }

}
