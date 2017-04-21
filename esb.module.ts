import { ModuleWithProviders, NgModule }      from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CommonModule }  from '@angular/common';
import { Storage } from "@ionic/storage";
import { ConnectorService } from './connector.service';
import { AuthService } from './auth.service';
import { ResponseHandlerService } from './response-handler.service';
import { AccountsService } from './accounts.service';
import { StorageService } from './storage.service';
import { TransactionService } from './transaction.service';
import { ShareDataService } from './shared.service'
import { IConfigService } from './interfaces'
import { MoneyFormat } from './money.pipe';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ MoneyFormat ],
  providers:    [ConnectorService, TransactionService, AccountsService, AuthService, Storage, StorageService, ResponseHandlerService,ShareDataService ]
})
export class ESBModule {
  static withConfig (userConfig: IConfigService): ModuleWithProviders{
    return {
      ngModule: ESBModule,
      providers: [
        { provide: 'APP_CONFIG', useValue: userConfig }
      ]
    }
  }
}