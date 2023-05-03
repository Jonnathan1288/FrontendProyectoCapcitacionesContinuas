import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';
import { EvaluacionFinalCurriculares} from '../models/evaluacion-final-curriculares';

@Injectable({
  providedIn: 'root'
})
export class EvaluacionFinalCurricularService {

  constructor(private http: HttpClient) { }

  public listEvaluacionFinalCurricular():Observable<any>{
    return this.http.get<any>(environment.apiuri+'/evaluacionFinalCurricular/list');
  }

  public getEvaluacionFinalCurricularById( idEvaluacionFinalCurricular: number):Observable<EvaluacionFinalCurriculares>{
    return this.http.get<EvaluacionFinalCurriculares>(environment.apiuri+'/evaluacionFinalCurricular/findbyId/'+ idEvaluacionFinalCurricular);
  }

  public saveEvaluacionFinalCurricular(listEvaluacionFinalCurricular: EvaluacionFinalCurriculares):Observable<EvaluacionFinalCurriculares>{
    return this.http.post<EvaluacionFinalCurriculares>(environment.apiuri+'/evaluacionFinalCurricular/save',listEvaluacionFinalCurricular);
  }

  public updateEvaluacionFinalCurricular( idEvaluacionFinalCurricular: number, evaluacionFinalCurricular: EvaluacionFinalCurriculares): Observable<EvaluacionFinalCurriculares> {
    return this.http.put<EvaluacionFinalCurriculares>(`${environment.apiuri}/evaluacionFinalCurricular/update/${ idEvaluacionFinalCurricular}`, evaluacionFinalCurricular);
  }

  public getEvaluacionFinalCurricularPorDisenioById(id: number):Observable<EvaluacionFinalCurriculares[]>{
    return this.http.get<EvaluacionFinalCurriculares[]>(environment.apiuri+'/evaluacionFinalporDisenioCurricular/findbyId/'+id);
  }
  
}
