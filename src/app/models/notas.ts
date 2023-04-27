import { ParticipantesMatriculados } from "./participantesMatriculados";

export class Notas {
    idNota?: number;
    parcial?: boolean;
    examenFinal?: string;
    fechaNota?: Date;
    observacion?: string;
    participanteMatriculado?: ParticipantesMatriculados;
}

