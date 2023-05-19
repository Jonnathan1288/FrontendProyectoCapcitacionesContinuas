import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';
import { Area } from '../models/area';
import { UserLogin, Usuario } from '../models/usuario';


//Import de fireAuth
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from '@firebase/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})


export class OauthService {

  constructor(private http: HttpClient, private auth: AngularFireAuth, private router: Router) { }

  public login(user: UserLogin):Observable<UserLogin>{
    return this.http.post<UserLogin>(environment.apiUriSecurity+'/login', user);
  }

  public getUsuarioByIdentificacion(identificacion: String):Observable<Usuario>{
    return this.http.get<Usuario>(environment.apiuri+'/usuario/findbyCedula/' + identificacion);
  }


  //PARA GOOGLE
  public authLogin(provider: any) {
    return this.auth.signInWithPopup(provider)
  }

  async logOut(){
    this.auth.signOut();
  }


}


