import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notas } from '../models/notas';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class NotasService {

  constructor(private http: HttpClient) { }

  public listNotas():Observable<Notas>{
    return this.http.get<any>(environment.apiuri+'/notas/listar');
  }

  public getNotasById(idNota: number):Observable<Notas>{
    return this.http.get<Notas>(environment.apiuri+'/notas/findbyId/'+idNota);
  }

  public saveNotas(notas: Notas):Observable<Notas>{
    return this.http.post<Notas>(environment.apiuri+'/notas/crear', notas);
  }

  public updateNotas(idNota:number, notas: Notas):Observable<Notas>{
    return this.http.put<Notas>(environment.apiuri+'/notas/actualizar/'+idNota, notas);
  }

  public getParticipantesFinales(idNota: number):Observable<Notas[]>{
    return this.http.get<Notas[]>(environment.apiuri+'/notas/findbyIdMatriculado/'+idNota);
  }

}
