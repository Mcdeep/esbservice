import { Injectable, ReflectiveInjector } from '@angular/core';
import { StorageService } from './storage.service';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { TransactionType } from './interfaces';
import { TransactionService } from './transaction.service';
import { ResponseHandlerService} from './response-handler.service'
import * as _ from 'underscore';

export class Account {
  _id : string;
  accountNumber : String;
  accountName : String;
  currency: any;
  balance: {
    Available: Number,
    Current: Number
  };
  accountType : {
    name: String,
    type: String,
    system_default: Boolean,
    status: String
  }
  trans_types?: [ TransactionType ]
  loading:boolean;

  constructor (AccountDetails: any) {
    this._id = AccountDetails._id;
    this.accountNumber = AccountDetails.accountNumber;
    this.accountName = AccountDetails.accountName;
    if(AccountDetails.balance){
       this.balance = {
          Available: (AccountDetails.balance.Available != 0) ? AccountDetails.balance.Available : 0,
          Current: (AccountDetails.balance.Current != 0) ? AccountDetails.balance.Current : 0
        };
    }else{
      this.balance = {
          Available: 0,
          Current: 0
        }; 
    }

    let tempName: String;
    let tempType: String;
    let splitAccountName = false;

    if(AccountDetails.accountType.name.split('-').length > 1)
    {
      splitAccountName = true;
      tempType = AccountDetails.accountType.name.split('-')[0];
      tempName = AccountDetails.accountType.name.split('-')[1];
    }
   
    this.accountType = {
      name: splitAccountName? tempName : AccountDetails.accountType.name ,
      type: splitAccountName? tempType : AccountDetails.accountType.type ,
      system_default: AccountDetails.accountType.system_default,
      status: AccountDetails.accountType.status
    };
    this.currency = AccountDetails.currency;
    this.trans_types = ( AccountDetails.product) ? AccountDetails.product.tran_types : AccountDetails.trans_types;
    this.loading = false;
  }  

  getTransactionType (Transaction_Type: String, group: boolean = false) {
    // Get Transaction Type by name or group
    let T_Type: any;
    let Found = false;
    if(name){
      T_Type = _.find(this.trans_types, {group: Transaction_Type});
    }else{
      T_Type = _.find(this.trans_types, {name: Transaction_Type});
    }
    return (T_Type == undefined) ? {code:"NA", message: "Trasaction Code Not Found in Account"} : T_Type
  }
}

@Injectable()
export class AccountsService {

  constructor(private lsService : StorageService, private txService: TransactionService,private rsHandler : ResponseHandlerService) {}

  updateBalance (account: Account) {
    var Payload = {
      agentid: 'normalCustomer'
    };
    account.loading = true;
    this.rsHandler.handleResponse(this.txService.processTransaction(account, 'BALANCE', Payload), (res) => {
      if(res.success){
        if(res.data.amountArray){
          account.balance = {
            Available: parseFloat(res.data.amountArray[0].balance),
            Current: parseFloat(res.data.amountArray[1].balance)
          }
        }
      }else{
        console.log('Couldn\'t Get Balance');
      }
      account.loading = false;
    });
  }

  storeAccounts(Accounts : [Account]) {
    if (Accounts.length !== 0) {
      this
        .lsService
        .set('accounts', Accounts).subscribe(()=>{
        });
    }
  }

  getAllowedAccounts(TranType: String, Accounts:[Account]):any{
    console.log('What', Accounts)
    let FilteredAccounts : any[] = [];
    if(Accounts.length > 0){
      Accounts.forEach(acc => {
        if(_.findIndex(acc.trans_types, {name: TranType}) !== -1){
          FilteredAccounts.push(acc)
        }
      })  
    }else{
      return {
        code : 'NA', message: 'No Accounts'
      }
    }

    return FilteredAccounts;
  }
  getAccounts():any {
    return this
      .lsService
      .get('accounts').map((res) => {
        if(res !== null) {
          return res.map((acc) => {
            return new Account(acc)
          })
        } else {
          return {
            code : 'NA', message: 'No Accounts'
          }
        }
      })
  }
}
