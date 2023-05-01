import { Component, OnInit } from '@angular/core';
import { Asistencia } from 'src/app/models/asistencia';
import { Persona } from 'src/app/models/persona';
import { RegistroFotograficoCurso } from 'src/app/models/registro-fotografico-curso';
import { Usuario } from 'src/app/models/usuario';
import { AsistenciaService } from 'src/app/service/asistencia.service';
import { RegistroFotograficoCursoService } from 'src/app/service/registro-fotografico-curso.service';
import { UsuarioService } from 'src/app/service/usuario.service';
import { trigger,state,style,transition,animate } from '@angular/animations';

@Component({
  selector: 'app-view-evidencias-table-fotofraficas',
  templateUrl: './view-evidencias-table-fotofraficas.component.html',
  styleUrls: ['./view-evidencias-table-fotofraficas.component.css'],
  styles: [
    `
      :host ::ng-deep .p-dialog .product-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
      }
    `,
  ],
  animations: [
    trigger('rowExpansionTrigger', [
        state('void', style({
            transform: 'translateX(-10%)',
            opacity: 0
        })),
        state('active', style({
            transform: 'translateX(0)',
            opacity: 1
        })),
        transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
]
})
export class ViewEvidenciasTableFotofraficasComponent implements OnInit {
  public lisp: Usuario[] = [];
  public lispF: RegistroFotograficoCurso[]=[];
  constructor(private asi: UsuarioService, private regfService: RegistroFotograficoCursoService){}
  ngOnInit(): void {
    // this.asi.listUsuario().subscribe((data) => {
    //   this.lisp = data;
    // });

    this.regfService.getRegistroFotograficoCursoAllByIdCurso(1).subscribe((data)=>{
      this.lispF = data;
    })
  }
}
