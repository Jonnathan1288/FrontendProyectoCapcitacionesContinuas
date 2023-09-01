import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';
import { NivelCurso } from '../models/nivel-curso';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class NivelCursoService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public listNivelCurso():Observable<any>{
    return this.http.get<any>(environment.apiuri+'/nivelCurso/list');
  }

  public getNivelCursoById(idMivelCurso: number):Observable<NivelCurso>{
    return this.http.get<NivelCurso>(environment.apiuri+'/nivelCurso/findbyId/'+idMivelCurso);
  }

  public saveNivelCurso(NivelCurso: NivelCurso):Observable<NivelCurso>{
    return this.http.post<NivelCurso>(environment.apiuri+'/nivelCurso/save', NivelCurso);
  }

  public updateNivelCurso(idNivelCurso:number, NivelCurso: NivelCurso):Observable<NivelCurso>{
    return this.http.put<NivelCurso>(environment.apiuri+'/nivelCurso/actualizar/'+idNivelCurso, NivelCurso);
  }

}
