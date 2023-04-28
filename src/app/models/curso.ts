import { Capacitador } from "./capacitador";
import { Especialidad } from "./especialidad";
import { HorarioCurso } from "./horario-curso";
import { ModalidadCurso } from "./modalidad-curso";
import { NivelCurso } from "./nivel-curso";
import { Programa } from "./programa";
import { TipoCurso } from "./tipo-curso";

export class Curso {
    idCurso?: number;
    nombreCurso?: string; //
    fotoCurso?: string; //no
    duracionCurso?: number; //
    observacionCurso?: string; //
    estadoCurso?: boolean;
    estadoAprovacionCurso?: string;
    estadoPublicasionCurso?: boolean;
    descripcionCurso?: string;
    objetivoGeneralesCurso?: string;
    numeroCuposCurso?: number;
    fechaInicioCurso?: Date;
    fechaFinalizacionCurso?: Date;
    programa?: Programa;
    especialidad?: Especialidad;
    capacitador?: Capacitador;
    modalidadCurso?: ModalidadCurso;
    tipoCurso?: TipoCurso
    nivelCurso?: NivelCurso
    horarioCurso?: HorarioCurso
}
