import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';
import { EntornoAprendizajeCurricular} from '../models/entorno-aprendizaje-curricular';

@Injectable({
  providedIn: 'root'
})
export class EntornoAprendizajeService {

  constructor(private http: HttpClient) { }

  public listEntornoAprendizajeCurricular():Observable<any>{
    return this.http.get<any>(environment.apiuri+'/entornoAprendizajeCurricular/list');
  }

  public getEntornoAprendizajeCurricularById(idEntornoCurricular: number):Observable<EntornoAprendizajeCurricular>{
    return this.http.get<EntornoAprendizajeCurricular>(environment.apiuri+'/entornoAprendizajeCurricular/findbyId/'+  idEntornoCurricular);
  }

  public saveEntornoAprendizajeCurricular(listEvaluacionFinalCurricular: EntornoAprendizajeCurricular):Observable<EntornoAprendizajeCurricular>{
    return this.http.post<EntornoAprendizajeCurricular>(environment.apiuri+'/entornoAprendizajeCurricular/save',listEvaluacionFinalCurricular);
  }

 
  public cambiarEstadosEntornoAprendizajeSilaboId(id:number, entornoAprendizajeCurricular: EntornoAprendizajeCurricular):Observable<EntornoAprendizajeCurricular>{
    return this.http.put<EntornoAprendizajeCurricular>(environment.apiuri+'/entornoAprendizajeCurricular/update/'+id, entornoAprendizajeCurricular);
  }

  public  updateEntornoAprendizajeCurricular(id:number, entornoAprendizajeCurricular: EntornoAprendizajeCurricular):Observable<EntornoAprendizajeCurricular>{
    return this.http.put<EntornoAprendizajeCurricular>(environment.apiuri+'/entornoAprendizajeCurricular/update/'+id,entornoAprendizajeCurricular);
  }
  public getEntornoAprendizajePorDisenioById(id: number):Observable<EntornoAprendizajeCurricular[]>{
    return this.http.get<EntornoAprendizajeCurricular[]>(environment.apiuri+'/entornoAprendizajeporDisenioCurricular/findbyId/'+id);
  }
}
