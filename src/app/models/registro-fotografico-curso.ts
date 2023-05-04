import { Curso } from "./curso";

export class RegistroFotograficoCurso {
    idRegistroFotograficoCurso?: number;
    descripcionFoto?: string;
    foto?: string;
    fecha?: Date;
    curso?: Curso;
    estado?: boolean;
}
