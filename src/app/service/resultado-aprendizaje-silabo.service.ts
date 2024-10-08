import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultadoAprendizajeSilabo } from '../models/resultado-aprendizaje-silabo';
import { environment } from 'src/environment/enviroment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ResultadoAprendizajeSilaboService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public listResultadosArendizaje():Observable<ResultadoAprendizajeSilabo[]>{
    return this.http.get<ResultadoAprendizajeSilabo[]>(environment.apiuri+'/resultadoAprendizajeSilabo/listar', { headers: this.storageService.returnToken()});
  }

  public saveResultadosArendizaje(resultadoAprendizajeSilabo: ResultadoAprendizajeSilabo):Observable<ResultadoAprendizajeSilabo>{
    return this.http.post<ResultadoAprendizajeSilabo>(environment.apiuri+'/resultadoAprendizajeSilabo/crear', resultadoAprendizajeSilabo, { headers: this.storageService.returnToken()});
  }

  public getResultadosArendizajeById(id_curso: number):Observable<ResultadoAprendizajeSilabo>{
    return this.http.get<ResultadoAprendizajeSilabo>(environment.apiuri+'/resultadoAprendizajeSilabo/findbyId/'+id_curso, { headers: this.storageService.returnToken()});
  }

  public getResultadosPorIdSilabo(id: number):Observable<ResultadoAprendizajeSilabo[]>{
    return this.http.get<ResultadoAprendizajeSilabo[]>(environment.apiuri+'/resultadoAprendizajeSilaboIdSilabo/findbyId/'+id, { headers: this.storageService.returnToken()});
  }

  public cambiarEstadosResultadosSilaboId(id:number, resultadoAprendizajeSilabo: ResultadoAprendizajeSilabo):Observable<ResultadoAprendizajeSilabo>{
    return this.http.put<ResultadoAprendizajeSilabo>(environment.apiuri+'/resultadoAprendizajeSilabo/actualizar/'+id, resultadoAprendizajeSilabo, { headers: this.storageService.returnToken()});
  }

  public updateEstadosResultados(id:number, resultadoAprendizajeSilabo: ResultadoAprendizajeSilabo):Observable<ResultadoAprendizajeSilabo>{
    return this.http.put<ResultadoAprendizajeSilabo>(environment.apiuri+'/resultadoAprendizajeSilabo/actualizar/'+id, resultadoAprendizajeSilabo, { headers: this.storageService.returnToken()});
  }
}
