import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Curso } from '../models/curso';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';
import { DocenteFenix } from '../models/docente-fenix';
import { EstudianteFenix } from '../models/estudiante-fenix';

@Injectable({
  providedIn: 'root'
})
export class EstudianteFenixService {

  constructor(private http: HttpClient) { }

  public listEstudianteFenix():Observable<EstudianteFenix[]>{
    return this.http.get<EstudianteFenix[]>(environment.apiuri+'/fenix/estudiante/ista/list');
  }

  public getEstudianteFenixFindByIdentificasión(identificacion: string):Observable<EstudianteFenix>{
    return this.http.get<EstudianteFenix>(environment.apiuri+'/fenix/estudiante/ista/findbyIdentificasion/'+identificacion);
  }
}
