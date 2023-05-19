import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environment/enviroment';
import { Observable } from 'rxjs';
import { ListaNecesidadCurso } from '../models/lista-necesidad-curso';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ListaNecesidadCursoService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public listListaNecesidadCurso():Observable<ListaNecesidadCurso[]>{
    return this.http.get<ListaNecesidadCurso[]>(environment.apiuri+'/listaNecesidadCurso/list', { headers: this.storageService.returnToken()});
  }

  public findByNecesidadCurso_IdNecesidadCurso(idPrograma: number):Observable<any>{
    return this.http.get<any>(environment.apiuri+'/listaNecesidadCurso/findbyIdNecesidad/'+idPrograma, { headers: this.storageService.returnToken()});
  }

  public saveListaNecesidadCurso(listaNecesidadCurso: ListaNecesidadCurso):Observable<ListaNecesidadCurso>{
    return this.http.post<ListaNecesidadCurso>(environment.apiuri+'/listaNecesidadCurso/save', listaNecesidadCurso, { headers: this.storageService.returnToken()});
  }

  public getListaNecesidadCursoById(idListNecesidadC: number):Observable<ListaNecesidadCurso>{
    return this.http.get<ListaNecesidadCurso>(environment.apiuri+'/listaNecesidadCurso/findbyId/'+idListNecesidadC, { headers: this.storageService.returnToken()});
  }
  
  public updateListaNecesidadCurso(idListaNecesidadCurso:number, listaNecesidadCurso: ListaNecesidadCurso):Observable<ListaNecesidadCurso>{
    return this.http.put<ListaNecesidadCurso>(environment.apiuri+'/listaNecesidadCurso/actualizar/'+idListaNecesidadCurso, listaNecesidadCurso, { headers: this.storageService.returnToken()});
  }

}
