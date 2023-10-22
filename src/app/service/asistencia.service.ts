import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Curso } from '../models/curso';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';
import { Area } from '../models/area';
import { Asistencia } from '../models/asistencia';
import { StorageService } from './storage.service';
import { AsistenciaReduce } from '../models/references/asistencia-reduce';
import { EncabezadoNotasFinales } from '../interface/encabezadoNotasFinales';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public generarAsistenciaPorFecha(idCurso: number): Observable<Asistencia[]> {
    return this.http.get<Asistencia[]>(environment.apiuri + '/asistencia/GenerarAsistencia/' + idCurso);
  }

  public getAreaById(idAsistencia: number): Observable<Asistencia> {
    return this.http.get<Asistencia>(environment.apiuri + '/asistencia/findbyId/' + idAsistencia);
  }

  public saveAsistencia(asistencia: Asistencia): Observable<Asistencia> {
    return this.http.post<Asistencia>(environment.apiuri + '/asistencia/save', asistencia);
  }

  public updateAsistencia(idAsistencia: number, asistencia: Asistencia): Observable<Asistencia> {
    return this.http.put<Asistencia>(environment.apiuri + '/asistencia/actualizar/' + idAsistencia, asistencia);
  }

  public getAsistenciaAntiguasPorFecha(idCurso: number, fecha: String): Observable<Asistencia[]> {
    return this.http.get<Asistencia[]>(environment.apiuri + '/asistencia/obtenerAsistenciaAnteriores/' + idCurso + '/' + fecha);
  }

  public generarAsistenciaPorFecha2(idCurso: number, fecha: String): Observable<Asistencia[]> {
    return this.http.get<Asistencia[]>(environment.apiuri + '/asistencia/GenerarAsistencia2/' + idCurso + '/' + fecha);
  }

  public obtenerAsistenciaFinal(idCurso: number): Observable<AsistenciaReduce[]> {
    return this.http.get<AsistenciaReduce[]>(environment.apiuri + '/asistencia/obtenerAsistenciaFinal/' + idCurso);
  }

}
