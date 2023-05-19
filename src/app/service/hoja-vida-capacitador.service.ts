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

  public getHojaDeVidaById(idHojaVida: number):Observable<HojaVidaCapacitador>{
    return this.http.get<HojaVidaCapacitador>(environment.apiuri+'/hojaVidaCapcitador/findbyId/'+idHojaVida, { headers: this.storageService.returnToken()});
  }

  public getHojaVidaCapacitadorByIdCapacitador(idCapacitador: number):Observable<HojaVidaCapacitador>{
    return this.http.get<HojaVidaCapacitador>(environment.apiuri+'/hojaVidaCapcitador/findbyIdCapacitador/'+idCapacitador, { headers: this.storageService.returnToken()});
  }

  public updateHojaDeVida(idHojadeVida:number, hojaVidaCapacitador: HojaVidaCapacitador):Observable<HojaVidaCapacitador>{
    return this.http.put<HojaVidaCapacitador>(environment.apiuri+'/hojaVidaCapcitador/update/'+idHojadeVida, hojaVidaCapacitador, { headers: this.storageService.returnToken()});
  }

  public getHojadeVidaByIdUsuarioLoggin(idUsuario: number):Observable<HojaVidaCapacitador>{
    return this.http.get<HojaVidaCapacitador>(environment.apiuri+'/hojaVidaCapcitador/findbyCapacitdorUsuarioId/'+idUsuario, { headers: this.storageService.returnToken()});
  }
  
  public validarExstenciaHojaVida(idUusarioCapacitador: number):Observable<boolean>{
    return this.http.get<boolean>(environment.apiuri+'/hojaVidaCapcitadorValidar/findbyIdUsuario/'+idUusarioCapacitador, { headers: this.storageService.returnToken()});
  }

  public guardarHojadeVdaMasDocumento(file: File, idUsuario:number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<any>(environment.apiuri+'/hojaVida/saveDocumento/' + idUsuario,formData, { headers: this.storageService.returnToken()});
  }

  public actualizarHojadeVdaMasDocumento(file: File, idUsuario:number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<any>(environment.apiuri+'/hojaVida/updateDocumento/' + idUsuario,formData, { headers: this.storageService.returnToken()});
  }


  public saveHojaDeVida(hojaVidaCapacitador: HojaVidaCapacitador):Observable<HojaVidaCapacitador>{
    return this.http.post<HojaVidaCapacitador>(environment.apiuri+'/hojaVidaCapcitador/crear', hojaVidaCapacitador, { headers: this.storageService.returnToken()});
  }


}