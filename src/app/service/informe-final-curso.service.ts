import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Curso } from '../models/curso';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';
import { InformeFinalCurso } from '../models/informe-final-curso';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class InformeFinalCursoService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  // public obtenerHorarioCurso():Observable<HorarioCurso[]>{
  //   return this.http.get<HorarioCurso[]>(environment.apiuri+'/horarioCurso/listar');
  // }

  public getInformeFinalCursoById(idInformeFinalC: number):Observable<InformeFinalCurso>{
    return this.http.get<InformeFinalCurso>(environment.apiuri+'/informeFinalCurso/findbyId/'+idInformeFinalC);
  }

  public getInformeFinalCursoByIdCurso(idCurso: number):Observable<InformeFinalCurso>{
    return this.http.get<InformeFinalCurso>(environment.apiuri+'/informeFinalCurso/findbyIdCurso/'+idCurso);
  }

  public saveInformeFinalCurso(informeFinalCurso: InformeFinalCurso):Observable<InformeFinalCurso>{
    return this.http.post<InformeFinalCurso>(environment.apiuri+'/informeFinalCurso/crear', informeFinalCurso);
  }

  public updateInformeFinalCurso(idInformeFinalC:number, informeFinalCurso: InformeFinalCurso):Observable<InformeFinalCurso>{
    return this.http.put<InformeFinalCurso>(environment.apiuri+'/informeFinalCurso/update/'+idInformeFinalC, informeFinalCurso);
  }
}
