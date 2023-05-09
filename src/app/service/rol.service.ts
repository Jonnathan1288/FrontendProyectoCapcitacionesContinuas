import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rol } from '../models/rol';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  constructor(private http: HttpClient) { }

  public getRolById(idRol: number):Observable<Rol>{
    return this.http.get<Rol>(environment.apiuri+'/rol/findbyId/'+idRol);
  }

  public getAllRoleOfDataBase():Observable<Rol[]>{
    return this.http.get<Rol[]>(environment.apiuri+'/rol/listar');
  }
}
