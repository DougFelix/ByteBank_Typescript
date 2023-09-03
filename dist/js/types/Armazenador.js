export class Armazenador {
    constructor() { }
    static Salvar(chave, valor) {
        const valorComoString = JSON.stringify(valor);
        localStorage.setItem(chave, valorComoString);
    }
    static Obter(chave, reviver) {
        const valor = localStorage.getItem(chave);
        if (valor === null) {
            return null;
        }
        if (reviver) {
            return JSON.parse(valor, reviver);
        }
        return JSON.parse(valor);
    }
}
