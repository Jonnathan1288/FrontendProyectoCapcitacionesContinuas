import { ParticipantesMatriculados } from "./participantesMatriculados";

export class Notas {
    idNota?: number;
    parcial?: number;
    informe1?: number;
    informe2?: number;
    informe3?: number;
    examenFinal?: number;
    fechaNota?: Date;
    observacion?: string;
    partipantesMatriculados?: ParticipantesMatriculados;
}

