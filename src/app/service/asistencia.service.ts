import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Curso } from '../models/curso';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';
import { Area } from '../models/area';
import { Asistencia } from '../models/asistencia';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public generarAsistenciaPorFecha(idCurso: number):Observable<Asistencia[]>{
    return this.http.get<Asistencia[]>(environment.apiuri+'/asistencia/GenerarAsistencia/'+idCurso, { headers: this.storageService.returnToken()});
  }

  public getAreaById(idAsistencia: number):Observable<Asistencia>{
    return this.http.get<Asistencia>(environment.apiuri+'/asistencia/findbyId/'+idAsistencia, { headers: this.storageService.returnToken()});
  }

  public saveAsistencia(asistencia: Asistencia):Observable<Asistencia>{
    return this.http.post<Asistencia>(environment.apiuri+'/asistencia/save', asistencia, { headers: this.storageService.returnToken()});
  }

  public updateAsistencia(idAsistencia: number, asistencia: Asistencia):Observable<Asistencia>{
    return this.http.put<Asistencia>(environment.apiuri+'/asistencia/actualizar/'+idAsistencia, asistencia, { headers: this.storageService.returnToken()});
  }

  public getAsistenciaAntiguasPorFecha(idCurso: number, fecha: String):Observable<Asistencia[]>{
    return this.http.get<Asistencia[]>(environment.apiuri+'/asistencia/obtenerAsistenciaAnteriores/'+idCurso+'/'+fecha, { headers: this.storageService.returnToken()});
  }
}
