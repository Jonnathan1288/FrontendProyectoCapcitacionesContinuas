import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Persona } from '../models/persona';
import { environment } from 'src/environment/enviroment';


@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  constructor(private http: HttpClient) { }

  public getListaPersonas():Observable<Persona[]>{
    return this.http.get<Persona[]>(environment.apiuri+'/persona/listar');
  }

  public savePersona(persona: Persona):Observable<Persona>{
    return this.http.post<Persona>(environment.apiuri+'/persona/crear', persona);
  }

  public getPersonaById(idPersona: number):Observable<Persona>{
    return this.http.get<Persona>(environment.apiuri+'/persona/findbyId/'+idPersona);
  }

  public getPersonaByIdentificasion(identificasion: String):Observable<boolean>{
    return this.http.get<boolean>(environment.apiuri+'/persona/existsbyIdentifcasion/'+identificasion);
  }

  public updatePersona(idPersona:number, Persona: Persona):Observable<Persona>{
    return this.http.put<Persona>(environment.apiuri+'/persona/actualizar/'+idPersona, Persona);
  }

}
