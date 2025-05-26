import { Morada } from "./morada";

export interface Motorista{
    _id: string;
    nome: string;
    NIF: number;
    genero: string;
    anoDeNascimento: number;
    cartaDeConducao: number;
    morada: Morada;
}