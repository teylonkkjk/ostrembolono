
🏋️‍♂️ OSTREMBOLONO — Sistema de Gerenciamento de Treinos & Enciclopédia Biomecânica 3D/4D

Criado por dev.teylonkkjk

Plataforma web moderna, responsiva e de alta performance para gerenciamento completo de fichas de treino, acompanhamento de evolução de cargas e enciclopédia interativa com 203 exercícios demonstrados em 3D/4D.

✨ Sobre o Projeto

O OSTREMBOLONO foi desenvolvido para oferecer uma experiência digna de aplicativos premium de academia diretamente no navegador, com tema escuro (Dark Mode) e identidade visual em Verde Neon.

O sistema funciona 100% no navegador do usuário (Client-Side) utilizando LocalStorage estruturado, garantindo velocidade instantânea, privacidade e zero dependência de bancos de dados externos, servidores ou logins burocráticos com senha. Além disso, conta com um sistema completo de Backup em JSON para exportar e importar seus treinos em qualquer dispositivo.

🚀 Principais Funcionalidades

1. 👤 Sistema Inteligente de Identificação Multi-Usuário

Acesso Instantâneo: Ao abrir o site, basta digitar seu nome ou apelido para entrar no seu espaço exclusivo de treinos.

Múltiplos Perfis Independentes: Cada pessoa cadastrada no navegador possui sua própria ficha semanal, histórico e evolução de cargas isolados.

Ficha de Exemplo Opcional: Novos perfis podem iniciar com uma divisão completa de Segunda a Sábado pré-configurada ou com a ficha em branco.

2. 📅 Planejamento Semanal (Segunda a Domingo)

7 Dias da Semana: Organização clara de Segunda-feira a Domingo.

Regra Inteligente de Categorias (1 a 3 por dia): Cada dia permite selecionar até 3 grupos musculares principais:

🟢 Peito

🟢 Ombro

🟢 Perna

🟢 Costa

🟢 Bíceps

🟢 Tríceps

3. 💪 Gerenciamento Completo de Exercícios

Cadastro detalhado contendo:

Nome do exercício (com sugestões rápidas clicáveis por grupo muscular)

Séries e Repetições

Carga / Peso (kg)

Tempo de descanso (segundos)

Observações técnicas / Cadência

Funções completas para Adicionar, Editar, Excluir, Reorganizar a ordem (↑ / ↓) e Marcar como Concluído.

4. 🧬 Guia Biomecânico 3D/4D com 203 Exercícios

Uma enciclopédia interativa dividida em 17 categorias e modalidades:

Peito (22 exercícios)

Costas (24 exercícios)

Ombros (18 exercícios)

Tríceps (13 exercícios)

Bíceps e Braquial (15 exercícios)

Antebraços e Pegada (9 exercícios)

Quadríceps (16 exercícios)

Posterior de Coxa (10 exercícios)

Glúteos (13 exercícios)

Panturrilhas e Tibial (7 exercícios)

Abdômen e Core (19 exercícios)

Lombar e Estabilizadores (8 exercícios)

Cardio e Condicionamento (21 exercícios)

Funcional, Potência e Pliometria (15 exercícios)

Calistenia e Peso Corporal (16 exercícios)

Mobilidade e Alongamento (15 exercícios)

Exercícios Olímpicos e Levantamento de Peso - LPO (13 exercícios)

Cada exercício do Guia inclui:

Simulador 3D/4D em 60 FPS: Renderização 3D interativa com câmera giratória em 360° (arraste com o mouse/dedo ou use os ângulos 3D, Lateral, Frente, Costas e 360°), controle de câmera lenta (0.5x), pausa e telemetria 4D da fase da contração (Concêntrica, Pico de Contração e Excêntrica).

Mapa Anatômico de 23 Zonas Musculares: Diagrama corporal Anterior e Posterior que destaca em Verde Neon exatamente o músculo alvo principal e em Âmbar os músculos sinergistas/auxiliares.

Explicação Técnica Completa: Para que serve o exercício, passo a passo numerado da execução correta, dica de ouro de postura e botão para adicionar com 1 clique na sua ficha semanal.

5. ⏱️ Cronômetro de Descanso Flutuante com Alerta Sonoro

Ao clicar no tempo de descanso de qualquer exercício, o cronômetro flutuante inicia automaticamente.

Possui controles de Pausar/Retomar, +15 segundos, Reiniciar e emite um alerta sonoro (Web Audio API) ao zerar.

6. 📊 Progresso Diário, Semanal, Histórico e PRs de Carga

Barras de Progresso em Tempo Real: Acompanhe sua porcentagem de conclusão do treino do dia e da semana inteira no topo da tela.

Histórico de Treinos: Salve suas sessões finalizadas com cálculo automático do volume total movimentado (kg).

Log Automático de Evolução de Cargas: Sempre que você aumenta ou altera o peso de um exercício, o sistema registra sua progressão (ex: 30kg → 32kg (+2kg)).

7. 🛠️ Painel de Gerenciamento & Backup em JSON

Painel Multi-Perfil: Visualize todos os atletas salvos no navegador, renomeie perfis, limpe fichas ou edite treinos de qualquer usuário rapidamente.

Exportação e Importação JSON: Exporte o backup de um usuário específico ou de todos os perfis em .json e restaure quando quiser (com opção de Mesclar ou Substituir).

🛠️ Tecnologias Utilizadas

React 18+ — Biblioteca principal de interface e estado reativo

Vite — Bundler ultrarrápido para desenvolvimento e build de produção

Tailwind CSS v4 — Estilização moderna, responsiva e tema Dark/Neon

Lucide React — Ícones vetoriais modernos e leves

HTML5 Canvas 3D & SVG Anatômico — Motor próprio de simulação biomecânica 3D/4D em 60 FPS e mapeamento muscular de 23 zonas

WebStorage API (localStorage) — Persistência imediata no navegador

Web Audio API — Sinal sonoro nativo do cronômetro de descanso

💻 Como Rodar o Projeto Localmente (VS Code)

Pré-requisitos

Ter o Node.js instalado em sua máquina.

Passo a Passo

Clone o repositório:

git clone https://github.com/teylonkkjk/ostrembolono.git

Acesse a pasta do projeto:

cd ostrembolono

Instale as dependências:

npm install

Inicie o servidor de desenvolvimento:

npm run dev

Abra no navegador:
Acesse o endereço exibido no terminal (geralmente http://localhost:5173).

👨‍💻 Autor

Desenvolvido por dev.teylonkkjk ⚡

Projeto OSTREMBOLONO — Performance, Biomecânica & Hipertrofia.
