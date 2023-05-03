import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';
import { Area } from '../models/area';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class OauthService {

  constructor(private http: HttpClient) { }

  public login(username: string, password: string):Observable<Usuario>{
    return this.http.get<Usuario>(environment.apiuri+'/signIn/getaccount/'+username+'/'+password);
  }
}
