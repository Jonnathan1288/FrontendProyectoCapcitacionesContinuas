import { HttpClient, HttpParams } from '@angular/common/http';
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

  public listUsuario(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(environment.apiuri + '/usuario/list');
  }

  public getUsuarioById(idUsuario: number): Observable<Usuario> {
    return this.http.get<Usuario>(environment.apiuri + '/usuario/findOne/' + idUsuario);
  }

  public updateUsuario(idUsusario: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(environment.apiuri + '/usuario/actualizar/' + idUsusario, usuario);
  }

  //PARA PETICIONES PUBLICAS DE VALIDACIONES--------------------------------------------------------------------------

  public saveUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(environment.apiUriSecurity + '/register', usuario);
  }

  public getExistUsuarioByUsername(username: string): Observable<boolean> {
    return this.http.get<boolean>(environment.apiUriSecurity + '/usuario/existsbyUsername/' + username);
  }

  //------------------------------------------------------------------------------NUEVOS
  public findByAllPaginator(page: number, size: number, sort: string[]): Observable<Usuario[]> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort.join(','))
    console.log(params);
    return this.http.get<Usuario[]>(environment.apiuri + '/usuario/pageable', { params });
  }

  public updatePictureUser(id: number, picture: string): Observable<number> {
    return this.http.put<number>(environment.apiuri + '/usuario/updatePictureUser/' + id + '/' + picture, {});

  }
}
