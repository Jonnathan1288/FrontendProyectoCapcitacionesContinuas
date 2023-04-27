import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Persona } from 'src/app/models/persona';
import { PersonaService } from 'src/app/service/persona.service';
// import Swal from 'sweetalert2';


@Component({
  selector: 'app-registrar-persona',
  templateUrl: './registrar-persona.component.html',
  styleUrls: ['./registrar-persona.component.css']
})
export class registrarPersonaComponent implements OnInit{
  persona = new Persona();
  constructor(private router:Router, private service:PersonaService){}

  ngOnInit(): void {
  }

  // guardar(persona:Persona){
  //   this.service.create(persona)
  //   .subscribe(data=>{
  //     Swal.fire({
  //       title:'Datos guardados con exito',
  //       icon:'success',
  //       iconColor :'#17550c',
  //       color: "#0c3255",
  //       confirmButtonColor:"#0c3255",
  //       background: "#63B68B",
  //     })
  //     this.router.navigate(['persona/persona']);
  //   })
  // }

}
