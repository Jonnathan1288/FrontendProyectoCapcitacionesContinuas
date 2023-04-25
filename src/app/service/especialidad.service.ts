import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Curso } from '../models/curso';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';
import { Especialidad } from '../models/especialidad';
@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {

  constructor(private http: HttpClient) { }

  public listEspecialidad():Observable<Especialidad[]>{
    return this.http.get<Especialidad[]>(environment.apiuri+'/especialidad/list');
  }

  public getEspecialidadById(id_curso: number):Observable<Especialidad>{
    return this.http.get<Especialidad>(environment.apiuri+'/especialidad/findbyId/'+id_curso);
  }

  public saveEspecialidad(curso: Curso):Observable<Especialidad>{
    return this.http.post<Especialidad>(environment.apiuri+'/especialidad/save', curso);
  }

  
}
