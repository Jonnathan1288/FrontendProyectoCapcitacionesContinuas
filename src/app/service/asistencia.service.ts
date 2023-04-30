import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Curso } from '../models/curso';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';
import { Area } from '../models/area';
import { Asistencia } from '../models/asistencia';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {

  constructor(private http: HttpClient) { }

  public generarAsistenciaPorFecha(idCurso: number):Observable<any>{
    return this.http.get<any>(environment.apiuri+'/asistencia/GenerarAsistencia/'+idCurso);
  }

  public getAreaById(idAsistencia: number):Observable<Asistencia>{
    return this.http.get<Asistencia>(environment.apiuri+'/asistencia/findbyId/'+idAsistencia);
  }

  public saveAsistencia(asistencia: Asistencia):Observable<Asistencia>{
    return this.http.post<Asistencia>(environment.apiuri+'/asistencia/save', asistencia);
  }

  public updateAsistencia(idAsistencia: number, asistencia: Asistencia):Observable<Asistencia>{
    return this.http.put<Asistencia>(environment.apiuri+'/asistencia/actualizar/'+idAsistencia, asistencia);
  }
}
