Como o site original foi convertido de forma automatica, ele acabou ficando pesado e perdendo funcoes essenciais como a escolha de complementos e adicionais. Vou recriar a experiencia do zero, focando em performance (especialmente mobile) e restaurando as funcionalidades de um cardapio profissional tipo iFood.

### O que sera feito:

1.  **Novo Modal de Produto**:
    -   Selecao de quantidade.
    -   Listagem de adicionais/complementos (ex: Cream Cheese Extra, Hashi, etc).
    -   Campo de observacoes para o item.
    -   Visual limpo e rapido.

2.  **Sistema de Carrinho Aprimorado**:
    -   Suporte para itens com diferentes configuracoes de adicionais.
    -   Interface de revisao de itens no carrinho antes do checkout.

3.  **Refatoracao de Performance**:
    -   Otimizacao do carregamento inicial.
    -   Melhoria nas transicoes de categoria (sticky navigation).
    -   Uso de componentes Shadcn UI para garantir acessibilidade e leveza.

4.  **Fluxo de Checkout**:
    -   Formulario de entrega simplificado.
    -   Integracao direta para envio do pedido via WhatsApp (ou finalizacao no site se preferir).

### Detalhes Tecnicos:
-   Uso de `framer-motion` para animacoes fluidas.
-   Estado global com `zustand` para o carrinho.
-   Componentizacao modular para facilitar a evolucao futura do site.
-   Responsividade Mobile-First (foco 100% no celular).

Vou comecar pela implementacao do novo Modal de Produto com Adicionais.