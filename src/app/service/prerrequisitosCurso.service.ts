import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';
import { PrerequisitoCurso } from '../models/prerequisito-curso';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class PrerrequisitosCursoService {

  constructor(private http: HttpClient, private storageService: StorageService) { }
  
  public listPrerequisitoCurso():Observable<any>{
    return this.http.get<any>(environment.apiuri+'/prerequisitoCurso/list', { headers: this.storageService.returnToken()});
  }

  public listPrerequisitoCursoByIdCurso(idPrerequisitoCurso: number):Observable<any>{
    return this.http.get<any>(environment.apiuri+'/prerequisitoCurso/findbyIdCurso/'+idPrerequisitoCurso, { headers: this.storageService.returnToken()});
  }

  public getPrerequisitoCursoById(idPrerequisito: number):Observable<PrerequisitoCurso>{
    return this.http.get<PrerequisitoCurso>(environment.apiuri+'/prerequisitoCurso/findbyId/'+idPrerequisito, { headers: this.storageService.returnToken()});
  }

  public savePrerequisitoCurso(prerequisitoCurso: PrerequisitoCurso):Observable<PrerequisitoCurso>{
    return this.http.post<PrerequisitoCurso>(environment.apiuri+'/prerequisitoCurso/save', prerequisitoCurso, { headers: this.storageService.returnToken()});
  }

  public updatePrerequisitoCurso(idPrerequisitoCurso:number, prerequisitoCurso: PrerequisitoCurso):Observable<PrerequisitoCurso>{
    return this.http.put<PrerequisitoCurso>(environment.apiuri+'/prerequisitoCurso/actualizar/'+idPrerequisitoCurso, prerequisitoCurso, { headers: this.storageService.returnToken()});
  }

  public getPrerequisitoPropiosCurso(idCurso: number):Observable<PrerequisitoCurso[]>{
    return this.http.get<PrerequisitoCurso[]>(environment.apiuri+'/prerequisitoCurso/findbyIdCurso/'+idCurso, { headers: this.storageService.returnToken()});
  }

}
