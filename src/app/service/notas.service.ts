import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notas } from '../models/notas';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/enviroment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class NotasService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public listNotas():Observable<Notas>{
    return this.http.get<any>(environment.apiuri+'/notas/listar', { headers: this.storageService.returnToken()});
  }

  public getNotasById(idNota: number):Observable<Notas>{
    return this.http.get<Notas>(environment.apiuri+'/notas/findbyId/'+idNota, { headers: this.storageService.returnToken()});
  }

  public saveNotas(notas: Notas):Observable<Notas>{
    return this.http.post<Notas>(environment.apiuri+'/notas/crear', notas, { headers: this.storageService.returnToken()});
  }

  public updateNotas(idNota:number, notas: Notas):Observable<Notas>{
    return this.http.put<Notas>(environment.apiuri+'/notas/actualizar/'+idNota, notas, { headers: this.storageService.returnToken()});
  }

  public getParticipantesFinales(idNota: number):Observable<Notas[]>{
    return this.http.get<Notas[]>(environment.apiuri+'/notas/findbyIdMatriculado/'+idNota, { headers: this.storageService.returnToken()});
  }

  public validarExistenciaDatos(idCurso: number){
    return this.http.get<boolean>(environment.apiuri+'/validarExistenciNotas/findbyIdCurso/'+idCurso, { headers: this.storageService.returnToken()});
  }

}
