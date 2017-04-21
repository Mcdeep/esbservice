export interface TransactionType {
  name : String,
  group : String,
  code : String,
  group_position : Number
}

export interface IConfigService {
  ESBConnectorUrl : String;
  esbConnectorConfig :  {
    application: String,
    channel: String,
    organizationID: String
  };
  endpoint : {
    createSession: String,
    service: String,
    transaction: String
  };
}