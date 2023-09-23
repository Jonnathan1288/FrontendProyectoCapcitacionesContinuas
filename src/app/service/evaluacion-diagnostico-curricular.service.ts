import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';
import { EvaluacionDiagnosticaCurriculares } from '../models/evaluacion-diagnostica-curriculares';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class EvaluacionDiagnosticoCurricularService {

    
  constructor(private http: HttpClient, private storageService: StorageService) { }

  public listEvaluacionDiagnosticoCurricular():Observable<any>{
    return this.http.get<any>(environment.apiuri+'/evaluacionDiacnosticaCurricular/list');
  }

  public getEvaluacionDiagnosticoCurricularById(idEvaluacionDiagnosticaCurricular: number):Observable<EvaluacionDiagnosticaCurriculares>{
    return this.http.get<EvaluacionDiagnosticaCurriculares>(environment.apiuri+'/evaluacionDiacnosticaCurricular/findbyId/'+ idEvaluacionDiagnosticaCurricular);
  }

  public saveEvaluacionDiagnosticoCurricular(listDisenioCurricular: EvaluacionDiagnosticaCurriculares):Observable<EvaluacionDiagnosticaCurriculares>{
    return this.http.post<EvaluacionDiagnosticaCurriculares>(environment.apiuri+'/evaluacionDiacnosticaCurricular/save',listDisenioCurricular);
  }

  public cambiarEstadosEvaluacioDiagnosticaDisenioCurricularId(id:number, evaluacionDiacnosticaCurricular: EvaluacionDiagnosticaCurriculares):Observable<EvaluacionDiagnosticaCurriculares>{
    return this.http.put<EvaluacionDiagnosticaCurriculares>(environment.apiuri+'/evaluacionDiacnosticaCurricular/actualizar/'+id, evaluacionDiacnosticaCurricular);
  }

  public  updateEvaluacionDiagnosticaCurricular(id:number, evaluacionDiacnosticaCurricular: EvaluacionDiagnosticaCurriculares):Observable< EvaluacionDiagnosticaCurriculares>{
    return this.http.put< EvaluacionDiagnosticaCurriculares>(environment.apiuri+'/evaluacionDiacnosticaCurricular/actualizar/'+id,evaluacionDiacnosticaCurricular);
  }
  public getEvaluacionDiagnosticaCurricularPorDisenioById(id: number):Observable<EvaluacionDiagnosticaCurriculares[]>{
    return this.http.get<EvaluacionDiagnosticaCurriculares[]>(environment.apiuri+'/evaluacionDiacnosticaCurricular/evaluacionDiagnosticaporDisenioCurricular/findbyId/'+id);
  }
  
}