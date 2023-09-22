import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DetalleFichaMatricula } from '../models/detalle-ficha-matricula';
import { environment } from 'src/environment/enviroment';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class DetalleFichaService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

    // public listArea():Observable<any>{
  //   return this.http.get<any>(environment.apiuri+'/area/list');
  // }

  public getDetalleFichaMatriculaById(idDetallefichaMatricula: number):Observable<DetalleFichaMatricula>{
    return this.http.get<DetalleFichaMatricula>(environment.apiuri+'/detalleFichaService/findbyId/'+idDetallefichaMatricula);
  }

  public getDetalleFichaMatriculaByIdPorUsuario(idUsuarioDetalle: number):Observable<DetalleFichaMatricula>{
    return this.http.get<DetalleFichaMatricula>(environment.apiuri+'/detalleFichaService/findbyIdUsuario/'+idUsuarioDetalle);
  }

  public saveDetalleFichaMatricula(detalleFichaMatricula: DetalleFichaMatricula):Observable<DetalleFichaMatricula>{
    return this.http.post<DetalleFichaMatricula>(environment.apiuri+'/detalleFichaService/save', detalleFichaMatricula);
  }


  public editDetalleFichaMatricula(idDetallefichaMatricula: number,detalleFichaMatricula: DetalleFichaMatricula):Observable<DetalleFichaMatricula>{
    return this.http.put<DetalleFichaMatricula>(environment.apiuri+'/detalleFichaService/update/'+idDetallefichaMatricula, detalleFichaMatricula);
  }


  

  // public updateArea(idArea:number, area: Area):Observable<Area>{
  //   return this.http.put<Area>(environment.apiuri+'/area/actualizar/'+idArea, area);
  // }



}
