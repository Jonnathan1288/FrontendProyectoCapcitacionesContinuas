import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rol } from '../models/rol';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/enviroment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public getAllRoleOfDataBase():Observable<Rol[]>{
    return this.http.get<Rol[]>(environment.apiuri+'/rol/listar');
  }

  //PARA PETICIONES PUBLICAS DE VALIDACIONES--------------------------------------------------------------------------

  public getRolById(idRol: number):Observable<Rol>{
    return this.http.get<Rol>(environment.apiUriSecurity+'/rol/findbyId/'+idRol);
  }
}
