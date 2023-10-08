import { Injectable } from '@angular/core';
import { LocalStorageKeys, clearLocalStorage, getTokenTime } from '../local-storage-manager';
import { TimeOut } from '../model/time-out';
import { TokenData } from 'src/app/interface/token-data';
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class TimeOutTokenService {

  public timeOut = new TimeOut();

  constructor() { }

  public getTimeOutToken(): TimeOut {
    const token = getTokenTime(LocalStorageKeys.TOKEN)!;

    if (!token) return this.timeOut;

    const tokenTimeInSeconds = this.getTokenTime(token);

    this.timeOut.totalSeconds = tokenTimeInSeconds;
    this.timeOut.hour = Math.floor(tokenTimeInSeconds / 3600);
    const remainingSeconds = tokenTimeInSeconds % 3600;
    this.timeOut.minute = Math.floor(remainingSeconds / 60);
    this.timeOut.second = remainingSeconds % 60;
    return this.timeOut;
  }

  private getTokenTime(token: string): number {
    const decodedToken: TokenData = jwt_decode(token);
    const currentTime: number = Math.floor(Date.now() / 1000);

    return decodedToken.exp - currentTime;
  }
}
