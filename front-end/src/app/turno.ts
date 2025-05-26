import { Motorista } from "./motorista";
import { Periodo } from "./periodo";
import { Taxi } from "./taxi";

export interface Turno{
    _id: string;
    taxi: Taxi;
    motorista: Motorista;
    periodo: Periodo
}