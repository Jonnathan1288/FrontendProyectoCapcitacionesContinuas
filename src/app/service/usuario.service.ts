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

  public listUsuario():Observable<Usuario[]>{
    return this.http.get<Usuario[]>(environment.apiuri+'/usuario/listar');
  }

  public getUsuarioById(idUsuario: number):Observable<Usuario>{
    return this.http.get<Usuario>(environment.apiuri+'/usuario/findbyId/'+idUsuario);
  }

  public getExistUsuarioByUsername(username: string):Observable<boolean>{
    return this.http.get<boolean>(environment.apiuri+'/usuario/existsbyUsername/'+username);
  }

  public saveUsuario(usuario: Usuario):Observable<Usuario>{
    return this.http.post<Usuario>(environment.apiuri+'/usuario/crear', usuario);
  }

  public updateUsuario(idUsusario:number, usuario: Usuario):Observable<Usuario>{
    return this.http.put<Usuario>(environment.apiuri+'/usuario/actualizar/'+idUsusario, usuario);
  }
}
