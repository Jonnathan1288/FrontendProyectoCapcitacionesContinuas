import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/enviroment';
import { EstrategiasMetodologica } from '../models/estrategias-metodologica';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class EstrategiaMetodologicaService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public listEstrategiasMetodologica():Observable<EstrategiasMetodologica[]>{
    return this.http.get<EstrategiasMetodologica[]>(environment.apiuri+'/estrategiaMetodologica/list');
  }

  public saveEstrategiasMetodologica(estrategiaMetodologica: EstrategiasMetodologica):Observable<EstrategiasMetodologica>{
    return this.http.post<EstrategiasMetodologica>(environment.apiuri+'/strategiaMetodologica/save', estrategiaMetodologica);
  }

  public getEstrategiasMetodologicaById(id: number):Observable<EstrategiasMetodologica>{
    return this.http.get<EstrategiasMetodologica>(environment.apiuri+'/estrategiaMetodologica/findbyId/'+id);
  }

  public getEstrategiasMetodologicaPorIdSilabo(id: number):Observable<EstrategiasMetodologica[]>{
    return this.http.get<EstrategiasMetodologica[]>(environment.apiuri+'/strategiaMetodologicaPorSilabo/findbyId/'+id);
  }

  public updateEstrategiasSilabo(id:number, estrategiaMetodologica: EstrategiasMetodologica):Observable<EstrategiasMetodologica>{
    return this.http.put<EstrategiasMetodologica>(environment.apiuri+'/strategiaMetodologica/update/'+id, estrategiaMetodologica);
  }
  
}
