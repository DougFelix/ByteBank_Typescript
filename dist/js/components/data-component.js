import { FormatoData } from "../types/FormatoData.js";
import { FormatarData } from "../utils/formatters.js";
import Conta from "../types/Conta.js";
const elementoDataAcesso = document.querySelector(".block-saldo time");
function RenderizarData() {
    if (elementoDataAcesso != null)
        elementoDataAcesso.textContent = FormatarData(Conta.GetDataAcesso(), FormatoData.DIA_SEMANA_DIA_MES_ANO);
}
const DataComponent = {
    Atualizar: function () {
        RenderizarData();
    },
};
export default DataComponent;
