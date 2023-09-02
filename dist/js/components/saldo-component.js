import { FormatarData, FormatarMoeda } from "../utils/formatters.js";
import Conta from "../types/Conta.js";
import { FormatoData } from "../types/FormatoData.js";
const elementoSaldo = document.querySelector(".saldo-valor .valor");
const elementoDataAcesso = document.querySelector(".block-saldo time");
RenderizarData();
function RenderizarData() {
    if (elementoDataAcesso != null)
        elementoDataAcesso.textContent = FormatarData(Conta.GetDataAcesso(), FormatoData.DIA_SEMANA_DIA_MES_ANO);
}
RenderizarSaldo();
function RenderizarSaldo() {
    if (elementoSaldo != null)
        elementoSaldo.textContent = FormatarMoeda(Conta.GetSaldo());
}
const SaldoComponent = {
    Atualizar: function () {
        RenderizarSaldo();
    },
};
export default SaldoComponent;
