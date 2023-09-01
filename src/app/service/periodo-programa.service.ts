import { Injectable } from '@angular/core';
import { environment } from 'src/environment/enviroment';
import { ParticipantesMatriculados } from '../models/participantesMatriculados';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PeriodoPrograma } from '../models/periodo-programa';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class PeriodoProgramaService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public getlistPeriodoPrograma():Observable<PeriodoPrograma[]>{
    return this.http.get<PeriodoPrograma[]>(environment.apiuri+'/periodoPrograma/list');
  }

  public savePeriodoPrograma(periodoPrograma: PeriodoPrograma):Observable<PeriodoPrograma>{
    return this.http.post<PeriodoPrograma>(environment.apiuri+'/periodoPrograma/save', periodoPrograma);
  }

  public getPeriodoProgramaById(idPeriodoPrograma: number):Observable<PeriodoPrograma>{
    return this.http.get<PeriodoPrograma>(environment.apiuri+'/periodoPrograma/findbyId/'+idPeriodoPrograma);
  }

  public updatePeriodoPrograma(idPeriodoPrograma:number, periodoPrograma: PeriodoPrograma):Observable<PeriodoPrograma>{
    return this.http.put<PeriodoPrograma>(environment.apiuri+'/periodoPrograma/actualizar/'+idPeriodoPrograma, periodoPrograma);
  }
}
