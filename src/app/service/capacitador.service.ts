import { Injectable } from '@angular/core';
import { Capacitador } from '../models/capacitador';
import { environment } from 'src/environment/enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CapacitadorService {

  constructor(private http: HttpClient) { }
  public getCapacitadorById(idCapacitador: number):Observable<Capacitador>{
    return this.http.get<Capacitador>(environment.apiuri+'/capacitador/findbyId/'+idCapacitador);
  }
}
