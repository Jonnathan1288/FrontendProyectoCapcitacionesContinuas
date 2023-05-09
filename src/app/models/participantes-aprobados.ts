import { ParticipantesMatriculados } from "./participantesMatriculados";

export class ParticipantesAprobados {
    idParticipantesAprobados?: number;
    codigoSenecyt?: string;
    certificadoParticipante?: string;
    certificadoFirmado?: boolean;
    partipantesMatriculados?: ParticipantesMatriculados;
}
