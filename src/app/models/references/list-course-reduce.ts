import { NumberValueAccessor } from "@angular/forms";

export class ListCourseReduce {
    idCurso?: number;
    nameCourse?: string;
    fechaInicio?: Date;
    fechaFin?: Date;
    statusFinalized?: boolean;
    statusApproved?: string;
    username?: string;
    email?: string;
    nameProgram?: string;
    docente?: string;
    urlPhoto?: string;
}