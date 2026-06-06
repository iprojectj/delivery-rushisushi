A página de pré-sell será criada como uma nova rota no TanStack Start, simulando com alta fidelidade a interface do perfil do Instagram no mobile.

1.  **Criar Componente de UI**: Criar `src/components/InstagramPreSell.tsx` contendo a estrutura visual do perfil do Instagram (header, biografia, stories, grid de posts, botões de ação).
2.  **Configurar Nova Rota**: Criar `src/routes/instagram.tsx` que renderizará o componente `InstagramPreSell`.
3.  **Implementar Design Responsivo**: Focar na experiência mobile, utilizando Tailwind CSS para replicar ícones, fontes e espaçamentos do Instagram.
4.  **Adicionar Conteúdo Estratégico**: Incluir elementos de prova social (stories com depoimentos, posts de pratos do Rūshī Sushi) e um link de "Link na Bio" que redireciona para a página principal de pedidos.
5.  **Simular Interatividade**: Adicionar estados para cliques em stories e posts para aumentar a percepção de autenticidade.

**Detalhes Técnicos**:
- Framework: TanStack Router + Tailwind CSS.
- Assets: Utilização de ícones Lucide-react (substituindo ícones do Instagram).
- Navegação: O "botão de compra" ou "link na bio" levará o usuário para `/` (página de pedidos).
