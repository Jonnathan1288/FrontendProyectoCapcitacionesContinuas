import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';
import { Area } from '../models/area';
import { RegistroFotograficoCurso } from '../models/registro-fotografico-curso';
import { StorageService } from './storage.service';
@Injectable({
  providedIn: 'root'
})
export class RegistroFotograficoCursoService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public getRegistroFotograficoCursoById(idRegistroFotografico: number):Observable<RegistroFotograficoCurso>{
    return this.http.get<RegistroFotograficoCurso>(environment.apiuri+'/registroFotograficoCurso/findbyId/'+idRegistroFotografico);
  }

  public getRegistroFotograficoCursoAllByIdCurso(idCurso: number):Observable<RegistroFotograficoCurso[]>{
    return this.http.get<RegistroFotograficoCurso[]>(environment.apiuri+'/registroFotograficoCurso/traerTodosfindbyIdCurso/'+idCurso);
  }

  public saveRegistroFotograficoCurso(registroFotografico: RegistroFotograficoCurso):Observable<RegistroFotograficoCurso>{
    return this.http.post<RegistroFotograficoCurso>(environment.apiuri+'/registroFotograficoCurso/crear', registroFotografico);
  }

  public updateRegistroFotografico(idRegistroFotografico: number, registroFotografico: RegistroFotograficoCurso):Observable<RegistroFotograficoCurso>{
    return this.http.put<RegistroFotograficoCurso>(environment.apiuri+'/registroFotograficoCurso/actualizar/'+idRegistroFotografico, registroFotografico);
  }
}
