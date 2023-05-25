import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/enviroment';
import { Usuario } from '../models/usuario';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public listUsuario():Observable<Usuario[]>{
    return this.http.get<Usuario[]>(environment.apiuri+'/usuario/listar', { headers: this.storageService.returnToken()});
  }

  public getUsuarioById(idUsuario: number):Observable<Usuario>{
    return this.http.get<Usuario>(environment.apiuri+'/usuario/findbyId/'+idUsuario, { headers: this.storageService.returnToken()});
  }

  public updateUsuario(idUsusario:number, usuario: Usuario):Observable<Usuario>{
    return this.http.put<Usuario>(environment.apiuri+'/usuario/actualizar/'+idUsusario, usuario, { headers: this.storageService.returnToken()});
  }

  //PARA PETICIONES PUBLICAS DE VALIDACIONES--------------------------------------------------------------------------

  public saveUsuario(usuario: Usuario):Observable<Usuario>{
    return this.http.post<Usuario>(environment.apiUriSecurity+'/register', usuario);
  }

  public getExistUsuarioByUsername(username: string):Observable<boolean>{
    return this.http.get<boolean>(environment.apiUriSecurity+'/usuario/existsbyUsername/'+username);
  }
}
