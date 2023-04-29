import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/enviroment';
import { Contenidosilabos } from '../models/contenidosilabos';

@Injectable({
  providedIn: 'root'
})
export class ContenidoSilaboService {

  constructor(private http: HttpClient) { }

  public listContenidosilabos():Observable<Contenidosilabos[]>{
    return this.http.get<Contenidosilabos[]>(environment.apiuri+'/contenidosilabo/list');
  }

  public saveContenidosilabos(materialesAudiovisuales: Contenidosilabos):Observable<Contenidosilabos>{
    return this.http.post<Contenidosilabos>(environment.apiuri+'/contenidosilabo/save', materialesAudiovisuales);
  }

  public getContenidosilabosById(id: number):Observable<Contenidosilabos>{
    return this.http.get<Contenidosilabos>(environment.apiuri+'/contenidosilabo/findbyId/'+id);
  }
  
}
