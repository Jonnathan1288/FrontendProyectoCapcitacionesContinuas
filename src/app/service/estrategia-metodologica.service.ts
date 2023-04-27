import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/enviroment';
import { EstrategiasMetodologica } from '../models/estrategias-metodologica';

@Injectable({
  providedIn: 'root'
})
export class EstrategiaMetodologicaService {

  constructor(private http: HttpClient) { }

  public listEstrategiasMetodologica():Observable<EstrategiasMetodologica[]>{
    return this.http.get<EstrategiasMetodologica[]>(environment.apiuri+'/estrategiaMetodologica/list');
  }

  public saveEstrategiasMetodologica(estrategiaMetodologica: EstrategiasMetodologica):Observable<EstrategiasMetodologica>{
    return this.http.post<EstrategiasMetodologica>(environment.apiuri+'/estrategiaMetodologica/save', estrategiaMetodologica);
  }

  public getEstrategiasMetodologicaById(id: number):Observable<EstrategiasMetodologica>{
    return this.http.get<EstrategiasMetodologica>(environment.apiuri+'/estrategiaMetodologica/findbyId/'+id);
  }
  
}
