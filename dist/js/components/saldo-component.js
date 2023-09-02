import { FormatarMoeda, FormatarData } from "../utils/formatters.js";
import { FormatoData } from "../types/FormatoData.js";
let saldo = 3000;
const elementoSaldo = document.querySelector(".saldo-valor .valor");
const elementoDataAcesso = document.querySelector(".block-saldo time");
const dataAcesso = new Date();
elementoDataAcesso.textContent = FormatarData(dataAcesso, FormatoData.DIA_SEMANA_DIA_MES_ANO);
AtualizarSaldo(saldo);
export function GetSaldo() {
    return saldo;
}
export function AtualizarSaldo(novoSaldo) {
    saldo = novoSaldo;
    if (elementoSaldo != null)
        elementoSaldo.textContent = FormatarMoeda(saldo);
}
