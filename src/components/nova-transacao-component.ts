import Conta from "../types/Conta.js";
import { TipoTransacao } from "../types/TipoTransacao.js";
import { Transacao } from "../types/Transacao.js";
import ExtratoComponent from "./extrato-component.js";
import SaldoComponent from "./saldo-component.js";

const elementoFormulario = document.querySelector(
  ".block-nova-transacao form"
) as HTMLFormElement;

elementoFormulario.addEventListener("submit", function (e: Event) {
  try {
    e.preventDefault();
    if (!elementoFormulario.checkValidity()) {
      alert("Por favor, preencha todos os campos da transação.");
      return;
    }

    const inputTipoTransacao = elementoFormulario.querySelector(
      "#tipoTransacao"
    ) as HTMLSelectElement;
    const inputValor = elementoFormulario.querySelector(
      "#valor"
    ) as HTMLInputElement;
    const inputData = elementoFormulario.querySelector(
      "#data"
    ) as HTMLInputElement;

    let tipoTransacao: TipoTransacao =
      inputTipoTransacao.value as TipoTransacao;
    let valor: number = inputValor.valueAsNumber;
    let data: Date = new Date(inputData.value + " 00:00:00");

    const novaTransacao: Transacao = {
      tipoTransacao: tipoTransacao,
      valor: valor,
      data: data,
    };

    Conta.RegistrarTransacao(novaTransacao);
    SaldoComponent.Atualizar();
    ExtratoComponent.Atualizar();
    console.log(Conta.AgruparTransacoes());
    elementoFormulario.reset();
  } catch (erro) {
    alert(erro.message);
  }
});
