import {Inject, Injectable} from '@angular/core';
import {ConnectorService} from './connector.service';
import {Account} from './accounts.service';
import {TransactionType, IConfigService} from './interfaces'

@Injectable()
export class TransactionService {

  private endPoint: String;
  constructor(
    private csService: ConnectorService,
    @Inject('APP_CONFIG') config: IConfigService
  ) {

    this.setEndPoint(config.endpoint.transaction);
  }

  private setEndPoint (endpoint): void {
    this.endPoint = endpoint;
  }


  processTransaction(Account: Account, TransType:String , Payload: any) {
    // Prepare Transaction 
    const t_type: TransactionType = Account.getTransactionType(TransType);
    Payload["account"] = Account.accountNumber;
    Payload["trans_type"] = t_type.code;
    // Call ESB Connect
    return this.csService.connect(this.endPoint, Payload)
  }

  validateTransaction () {

  }

  resposeHandler() {}
}
