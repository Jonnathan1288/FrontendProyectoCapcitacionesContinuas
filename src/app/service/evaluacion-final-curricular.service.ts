import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';
import { EvaluacionFinalCurriculares} from '../models/evaluacion-final-curriculares';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class EvaluacionFinalCurricularService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public listEvaluacionFinalCurricular():Observable<any>{
    return this.http.get<any>(environment.apiuri+'/evaluacionFinalCurricular/list', { headers: this.storageService.returnToken()});
  }

  public getEvaluacionFinalCurricularById( idEvaluacionFinalCurricular: number):Observable<EvaluacionFinalCurriculares>{
    return this.http.get<EvaluacionFinalCurriculares>(environment.apiuri+'/evaluacionFinalCurricular/findbyId/'+ idEvaluacionFinalCurricular, { headers: this.storageService.returnToken()});
  }

  public saveEvaluacionFinalCurricular(listEvaluacionFinalCurricular: EvaluacionFinalCurriculares):Observable<EvaluacionFinalCurriculares>{
    return this.http.post<EvaluacionFinalCurriculares>(environment.apiuri+'/evaluacionFinalCurricular/save',listEvaluacionFinalCurricular, { headers: this.storageService.returnToken()});
  }

  public updateEvaluacionFinalCurricular( idEvaluacionFinalCurricular: number, evaluacionFinalCurricular: EvaluacionFinalCurriculares): Observable<EvaluacionFinalCurriculares> {
    return this.http.put<EvaluacionFinalCurriculares>(`${environment.apiuri}/evaluacionFinalCurricular/update/${ idEvaluacionFinalCurricular}`, evaluacionFinalCurricular, { headers: this.storageService.returnToken()});
  }

  public updateEvaluacionFinalCurricularEstadoId( idEvaluacionFinalCurricular: number, evaluacionFinalCurricular: EvaluacionFinalCurriculares): Observable<EvaluacionFinalCurriculares> {
    return this.http.put<EvaluacionFinalCurriculares>(`${environment.apiuri}/evaluacionFinalCurricular/update/${ idEvaluacionFinalCurricular}`, evaluacionFinalCurricular, { headers: this.storageService.returnToken()});
  }
  public getEvaluacionFinalCurricularPorDisenioById(id: number):Observable<EvaluacionFinalCurriculares[]>{
    return this.http.get<EvaluacionFinalCurriculares[]>(environment.apiuri+'/evaluacionFinalporDisenioCurricular/findbyId/'+id, { headers: this.storageService.returnToken()});
  }
  
}