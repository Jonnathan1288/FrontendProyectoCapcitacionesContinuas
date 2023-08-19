import { Component, OnInit } from '@angular/core';
// import * as FileSaver from 'file-saver';
import { studentsApproved } from 'src/app/interface/students-approved';
import { CourseFilter } from 'src/app/models/references/course-filter';
import { ListApproved } from 'src/app/models/references/list-approved';
import { CursoService } from 'src/app/service/curso.service';
import { ParticipanteMatriculadoService } from 'src/app/service/participante-matriculado.service';
import { saveAs } from 'file-saver';
import { ParticipantesAprobados } from 'src/app/models/participantes-aprobados';
import { ParticipanteAprobadoService } from 'src/app/service/participante-aprobado.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-generate-exel-varios',
    templateUrl: './generate-exel-varios.component.html',
    styleUrls: ['./generate-exel-varios.component.css'],
})
export class GenerateExelVariosComponent implements OnInit {

    public listApproved: ListApproved[] = [];

    public listApprovedI!: studentsApproved[];

    public listCourseFiliter: CourseFilter[] = [];

    public selectedCourseFiliter: CourseFilter[] = [];

    public courseFiliter = new CourseFilter();

    public listIdsSelected: number[] = [];

    // METHODS EDIT TABLE---------
    public editing1?: boolean = false;

    constructor(
        private participantesMatriculados: ParticipanteMatriculadoService,
        private participantesAprovadosService: ParticipanteAprobadoService,
        private toastrService: ToastrService,
        private courseService: CursoService
    ) { }
    ngOnInit(): void {
        this.listCoursesFinally();
    }

    public listCoursesFinally() {
        this.courseService.findByAllCurseFinally().subscribe({
            next: (resp) => {
                this.listCourseFiliter = resp
            }, error: (err) => {

            }
        });
    }

    public filterDataApproved() {
        this.listIdsSelected = this.selectedCourseFiliter.map(course => course.idCurso as number);
        this.requestStudentsApproved(this.listIdsSelected);
    }

    public downloadPaticipantsApproved() {
        this.participantesMatriculados.getReportParticipantsApproved(this.listIdsSelected).subscribe({
            next: (resp) => {

                const blob = new Blob([resp], { type: 'application/octet-stream' });
                saveAs(blob, 'ParticipantesAprovados.xlsx');

            }, error: (err) => {

            }
        })
    }

    originalList!: studentsApproved[]; // Variable para almacenar la copia original de la lista

    public requestStudentsApproved(list: number[]) {
        this.participantesMatriculados.findALlParticipantesAprovadosByIdCursos(list).subscribe({
            next: (resp) => {
                this.listApproved = resp;

                this.listApprovedI = this.listApproved.map((t: ListApproved) => ({
                    idCurso: t.idCurso,
                    nombres: t.nombres,
                    curso: t.curso,
                    codigoSenecyt: t.codigoSenecyt,
                    idParticipanteMatriculado: t.idParticipanteMatriculado,
                    idParticipantesAprobados: t.idParticipantesAprobados,
                    fecha: this.parseDateToStringCalendar(t.fechaInicio as string, t.fechaFin as string),
                    horas: t.horas,
                    docente: t.docente
                }));

                this.originalList = this.listApprovedI;

            },
            error: (err) => {
                console.log(err);
            }
        });
    }


    public parseDateToStringCalendar(fechaInicio: string, fechaFin: string): string {
        const meses: string[] = [
            "enero", "febrero", "marzo", "abril", "mayo", "junio",
            "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
        ];

        const fechaInicioObj = new Date(fechaInicio);
        const fechaFinObj = new Date(fechaFin);

        // const fechaInicioStr = `${fechaInicioObj.getDate()} de ${meses[fechaInicioObj.getMonth()]}, ${fechaInicioObj.getFullYear()}`;
        const fechaInicioStr = `${fechaInicioObj.getDate() + 1} de ${meses[fechaInicioObj.getMonth()]}`;

        const fechaFinStr = `${fechaFinObj.getDate() + 1} de ${meses[fechaFinObj.getMonth()]}, ${fechaFinObj.getFullYear()}`;

        return `${fechaInicioStr} al ${fechaFinStr}`;
    }

    // IMPLEMENTS  EDIT TABLE-------------


    public onRowEditInit() {
        this.editing1 = true;
        console.log(this.originalList)

    }

    public onRowEditSave() {
        // console.log(this.listApprovedI)
        const participantesAprobadosCopy: ParticipantesAprobados[] = this.listApprovedI.map(
            (participante) => {
                const participanteCopy: ParticipantesAprobados = {
                    idParticipantesAprobados: participante.idParticipantesAprobados,
                    codigoSenecyt: participante.codigoSenecyt,
                    partipantesMatriculados: {
                        idParticipanteMatriculado: participante.idParticipanteMatriculado
                    }
                }
                return participanteCopy;
            }
        );

        console.log(participantesAprobadosCopy);

        this.participantesAprovadosService
            .updateParticipantesAprobadosLista(participantesAprobadosCopy)
            .subscribe({
                next: (resp) => {
                    this.toastrService.success(
                        'La información de los certificados han sido actualizados correctamente.',
                        'DATOS ACTUALIZADOS'
                    );
                    this.editing1 = false;

                }, error: (err) => { this.editing1 = false; }
            }

            );
    }

    onRowEditCancel() {
        this.editing1 = false;
        console.log(this.originalList)
        this.originalList = [...this.listApprovedI]
    }

}



