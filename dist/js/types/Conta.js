import { TipoTransacao } from "./TipoTransacao.js";
import { FormatarData } from "../utils/formatters.js";
import { FormatoData } from "./FormatoData.js";
let saldo = JSON.parse(localStorage.getItem("saldo")) || 0;
const transacoes = JSON.parse(localStorage.getItem("transacoes"), (key, value) => {
    if (key === "data") {
        return new Date(value);
    }
    return value;
}) || [];
function Debitar(valor) {
    if (valor <= 0) {
        throw new Error("O valor a ser debitado deve ser maior que zero!");
    }
    if (valor > saldo) {
        throw new Error("Saldo insuficiente!");
    }
    saldo -= valor;
    localStorage.setItem("saldo", saldo.toString());
}
function Depositar(valor) {
    if (valor <= 0) {
        throw new Error("O valor a ser depositado deve ser maior que zero!");
    }
    saldo += valor;
    localStorage.setItem("saldo", saldo.toString());
}
const Conta = {
    GetSaldo() {
        return saldo;
    },
    GetDataAcesso() {
        return new Date();
    },
    GetGruposTransacoes() {
        const gruposTransacoes = [];
        const listaTransacoes = structuredClone(transacoes);
        const transacoesOrdenadas = listaTransacoes.sort((t1, t2) => t2.data.getTime() - t1.data.getTime());
        let labelAtualGrupoTransacao = "";
        for (let transacao of transacoesOrdenadas) {
            let labelGrupoTransacao = FormatarData(transacao.data, FormatoData.DIA_MES);
            if (labelAtualGrupoTransacao !== labelGrupoTransacao) {
                labelAtualGrupoTransacao = labelGrupoTransacao;
                gruposTransacoes.push({
                    label: labelGrupoTransacao,
                    transacoes: [],
                });
            }
            gruposTransacoes.at(-1).transacoes.push(transacao);
        }
        return gruposTransacoes;
    },
    RegistrarTransacao(novaTransacao) {
        if (novaTransacao.tipoTransacao == TipoTransacao.DEPOSITO) {
            Depositar(novaTransacao.valor);
        }
        else if (novaTransacao.tipoTransacao == TipoTransacao.TRANSFERENCIA ||
            novaTransacao.tipoTransacao == TipoTransacao.PAGAMENTO_BOLETO) {
            Debitar(novaTransacao.valor);
            novaTransacao.valor *= -1;
        }
        else {
            throw new Error(TipoTransacao.INVALIDO);
        }
        transacoes.push(novaTransacao);
        console.log(this.GetGruposTransacoes());
        localStorage.setItem("transacoes", JSON.stringify(transacoes));
    },
    AgruparTransacoes() {
        const listaTransacoes = structuredClone(transacoes);
        const resumoTransacoes = {
            totalDepositos: 0,
            totalPagamentosBoleto: 0,
            totalTransferencias: 0
        };
        for (let transacao of listaTransacoes) {
            if (transacao.tipoTransacao === TipoTransacao.DEPOSITO) {
                resumoTransacoes.totalDepositos += transacao.valor;
            }
            else if (transacao.tipoTransacao === TipoTransacao.PAGAMENTO_BOLETO) {
                resumoTransacoes.totalPagamentosBoleto += transacao.valor;
            }
            else if (transacao.tipoTransacao === TipoTransacao.TRANSFERENCIA) {
                resumoTransacoes.totalTransferencias += transacao.valor;
            }
        }
        return resumoTransacoes;
    }
};
export default Conta;
