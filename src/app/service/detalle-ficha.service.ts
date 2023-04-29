import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DetalleFichaMatricula } from '../models/detalle-ficha-matricula';
import { environment } from 'src/environment/enviroment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DetalleFichaService {

  constructor(private http: HttpClient) { }

    // public listArea():Observable<any>{
  //   return this.http.get<any>(environment.apiuri+'/area/list');
  // }

  public getDetalleFichaMatriculaById(idDetallefichaMatricula: number):Observable<DetalleFichaMatricula>{
    return this.http.get<DetalleFichaMatricula>(environment.apiuri+'/detalleFichaService/findbyId/'+idDetallefichaMatricula);
  }

  public saveDetalleFichaMatricula(detalleFichaMatricula: DetalleFichaMatricula):Observable<DetalleFichaMatricula>{
    return this.http.post<DetalleFichaMatricula>(environment.apiuri+'/detalleFichaService/save', detalleFichaMatricula);
  }

  // public updateArea(idArea:number, area: Area):Observable<Area>{
  //   return this.http.put<Area>(environment.apiuri+'/area/actualizar/'+idArea, area);
  // }
}
