import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';
import { PrerequisitoCurso } from '../models/prerequisito-curso';

@Injectable({
  providedIn: 'root'
})
export class PrerrequisitosCursoService {

  constructor(private http: HttpClient) { }
  
  public listPrerequisitoCurso():Observable<any>{
    return this.http.get<any>(environment.apiuri+'/prerequisitoCurso/list');
  }

  public getPrerequisitoCursoById(idMivelCurso: number):Observable<PrerequisitoCurso>{
    return this.http.get<PrerequisitoCurso>(environment.apiuri+'/prerequisitoCurso/findbyId/'+idMivelCurso);
  }

  public savePrerequisitoCurso(prerequisitoCurso: PrerequisitoCurso):Observable<PrerequisitoCurso>{
    return this.http.post<PrerequisitoCurso>(environment.apiuri+'/prerequisitoCurso/save', prerequisitoCurso);
  }

  public updatePrerequisitoCurso(idPrerequisitoCurso:number, prerequisitoCurso: PrerequisitoCurso):Observable<PrerequisitoCurso>{
    return this.http.put<PrerequisitoCurso>(environment.apiuri+'/prerequisitoCurso/actualizar/'+idPrerequisitoCurso, prerequisitoCurso);
  }

  public getPrerequisitoPropiosCurso(idCurso: number):Observable<PrerequisitoCurso[]>{
    return this.http.get<PrerequisitoCurso[]>(environment.apiuri+'/prerequisitoCurso/findbyIdCurso/'+idCurso);
  }

}
