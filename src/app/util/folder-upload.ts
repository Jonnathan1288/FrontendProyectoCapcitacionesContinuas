import { environment } from "src/environment/enviroment";

export const FOLDER_IMAGE_COURSE = 'images_course';//
export const FOLDER_DOCUMENTS_HOJA_VIDA = 'documents_pdfs';//

export const FOLDER_DOCUMENTS_EXCEL = 'documents';//
export const FOLDER_IMAGE_USER = 'images_user';//
export const FOLDER_IMAGE_RFOTOGRAFICO = 'images_rfotografico';//

export const getFile = (fileName: string, folder: string) => `${environment.apiuri}/uploadUri/${fileName}/${folder}`;

export const getFileDocument = (fileName: string, folder: string) => `${environment.apiuri}/upload/${fileName}/${folder}`;

export const USER_IMAGE_DEFAULT = '4bce1942-ba13-4569-9326-4eb87f663aed_userDefault.png';