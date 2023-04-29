import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, Observable } from 'rxjs';
import { environment } from 'src/environment/enviroment';
import { FichaMatricula } from '../models/fichaMatricula';

@Injectable({
  providedIn: 'root'
})
export class FichaMatriculaService {

  constructor(private http: HttpClient) { }



  public getMatriculas():Observable<FichaMatricula[]>{
    return this.http.get<FichaMatricula[]>(environment.apiuri+'/fichaMatricula/list');
  }
  
  public savematricula(ficha: FichaMatricula):Observable<FichaMatricula>{
    return this.http.post<FichaMatricula>(environment.apiuri+'/fichaMatricula/save', ficha);
  }
  
  public getMatriculasById(idFichaMatricula: number):Observable<FichaMatricula>{
    return this.http.get<FichaMatricula>(environment.apiuri+'/fichaMatricula/findbyId/'+idFichaMatricula);
  }


}
