import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';
import {EvalucionFormativaCurriculares} from '../models/evalucion-formativa-curriculares';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class EvaluacionFormativaCurricularService {
  constructor(private http: HttpClient, private storageService: StorageService) { }

  public listEvaluacionormativaCurricular():Observable<any>{
    return this.http.get<any>(environment.apiuri+'/evaluacionFormativaCurricular/list', { headers: this.storageService.returnToken()});
  }

  public getEvaluacionFormativaCurricularById(  idEvalucionFormativaCurricular: number):Observable<EvalucionFormativaCurriculares>{
    return this.http.get<EvalucionFormativaCurriculares>(environment.apiuri+'/evaluacionFormativaCurricular/findbyId/'+ idEvalucionFormativaCurricular, { headers: this.storageService.returnToken()});
  }

  public saveEvaluacionFormativaCurricular(listEvaluacionFormativaCurricular: EvalucionFormativaCurriculares):Observable<EvalucionFormativaCurriculares>{
    return this.http.post<EvalucionFormativaCurriculares>(environment.apiuri+'/evaluacionFormativaCurricular/save',listEvaluacionFormativaCurricular, { headers: this.storageService.returnToken()});
  }

  public updateEvaluacionFormativaCurricular(  idEvalucionFormativaCurricular: number, evaluacionFormativaCurricular: EvalucionFormativaCurriculares): Observable<EvalucionFormativaCurriculares> {
    return this.http.put<EvalucionFormativaCurriculares>(`${environment.apiuri}/evaluacionFormativaCurricular/update/${  idEvalucionFormativaCurricular}`, evaluacionFormativaCurricular, { headers: this.storageService.returnToken()});
  }
  public updateEvaluacionFormativaCurricularEstadoId(  idEvalucionFormativaCurricular: number, evaluacionFormativaCurricular: EvalucionFormativaCurriculares): Observable<EvalucionFormativaCurriculares> {
    return this.http.put<EvalucionFormativaCurriculares>(`${environment.apiuri}/evaluacionFormativaCurricular/update/${  idEvalucionFormativaCurricular}`, evaluacionFormativaCurricular, { headers: this.storageService.returnToken()});
  }
  public getEvaluacionFormativaCurricularPorDisenioById(id: number):Observable<EvalucionFormativaCurriculares[]>{
    return this.http.get<EvalucionFormativaCurriculares[]>(environment.apiuri+'/evaluacionFormativaporDisenioCurricular/findbyId/'+id, { headers: this.storageService.returnToken()});
  }
  
  
}