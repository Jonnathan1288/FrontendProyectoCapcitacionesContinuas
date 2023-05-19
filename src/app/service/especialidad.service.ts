import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Curso } from '../models/curso';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';
import { Especialidad } from '../models/especialidad';
import { StorageService } from './storage.service';
@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public listEspecialidad():Observable<Especialidad[]>{
    return this.http.get<Especialidad[]>(environment.apiuri+'/especialidad/list', { headers: this.storageService.returnToken()});
  }

  public getEspecialidadById(id_curso: number):Observable<Especialidad>{
    return this.http.get<Especialidad>(environment.apiuri+'/especialidad/findbyId/'+id_curso, { headers: this.storageService.returnToken()});
  }

  public saveEspecialidad(curso: Curso):Observable<Especialidad>{
    return this.http.post<Especialidad>(environment.apiuri+'/especialidad/save', curso, { headers: this.storageService.returnToken()});
  }

  public getespecialidadByIdArea(idArea: number):Observable<Especialidad[]>{
    return this.http.get<Especialidad[]>(environment.apiuri+'/especialidad/findbyIdArea/'+idArea, { headers: this.storageService.returnToken()});
  }
  
}
