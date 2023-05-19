import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/enviroment';
import { CambiarPasswordDTO } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class RecuperarService {

  constructor(private http: HttpClient) { }

  public sendCorreoRecuperacion(identificacion:String):Observable<any>{
    return this.http.get<any>(environment.apiUriSecurity+'/email/sendRecuperacionPassword/' + identificacion);
  }


  public cambiarContraseña(resetUser: CambiarPasswordDTO):Observable<CambiarPasswordDTO>{
    return this.http.post<CambiarPasswordDTO>(environment.apiUriSecurity+'/cambiarContraseniaUsuario', resetUser);
  }


}