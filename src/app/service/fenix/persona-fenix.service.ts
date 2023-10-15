import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Persona } from 'src/app/models/persona';
import { environment } from 'src/environment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class PersonaFenixService {

  constructor(private http: HttpClient) { }

  public personaPorCI(ci: string): Observable<Persona> {
    return this.http.get<Persona>(environment.apiuri + '/fenix/person/byIdentificacion/' + ci);
  }
}
