import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/enviroment';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  public listUsuario():Observable<any>{
    return this.http.get<any>(environment.apiuri+'/usuario/listar');
  }

  public getUsuarioById(idUsuario: number):Observable<Usuario>{
    return this.http.get<Usuario>(environment.apiuri+'/usuario/findbyId/'+idUsuario);
  }

  public saveUsuario(usuario: Usuario):Observable<Usuario>{
    return this.http.post<Usuario>(environment.apiuri+'/usuario/crear', usuario);
  }

  public updateUsuario(idUsusario:number, usuario: Usuario):Observable<Usuario>{
    return this.http.put<Usuario>(environment.apiuri+'/usuario/actualizar/'+idUsusario, usuario);
  }
}
