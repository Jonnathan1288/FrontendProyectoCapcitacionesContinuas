import { Persona } from "./persona";
import { Rol } from "./rol";

export class Usuario {
    idUsuario?: number;
    username?: string;
    password?: string;
    fotoPerfil?: string;
    estadoUsuarioActivo?: boolean;
    persona?: Persona
    rol?: Rol
}
