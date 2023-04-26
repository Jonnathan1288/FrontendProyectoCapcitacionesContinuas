import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Persona } from './persona';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {


  private guardar:string="http://localhost:8080/api/persona/listar";

  personaObj: Persona[] = [];

  private httpHeaders= new HttpHeaders({'Content-Type':'application/json'})
  constructor(private http:HttpClient) { }

  //Metodo para guardar
  create(personaObj: Persona):Observable<Persona>{
    return this.http.post<Persona>(this.guardar, personaObj,{headers:this.httpHeaders})
  }

}
