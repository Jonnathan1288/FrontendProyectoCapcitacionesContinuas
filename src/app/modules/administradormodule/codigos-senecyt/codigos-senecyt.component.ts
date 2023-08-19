import { Component, OnInit } from '@angular/core';
import { ParticipantesAprobados } from 'src/app/models/participantes-aprobados';
import { ParticipanteAprobadoService } from 'src/app/service/participante-aprobado.service';
import { ToastrService } from 'ngx-toastr';
import { ReduceDataService } from 'src/app/service/DtoService/reduce-data.service';
import { CourseFilter } from 'src/app/models/references/course-filter';
@Component({
  selector: 'app-codigos-senecyt',
  templateUrl: './codigos-senecyt.component.html',
  styleUrls: ['./codigos-senecyt.component.css'],

})
export class CodigosSenecytComponent implements OnInit {
  //CODIGO DE PRIME

  loading: boolean = false;

  //DONDE INICIAMOS CON LA PARTE FUNCIONAL DEL COMPONENETE
  public classParicipanteAprovado = new ParticipantesAprobados();

  public listparticipanteAprovado: ParticipantesAprobados[] = [];

  public editing?: boolean = false;

  //NEWS CHANGES FOR TEST

  //Implements
  public listCourseFiliter: CourseFilter[] = [];
  public selectedCourseFiliter: CourseFilter[] = [];

  public listIdsCoursesSelected: number[] = [];

  constructor(
    private participantesAprovadoService: ParticipanteAprobadoService,
    private toastrService: ToastrService,
    private reduceService: ReduceDataService
  ) {

  }

  ngOnInit(): void {

    this.reduceService.getFinallyCourses().subscribe(
      {
        next: (resp) => { this.listCourseFiliter = resp },
        error: (err) => { }
      }
    );

  }

  public findByAllCorsesParticipantsApproved() {
    const codes = this.selectedCourseFiliter.map(data => data.idCurso as number);
    this.participantesAprovadoService.findALlParticipantesAprovadosAndUpdateByIdCursos(codes).subscribe({
      next: (resp) => {
        this.listparticipanteAprovado = resp;
        this.listFilterEstudiantesAprovados = resp;

      }, error: (err) => { }
    })

  }

  public onRowEditInit() {
    this.editing = true;
  }

  public onRowEditSave() {
    const participantesAprobadosCopy = this.listparticipanteAprovado.map(
      (participante) => {
        const participanteCopy = { ...participante }; // Copiar el objeto original
        return participanteCopy;
      }
    );

    console.log(participantesAprobadosCopy);

    this.participantesAprovadoService
      .updateParticipantesAprobadosLista(participantesAprobadosCopy)
      .subscribe({
        next: (resp) => {
          this.toastrService.success(
            'La información de los certificados han sido actualizados correctamente.',
            'DATOS ACTUALIZADOS'
          );
          this.editing = false;

        }, error: (err) => { this.editing = false; }
      }

      );
  }

  onRowEditCancel() {
    this.editing = false;
  }

  //Implementacion de los filtros
  public wordNoFind?: any;
  public listFilterEstudiantesAprovados: ParticipantesAprobados[] = [];
  public filterTableEventParticipantesAprovados(e: any) {
    let letter = e.target.value.toLowerCase();

    this.wordNoFind = letter;
    console.log(this.wordNoFind);

    if (this.wordNoFind === '') {
      this.listFilterEstudiantesAprovados = this.listparticipanteAprovado;
      // this.numerFoundCountAnimal = this.listALLAnimals.length;
    } else {
      let filteredAnimals = this.listparticipanteAprovado.filter(
        (usuario) =>
          usuario.partipantesMatriculados?.inscrito?.usuario?.persona?.nombre1
            ?.toLowerCase()
            .includes(this.wordNoFind) ||
          usuario.partipantesMatriculados?.inscrito?.usuario?.persona?.nombre2
            ?.toLowerCase()
            .includes(this.wordNoFind) ||
          usuario.partipantesMatriculados?.inscrito?.usuario?.persona?.apellido1
            ?.toLowerCase()
            .includes(this.wordNoFind) ||
          usuario.partipantesMatriculados?.inscrito?.usuario?.persona?.apellido2
            ?.toLowerCase()
            .includes(this.wordNoFind) ||
          usuario.partipantesMatriculados?.inscrito?.usuario?.persona?.identificacion
            ?.toLowerCase()
            .includes(this.wordNoFind)
      );

      this.listFilterEstudiantesAprovados = filteredAnimals;
    }
  }


  // downloadCertificadoEstudiante}
}
