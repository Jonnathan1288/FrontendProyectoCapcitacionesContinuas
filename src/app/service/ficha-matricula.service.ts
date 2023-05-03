import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FichaMatricula } from '../models/fichaMatricula';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class inFichaMatriculaService {

  constructor(private http: HttpClient) { }

  // public listArea():Observable<any>{
  //   return this.http.get<any>(environment.apiuri+'/area/list');
  // }

  public getFichaMatriculaById(idFichaMatricula: number):Observable<FichaMatricula>{
    return this.http.get<FichaMatricula>(environment.apiuri+'/fichaMatricula/findbyId/'+idFichaMatricula);
  }

  public saveFichaMatricula(fichaMatricula: FichaMatricula):Observable<FichaMatricula>{
    return this.http.post<FichaMatricula>(environment.apiuri+'/fichaMatricula/save', fichaMatricula);
  }



  

  // public updateArea(idArea:number, area: Area):Observable<Area>{
  //   return this.http.put<Area>(environment.apiuri+'/area/actualizar/'+idArea, area);
  // }


}
