import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HojaVidaCapacitador } from '../models/hoja-vida-capacitador';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/enviroment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class HojaVidaCapacitadorService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public getHojaDeVidaById(idHojaVida: number): Observable<HojaVidaCapacitador> {
    return this.http.get<HojaVidaCapacitador>(environment.apiuri + '/hojaVidaCapcitador/findbyId/' + idHojaVida);
  }

  public getHojaVidaCapacitadorByIdCapacitador(idCapacitador: number): Observable<HojaVidaCapacitador> {
    return this.http.get<HojaVidaCapacitador>(environment.apiuri + '/hojaVidaCapcitador/findbyIdCapacitador/' + idCapacitador);
  }

  public update(idHojadeVida: number, hojaVidaCapacitador: HojaVidaCapacitador): Observable<HojaVidaCapacitador> {
    return this.http.put<HojaVidaCapacitador>(environment.apiuri + '/update/' + idHojadeVida, hojaVidaCapacitador);
  }

  public getHojadeVidaByIdUsuarioLoggin(idUsuario: number): Observable<HojaVidaCapacitador> {
    return this.http.get<HojaVidaCapacitador>(environment.apiuri + '/hojaVidaCapcitador/findbyCapacitdorUsuarioId/' + idUsuario);
  }

  public save(hojaVidaCapacitador: HojaVidaCapacitador): Observable<HojaVidaCapacitador> {
    return this.http.post<HojaVidaCapacitador>(environment.apiuri + '/save', hojaVidaCapacitador);
  }

  public findDocumentByIdUsuario(idUsuario: number): Observable<any> {
    return this.http.get<any>(environment.apiuri + '/findDocumentByIdUsuario/' + idUsuario);
  }


}