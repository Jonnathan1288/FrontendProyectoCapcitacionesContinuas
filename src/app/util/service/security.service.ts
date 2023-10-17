import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  private claveEncriptacion: string = '3202-ista-capcitacionesCE';
  private claveFirma: string = '3202-ista-capcitacionesCF';

  constructor() { }

  public encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, this.claveEncriptacion).toString();
  }

  public decrypt(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, this.claveEncriptacion);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  public generateHash(text: string): string {
    return CryptoJS.HmacSHA256(text, this.claveFirma).toString();
  }

  public verifyHash(text: string, hash: string): boolean {
    const generatedHash = this.generateHash(text);
    return generatedHash === hash;
  }
}
