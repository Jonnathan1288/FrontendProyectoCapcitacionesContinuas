import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';
import { TipoCurso } from '../models/tipo-curso';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TipoCursoService {

  constructor(private http: HttpClient, private storageService: StorageService) { }
  
  public listTipoCurso():Observable<any>{
    return this.http.get<any>(environment.apiuri+'/tipoCurso/list', { headers: this.storageService.returnToken()});
  }

  public getTipoCursoById(idTipoCurso: number):Observable<TipoCurso>{
    return this.http.get<TipoCurso>(environment.apiuri+'/tipoCurso/findbyId/'+idTipoCurso, { headers: this.storageService.returnToken()});
  }

  public saveTipoCurso(tipoCurso: TipoCurso):Observable<TipoCurso>{
    return this.http.post<TipoCurso>(environment.apiuri+'/tipoCurso/save', tipoCurso, { headers: this.storageService.returnToken()});
  }

  public updateTipoCurso(idTipoCurso:number, tipoCurso: TipoCurso):Observable<TipoCurso>{
    return this.http.put<TipoCurso>(environment.apiuri+'/tipoCurso/actualizar/'+idTipoCurso, tipoCurso, { headers: this.storageService.returnToken()});
  }
}
