import { FormatarMoeda } from "../utils/formatters.js";
import Conta from "../types/Conta.js";
const elementoSaldo = document.querySelector(".saldo-valor .valor");
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
