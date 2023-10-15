import jwt_decode from "jwt-decode";
import { TokenData } from "../interface/token-data";
import { SecurityService } from "./service/security.service";

export enum LocalStorageKeys {
    TOKEN = "token",
    ROL = 'rol',
    TIME_TOKEN = 'token',
    ID_USUARIO = 'id_username',
    URL_PHOTO = 'foto',
    USER_NAME = 'username'
}

const securityService = new SecurityService();

export const getToken = (key: string) => {
    const result = localStorage.getItem(key);
    return !!result && result;
};

export const getTokenTimeOut = (token: string) => {
    const decodedToken: TokenData = jwt_decode(token);
    const currentTime: number = Math.floor(Date.now() / 1000);

    return decodedToken.exp < currentTime;
};

export const getTokenTime = (token: string) => {
    return localStorage.getItem(token);
};

export const clearLocalStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
};

export const getRole = (rol: string) => {
    const keyDecrypt = securityService.decrypt(localStorage.getItem(rol)!);
    return keyDecrypt;
}



export const getAttributeStorage = (key: string) => {
    const keyDecrypt = securityService.decrypt(localStorage.getItem(key)!);
    return keyDecrypt;
    // return localStorage.getItem(key);
};