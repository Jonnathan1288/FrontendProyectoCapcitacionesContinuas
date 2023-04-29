import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environment/enviroment';
import { DetalleFichaMatricula } from '../models/detalle-ficha-matricula';



@Injectable({
  providedIn: 'root'
})
export class DetalleFichaService {


  constructor(private http: HttpClient) { }




public getMatriculas():Observable<DetalleFichaMatricula[]>{
  return this.http.get<DetalleFichaMatricula[]>(environment.apiuri+'/detalleFichaService/list');
}

public guardarDetalleFichaMatricula(detalle: DetalleFichaMatricula):Observable<DetalleFichaMatricula>{
  return this.http.post<DetalleFichaMatricula>(environment.apiuri+'/detalleFichaService/save', detalle);
}

public getMatriculasById(idDetalleFichaMatricula: number):Observable<DetalleFichaMatricula>{
  return this.http.get<DetalleFichaMatricula>(environment.apiuri+'/detalleFichaService/findbyId/'+idDetalleFichaMatricula);
}



}
