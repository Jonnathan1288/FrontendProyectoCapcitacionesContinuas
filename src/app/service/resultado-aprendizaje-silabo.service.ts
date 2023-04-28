import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultadoAprendizajeSilabo } from '../models/resultado-aprendizaje-silabo';
import { environment } from 'src/environment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ResultadoAprendizajeSilaboService {

  constructor(private http: HttpClient) { }

  public listResultadosArendizaje():Observable<ResultadoAprendizajeSilabo[]>{
    return this.http.get<ResultadoAprendizajeSilabo[]>(environment.apiuri+'/resultadoAprendizajeSilabo/listar');
  }

  public saveResultadosArendizaje(resultadoAprendizajeSilabo: ResultadoAprendizajeSilabo):Observable<ResultadoAprendizajeSilabo>{
    return this.http.post<ResultadoAprendizajeSilabo>(environment.apiuri+'/resultadoAprendizajeSilabo/crear', resultadoAprendizajeSilabo);
  }

  public getResultadosArendizajeById(id_curso: number):Observable<ResultadoAprendizajeSilabo>{
    return this.http.get<ResultadoAprendizajeSilabo>(environment.apiuri+'/resultadoAprendizajeSilabo/findbyId/'+id_curso);
  }

  public getResultadosPorIdSilabo(id: number):Observable<ResultadoAprendizajeSilabo[]>{
    return this.http.get<ResultadoAprendizajeSilabo[]>(environment.apiuri+'/resultadoAprendizajeSilaboIdSilabo/findbyId/'+id);
  }

  public cambiarEstadosResultadosSilaboId(id:number, resultadoAprendizajeSilabo: ResultadoAprendizajeSilabo):Observable<ResultadoAprendizajeSilabo>{
    return this.http.put<ResultadoAprendizajeSilabo>(environment.apiuri+'/resultadoAprendizajeSilabo/actualizar/'+id, resultadoAprendizajeSilabo);
  }

  public updateEstadosResultados(id:number, resultadoAprendizajeSilabo: ResultadoAprendizajeSilabo):Observable<ResultadoAprendizajeSilabo>{
    return this.http.put<ResultadoAprendizajeSilabo>(environment.apiuri+'/resultadoAprendizajeSilabo/actualizar/'+id, resultadoAprendizajeSilabo);
  }
}
