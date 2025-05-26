
export interface Morada{
    _id: string;
    rua: string;
    numeroDaPorta: number;
    codigoPostal: string;
    localidade: string;
    lat?: number;
    lon?: number;
}