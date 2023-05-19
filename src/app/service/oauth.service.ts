import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';
import { Area } from '../models/area';
import { UserLogin } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})


export class OauthService {

  constructor(private http: HttpClient) { }

  public login(user: UserLogin):Observable<UserLogin>{


    return this.http.post<UserLogin>(environment.apiUriSecurity+'/login', user);
  }
}


