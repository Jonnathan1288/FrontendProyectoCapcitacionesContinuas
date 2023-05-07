import { Component, OnInit } from '@angular/core';
import { ParticipantesAprobados } from 'src/app/models/participantes-aprobados';
import { Usuario } from 'src/app/models/usuario';
import { ParticipanteAprobadoService } from 'src/app/service/participante-aprobado.service';
import { PersonaService } from 'src/app/service/persona.service';
import { UsuarioService } from 'src/app/service/usuario.service';

@Component({
  selector: 'app-asignacion-codigos-cenecyt',
  templateUrl: './asignacion-codigos-cenecyt.component.html',
  styleUrls: ['./asignacion-codigos-cenecyt.component.css'],
  styles: [
    `
      :host ::ng-deep .p-cell-editing {
        padding-top: 0 !important;
        padding-bottom: 0 !important;
      }
    `,
  ],
})
export class AsignacionCodigosCenecytComponent implements OnInit {

  //CODIGO DE PRIME

  loading: boolean = false;

  activityValues: number[] = [0, 100];

  clonedProducts: { [s: string]: ParticipantesAprobados } = {};


  //DONDE INICIAMOS CON LA PARTE FUNCIONAL DEL COMPONENETE
  public classParicipanteAprovado = new ParticipantesAprobados();

  public listparticipanteAprovado: ParticipantesAprobados[] = []

  constructor(private participantesAprovadoService: ParticipanteAprobadoService) {}

  ngOnInit(): void {

    this.getParticipanteAprovadoPorIdCursoParCodigosCenecyt(2);
  }

  public getParticipanteAprovadoPorIdCursoParCodigosCenecyt(idCurso: number){
    this.participantesAprovadoService.getAllParticipantesAprobadosByIdCurso(idCurso).subscribe((data)=>{
      if(data != null){
        this.listparticipanteAprovado = data;
      }
    })
  }

  onRowEditInit(pa: ParticipantesAprobados) {
    this.clonedProducts[pa.idParticipantesAprobados!] = { ...pa };
  }

  // onRowEditInit(product: Usuario) {
  //   console.log(product)
  //   console.log(this.clonedProducts[product.idUsuario!] = { ...product })
  //   ;
  // }

  onRowEditSave(pa: ParticipantesAprobados) {

    // this.participantesAprovadoService.updateParticipantesAprobados(pa.idParticipantesAprobados!, pa)
    //   .subscribe((data) => {
    //     if (data != null) {
    //       alert('update');
    //     }
    //   });


    this.participantesAprovadoService.updateParticipantesAprobadosLista(this.listparticipanteAprovado).subscribe((data)=>{
      if(data != null){
        alert('update succesful')
      }
    }, (err)=>{
      alert(err.error)
    })

  }

  onRowEditCancel(pa: ParticipantesAprobados, index: number) {


    this.listparticipanteAprovado[index] = this.clonedProducts[pa.idParticipantesAprobados!];
    delete this.clonedProducts[pa.idParticipantesAprobados!];
  }
}
