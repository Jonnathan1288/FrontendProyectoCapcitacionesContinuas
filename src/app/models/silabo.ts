import { Curso } from "./curso";

export class Silabo {

    idSilabo?: number;
    bibliografia?: string;
    campoFormacion?: string;
    campoRevisadoPor?: string;
    campoAprovadoPor?: string;

    curso?: Curso;
}
