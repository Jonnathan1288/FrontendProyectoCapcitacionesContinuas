import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HojaVidaCapacitador } from '../models/hoja-vida-capacitador';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class HojaVidaCapacitadorService {

  constructor(private http: HttpClient) { }

  public getHojaDeVidaById(idHojaVida: number):Observable<HojaVidaCapacitador>{
    return this.http.get<HojaVidaCapacitador>(environment.apiuri+'/hojaVidaCapcitador/findbyId/'+idHojaVida);
  }

  public getHojaVidaCapacitadorByIdCapacitador(idCapacitador: number):Observable<HojaVidaCapacitador>{
    return this.http.get<HojaVidaCapacitador>(environment.apiuri+'/hojaVidaCapcitador/findbyIdCapacitador/'+idCapacitador);
  }

  public updateHojaDeVida(idHojadeVida:number, hojaVidaCapacitador: HojaVidaCapacitador):Observable<HojaVidaCapacitador>{
    return this.http.put<HojaVidaCapacitador>(environment.apiuri+'/hojaVidaCapcitador/update/'+idHojadeVida, hojaVidaCapacitador);
  }

  public getHojadeVidaByIdUsuarioLoggin(idUsuario: number):Observable<HojaVidaCapacitador>{
    return this.http.get<HojaVidaCapacitador>(environment.apiuri+'/hojaVidaCapcitador/findbyCapacitdorUsuarioId/'+idUsuario);
  }

}
