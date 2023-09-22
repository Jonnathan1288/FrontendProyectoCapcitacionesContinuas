import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/enviroment';
import { Contenidosilabos } from '../models/contenidosilabos';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ContenidoSilaboService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public listContenidosilabos():Observable<Contenidosilabos[]>{
    return this.http.get<Contenidosilabos[]>(environment.apiuri+'/contenidosilabo/list');
  }

  public saveContenidosilabos(contenidosSilabo: Contenidosilabos):Observable<Contenidosilabos>{
    return this.http.post<Contenidosilabos>(environment.apiuri+'/contenidosilabo/save', contenidosSilabo);
  }

  public getContenidosilabosById(id: number):Observable<Contenidosilabos>{
    return this.http.get<Contenidosilabos>(environment.apiuri+'/contenidosilabo/findbyId/'+id);
  }

  
  public getContenidoSilaboPorIdSilabo(id: number):Observable<Contenidosilabos[]>{
    return this.http.get<Contenidosilabos[]>(environment.apiuri+'/contenidosilabo/contenidosilaboPorSilabo/findbyId/'+id);
  }

  public updateContenidoSilabo(id:number, contenidosSilabo: Contenidosilabos):Observable<Contenidosilabos>{
    return this.http.put<Contenidosilabos>(environment.apiuri+'/contenidosilabo/actualizar/'+id, contenidosSilabo);
  }
  
  
}
