var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { FormatarData } from "../utils/formatters.js";
import { Armazenador } from "./Armazenador.js";
import { ValidaDebito } from "./Decorators.js";
import { FormatoData } from "./FormatoData.js";
import { TipoTransacao } from "./TipoTransacao.js";
export class Conta {
    nome;
    saldo = Armazenador.Obter("saldo") || 0;
    transacoes = Armazenador.Obter("transacoes", (key, value) => {
        if (key === "data") {
            return new Date(value);
        }
        return value;
    }) || [];
    constructor(nome) {
        this.nome = nome;
    }
    GetTitular() {
        return this.nome;
    }
    GetSaldo() {
        return this.saldo;
    }
    GetDataAcesso() {
        return new Date();
    }
    Debitar(valor) {
        this.saldo -= valor;
        Armazenador.Salvar("saldo", this.saldo.toString());
    }
    Depositar(valor) {
        if (valor <= 0) {
            throw new Error("O valor a ser depositado deve ser maior que zero!");
        }
        this.saldo += valor;
        Armazenador.Salvar("saldo", this.saldo.toString());
    }
    RegistrarTransacao(novaTransacao) {
        if (novaTransacao.tipoTransacao == TipoTransacao.DEPOSITO) {
            this.Depositar(novaTransacao.valor);
        }
        else if (novaTransacao.tipoTransacao == TipoTransacao.TRANSFERENCIA ||
            novaTransacao.tipoTransacao == TipoTransacao.PAGAMENTO_BOLETO) {
            this.Debitar(novaTransacao.valor);
            novaTransacao.valor *= -1;
        }
        else {
            throw new Error(TipoTransacao.INVALIDO);
        }
        this.transacoes.push(novaTransacao);
        console.log(this.GetGruposTransacoes());
        Armazenador.Salvar("transacoes", JSON.stringify(this.transacoes));
    }
    AgruparTransacoes() {
        const listaTransacoes = structuredClone(this.transacoes);
        const resumoTransacoes = {
            totalDepositos: 0,
            totalPagamentosBoleto: 0,
            totalTransferencias: 0,
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
    GetGruposTransacoes() {
        const gruposTransacoes = [];
        const listaTransacoes = structuredClone(this.transacoes);
        const transacoesOrdenadas = listaTransacoes.sort((t1, t2) => t2.data.getTime() - t1.data.getTime());
        let labelAtualGrupoTransacao = "";
        for (let transacao of transacoesOrdenadas) {
            let labelGrupoTransacao = FormatarData(transacao.data, FormatoData.MES_ANO);
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
    }
}
__decorate([
    ValidaDebito
], Conta.prototype, "Debitar", null);
export class ContaPremium extends Conta {
    RegistrarTransacao(transacao) {
        if (transacao.tipoTransacao === TipoTransacao.DEPOSITO) {
            console.log("Ganhou um bonus de 0,50 centavos!");
            transacao.valor += 0.5;
        }
        super.RegistrarTransacao(transacao);
    }
}
const conta = new Conta("Joana da Silva Oliveira");
const contaPremium = new ContaPremium("Douglas");
console.log(conta.GetTitular());
export default conta;
