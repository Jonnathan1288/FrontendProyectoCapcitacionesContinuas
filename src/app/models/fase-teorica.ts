import { DisenioCurriculares } from "./disenio-curriculares"
import { Instalacion } from "./instalacion"
import { Recurso } from "./recurso"

export class FaseTeorica {
    idFaseTeorica?: number
    nombreFase?: string
    estado?: boolean
    instalacion?: Instalacion
    recurso?: Recurso
    disenioCurricular?: DisenioCurriculares
}
