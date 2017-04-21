import * as libPhone from 'google-libphonenumber'; 
export function getValidPhoneNumber(msisdn:string, country: string){
  //Checks the Phonenumber and Returns formated number or false when number is invalid
  let PNF = libPhone.PhoneNumberFormat;
  let phoneUtil = libPhone.PhoneNumberUtil.getInstance();
  try{
    let number = phoneUtil.parse(msisdn, country);
    if(phoneUtil.isValidNumber(number)){
      let phoneNumber: String = phoneUtil.format(number, PNF.INTERNATIONAL);
      return phoneNumber.replace(/\+|\s/g, '');
    }else{
      return 'invalid';
    }
   }catch(e){
    return 'invalid';
  }
}