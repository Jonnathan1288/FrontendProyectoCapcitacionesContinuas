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
  
  public validarExstenciaHojaVida(idUusarioCapacitador: number):Observable<boolean>{
    return this.http.get<boolean>(environment.apiuri+'/hojaVidaCapcitadorValidar/findbyIdUsuario/'+idUusarioCapacitador);
  }

  public guardarHojadeVdaMasDocumento(file: File, idUsuario:number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<any>(environment.apiuri+'/hojaVida/saveDocumento/' + idUsuario,formData);
  }

  public saveHojaDeVida(hojaVidaCapacitador: HojaVidaCapacitador):Observable<HojaVidaCapacitador>{
    return this.http.post<HojaVidaCapacitador>(environment.apiuri+'/hojaVidaCapcitador/crear', hojaVidaCapacitador);
  }


}