import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Dumbbell,
  Calendar,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Edit3,
  ArrowUp,
  ArrowDown,
  Timer,
  Users,
  Download,
  Upload,
  RotateCcw,
  Trophy,
  Flame,
  ChevronRight,
  Activity,
  ShieldAlert,
  Play,
  Pause,
  X,
  Check,
  Sparkles,
  History,
  Settings,
  UserPlus,
  LogOut,
  TrendingUp,
  Info,
  Copy,
  FileJson,
  Zap,
  Award,
  Search,
  Save,
  BookOpen,
  Target,
  CheckCircle,
  AlertTriangle,
  Eye
} from 'lucide-react';

// ============================================================================
// CONSTANTES GLOBAIS DO SISTEMA (LOCALSTORAGE, CATEGORIAS E DIAS DA SEMANA)
// ============================================================================
const STORAGE_KEY = 'ostrembolono_v1_data';

const CATEGORIES = [
  { id: 'Peito', label: 'Peito', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  { id: 'Ombro', label: 'Ombro', badge: 'bg-lime-500/15 text-lime-400 border-lime-500/30' },
  { id: 'Perna', label: 'Perna', badge: 'bg-teal-500/15 text-teal-400 border-teal-500/30' },
  { id: 'Costa', label: 'Costa', badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' },
  { id: 'Bíceps', label: 'Bíceps', badge: 'bg-green-500/15 text-green-400 border-green-500/30' },
  { id: 'Tríceps', label: 'Tríceps', badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' }
];

const DAYS_OF_WEEK = [
  { id: 'segunda', label: 'Segunda-feira', short: 'Seg' },
  { id: 'terca', label: 'Terça-feira', short: 'Ter' },
  { id: 'quarta', label: 'Quarta-feira', short: 'Qua' },
  { id: 'quinta', label: 'Quinta-feira', short: 'Qui' },
  { id: 'sexta', label: 'Sexta-feira', short: 'Sex' },
  { id: 'sabado', label: 'Sábado', short: 'Sáb' },
  { id: 'domingo', label: 'Domingo', short: 'Dom' }
];

// ============================================================================
// ENCICLOPÉDIA COMPLETA DE EXERCÍCIOS (TODOS OS EXERCÍCIOS DO CATÁLOGO PDF)
// ============================================================================
const PDF_SUBCATEGORIES = [
  'Todos',
  'Peito',
  'Costas',
  'Ombros',
  'Tríceps',
  'Bíceps e Braquial',
  'Antebraços e Pegada',
  'Quadríceps',
  'Posterior de Coxa',
  'Glúteos',
  'Panturrilhas e Tibial',
  'Abdômen e Core',
  'Lombar e Estabilizadores',
  'Cardio e Condicionamento',
  'Funcional, Potência e Pliometria',
  'Calistenia e Peso Corporal',
  'Mobilidade e Alongamento',
  'Exercícios Olímpicos e Levantamento de Peso'
];

const RAW_PDF_EXERCISES = [
  // ================= 1. PEITO (22 EXERCÍCIOS) =================
  ['Supino reto com barra', 'Peito', 'Peito', 'Barra e Banco Reto', 'Intermediário', 'bench_press', 4, '8-10', 40, 75, ['Peitoral Maior (Porção Esternal)'], ['Deltoide Anterior', 'Tríceps Braquial'], 'Principal construtor de força e volume global para o peitoral.', 'Nunca abra os cotovelos em 90° alinhados ao pescoço; mantenha-os a 45°-60° do tronco para proteger os ombros.'],
  ['Supino reto com halteres', 'Peito', 'Peito', 'Par de Halteres e Banco Reto', 'Iniciante / Intermediário', 'bench_press', 4, '10-12', 28, 60, ['Peitoral Maior'], ['Deltoide Anterior', 'Tríceps Braquial'], 'Permite maior amplitude de alongamento e corrige assimetrias de força entre os lados.', 'Desça os halteres até a linha do peitoral mantendo as escápulas retraídas no banco.'],
  ['Supino inclinado com barra', 'Peito', 'Peito', 'Barra e Banco Inclinado', 'Intermediário', 'incline_press', 4, '8-10', 35, 75, ['Peitoral Superior (Clavicular)'], ['Deltoide Anterior', 'Tríceps'], 'Desenvolve a porção superior do peitoral próxima à clavícula com alta carga.', 'Desça a barra em direção à parte alta do peito sem perder o apoio escapular.'],
  ['Supino inclinado com halteres', 'Peito', 'Peito', 'Halteres e Banco 30° a 45°', 'Iniciante / Intermediário', 'incline_press', 4, '10-12', 24, 60, ['Peitoral Superior (Clavicular)'], ['Deltoide Anterior', 'Tríceps'], 'Preenche a região superior do peitoral com liberdade articular para os ombros.', 'Ajuste o banco entre 30° e 45° para não transferir excessivamente o foco para o deltoide.'],
  ['Supino declinado com barra', 'Peito', 'Peito', 'Barra e Banco Declinado', 'Intermediário', 'bench_press', 4, '8-12', 45, 60, ['Peitoral Inferior (Abdominal)'], ['Tríceps Braquial', 'Deltoide Anterior'], 'Enfatiza as fibras inferiores do peitoral com menor tensão nos ombros.', 'Prenda bem os pés no suporte e desça a barra até a linha inferior do esterno.'],
  ['Supino declinado com halteres', 'Peito', 'Peito', 'Halteres e Banco Declinado', 'Intermediário', 'bench_press', 4, '10-12', 26, 60, ['Peitoral Inferior'], ['Tríceps Braquial'], 'Trabalha a borda inferior do peitoral com grande amplitude e convergência no topo.', 'Controle a estabilização dos halteres ao deitar e ao finalizar a série.'],
  ['Supino articulado', 'Peito', 'Peito', 'Máquina Articulada / Hammer', 'Iniciante', 'bench_press', 4, '10-12', 50, 60, ['Peitoral Maior'], ['Tríceps Braquial', 'Deltoide Anterior'], 'Proporciona trajetória guiada convergente e máxima segurança para treinar até próximo da falha.', 'Ajuste a altura do banco para que as manoplas fiquem alinhadas ao meio do peito.'],
  ['Chest press na máquina', 'Peito', 'Peito', 'Máquina Chest Press Sentado', 'Iniciante', 'bench_press', 4, '12', 45, 60, ['Peitoral Maior'], ['Tríceps Braquial', 'Deltoide Anterior'], 'Fortalece o peitoral com estabilidade total para a coluna e articulações.', 'Mantenha os ombros baixos e encostados no estofado durante todo o empurrão.'],
  ['Crucifixo reto com halteres', 'Peito', 'Peito', 'Halteres e Banco Reto', 'Iniciante / Intermediário', 'chest_fly', 3, '12-15', 14, 45, ['Peitoral Maior (Fibras Mediais)'], ['Deltoide Anterior'], 'Isola o peitoral por meio da adução horizontal dos ombros com forte alongamento.', 'Mantenha uma leve flexão fixa nos cotovelos como se estivesse abraçando um tronco.'],
  ['Crucifixo inclinado com halteres', 'Peito', 'Peito', 'Halteres e Banco Inclinado 30°', 'Intermediário', 'chest_fly', 3, '12-15', 12, 45, ['Peitoral Superior'], ['Deltoide Anterior'], 'Isola e alonga profundamente as fibras claviculares do peitoral superior.', 'Não desça além da linha dos ombros para preservar a cápsula articular.'],
  ['Crucifixo declinado', 'Peito', 'Peito', 'Halteres e Banco Declinado', 'Intermediário', 'chest_fly', 3, '12-15', 12, 45, ['Peitoral Inferior'], ['Deltoide Anterior'], 'Isola a porção inferior do peitoral através de movimento amplo em arco.', 'Conduza o movimento pelo arco dos cotovelos sem transformar em supino.'],
  ['Peck deck / voador', 'Peito', 'Peito', 'Máquina Peck Deck / Voador', 'Iniciante', 'chest_fly', 4, '12-15', 50, 45, ['Peitoral Maior (Região Central e Esternal)'], ['Deltoide Anterior'], 'Isola o peitoral com tensão contínua do início ao pico de contração central.', 'Segure 1 a 2 segundos com os braços fechados no centro esmagando o peitoral.'],
  ['Crossover na polia alta', 'Peito', 'Peito', 'Cross Over (Polias Altas)', 'Intermediário', 'chest_fly', 4, '12-15', 20, 45, ['Peitoral Inferior e Central'], ['Deltoide Anterior', 'Serrátil'], 'Desenha a linha inferior e interna do peitoral com tensão constante dos cabos.', 'Puxe as alças para baixo e para o centro mantendo o tronco levemente inclinado e firme.'],
  ['Crossover na polia média', 'Peito', 'Peito', 'Cross Over (Polias na Altura do Peito)', 'Intermediário', 'chest_fly', 4, '12-15', 18, 45, ['Peitoral Medial (Esternal)'], ['Deltoide Anterior'], 'Foca diretamente no meio do peitoral graças ao vetor horizontal dos cabos.', 'Cruze levemente as mãos ou una os punhos à frente do esterno para contração máxima.'],
  ['Crossover na polia baixa', 'Peito', 'Peito', 'Cross Over (Polias Baixas)', 'Intermediário', 'chest_fly', 3, '12-15', 12, 45, ['Peitoral Superior (Clavicular)'], ['Deltoide Anterior'], 'Recruta intensamente o peitoral superior puxando os cabos de baixo para cima.', 'Suba as mãos em arco até a altura do queixo/rosto mantendo os cotovelos semiflexionados.'],
  ['Flexão de braços tradicional', 'Peito', 'Peito', 'Peso Corporal', 'Iniciante', 'bench_press', 4, '15-20', 0, 45, ['Peitoral Maior'], ['Tríceps Braquial', 'Deltoide Anterior', 'Core'], 'Exercício clássico com peso corporal para força, resistência de peito e estabilidade do core.', 'Mantenha o corpo reto como uma prancha, sem deixar o quadril cair.'],
  ['Flexão inclinada', 'Peito', 'Peito', 'Banco ou Caixa de Apoio', 'Iniciante', 'incline_press', 3, '15', 0, 45, ['Peitoral Inferior e Geral'], ['Tríceps', 'Deltoide Anterior'], 'Versão mais acessível da flexão com mãos apoiadas em superfície elevada, ideal para iniciantes.', 'Desça o peito até próximo da borda do banco mantendo o abdômen contraído.'],
  ['Flexão declinada', 'Peito', 'Peito', 'Peso Corporal e Banco para os Pés', 'Intermediário', 'incline_press', 4, '12-15', 0, 45, ['Peitoral Superior'], ['Deltoide Anterior', 'Tríceps', 'Core'], 'Com os pés elevados no banco, aumenta a carga e foca na porção superior do peitoral.', 'Evite arquear a lombar; mantenha o olhar voltado para o chão.'],
  ['Flexão diamante', 'Peito', 'Peito', 'Peso Corporal', 'Intermediário', 'bench_press', 3, '10-15', 0, 45, ['Tríceps Braquial', 'Peitoral Interno'], ['Deltoide Anterior'], 'Com indicadores e polegares unidos formando um diamante, enfatiza o miolo do peito e tríceps.', 'Mantenha os cotovelos rentes ao tronco durante a descida.'],
  ['Flexão com pegada aberta', 'Peito', 'Peito', 'Peso Corporal', 'Iniciante / Intermediário', 'bench_press', 3, '12-15', 0, 45, ['Peitoral Maior (Fibras Externas)'], ['Deltoide Anterior'], 'Reduz a participação do tríceps e amplia o alongamento do peitoral.', 'Posicione as mãos além da largura dos ombros com dedos levemente voltados para fora.'],
  ['Flexão com apoio unilateral', 'Peito', 'Peito', 'Peso Corporal / Medicine Ball / Step', 'Avançado', 'bench_press', 3, '8-10 cada', 0, 60, ['Peitoral Maior Unilateral'], ['Tríceps', 'Core Antirrotação'], 'Desenvolve força assimétrica e potência unilateral no peitoral e ombro.', 'Afaste mais os pés no chão para garantir equilíbrio do quadril.'],
  ['Pullover na polia', 'Peito', 'Peito', 'Polia Alta e Barra / Corda', 'Intermediário', 'lat_pulldown', 3, '12-15', 25, 45, ['Peitoral Maior', 'Grande Dorsal', 'Serrátil'], ['Cabeça Longa do Tríceps'], 'Trabalha a expansão da caixa torácica, serrátil e conexão entre peitoral e dorsal.', 'Mantenha os cotovelos travados em leve flexão e movimente apenas a articulação do ombro.'],

  // ================= 2. COSTAS (24 EXERCÍCIOS) =================
  ['Puxada frontal aberta', 'Costas', 'Costa', 'Máquina Pulley Alto', 'Iniciante', 'lat_pulldown', 4, '10-12', 60, 60, ['Grande Dorsal (Latíssimo do Dorso)'], ['Bíceps Braquial', 'Redondo Maior'], 'Alarga as costas desenvolvendo o formato em V ao recrutar o grande dorsal.', 'Estufe o peito e puxe a barra até a parte alta do peitoral, apontando os cotovelos para o chão.'],
  ['Puxada frontal supinada', 'Costas', 'Costa', 'Máquina Pulley Alto', 'Iniciante', 'lat_pulldown', 4, '10-12', 55, 60, ['Grande Dorsal (Fibras Inferiores)'], ['Bíceps Braquial'], 'Com palmas voltadas para você, permite grande amplitude e forte auxílio do bíceps.', 'Mantenha os cotovelos avançando rente ao corpo ao descer a barra.'],
  ['Puxada frontal neutra', 'Costas', 'Costa', 'Pulley Alto com Triângulo ou Barra Romana', 'Iniciante', 'lat_pulldown', 4, '10-12', 55, 60, ['Grande Dorsal', 'Redondo Maior'], ['Bíceps', 'Braquiorradial'], 'Proporciona posição anatômica confortável para os ombros e forte foco no meio e baixo dorsal.', 'Incline suavemente o tronco 15° para trás e traga o puxador ao esterno.'],
  ['Puxada atrás (não recomendada para a maioria)', 'Costas', 'Costa', 'Máquina Pulley Alto', 'Avançado', 'lat_pulldown', 3, '12', 40, 60, ['Grande Dorsal', 'Trapézio'], ['Deltoide Posterior', 'Bíceps'], 'Variação clássica de puxada, porém exige extrema mobilidade glenoumeral (prefira a puxada frontal).', 'Conforme alerta o catálogo, evite caso sinta qualquer desconforto cervical ou nos ombros; prefira puxar pela frente.'],
  ['Barra fixa pronada', 'Costas', 'Costa', 'Barra Fixa', 'Intermediário / Avançado', 'lat_pulldown', 4, '6-12', 0, 75, ['Grande Dorsal', 'Redondo Maior'], ['Bíceps', 'Trapézio Inferior', 'Core'], 'Exercício padrão-ouro com peso corporal para largura e força real de costas.', 'Inicie o movimento deprimindo as escápulas antes de dobrar os cotovelos.'],
  ['Barra fixa supinada', 'Costas', 'Costa', 'Barra Fixa (Chin-up)', 'Intermediário', 'lat_pulldown', 4, '8-12', 0, 75, ['Grande Dorsal', 'Bíceps Braquial'], ['Braquial', 'Core'], 'Combina trabalho intenso de dorsais com recrutamento máximo dos bíceps.', 'Suba até o queixo ultrapassar a barra e desça alongando totalmente os braços.'],
  ['Barra fixa neutra', 'Costas', 'Costa', 'Barra Fixa com Pegada Paralela', 'Intermediário', 'lat_pulldown', 4, '8-12', 0, 75, ['Grande Dorsal', 'Braquiorradial'], ['Bíceps', 'Romboides'], 'Versão de barra fixa mais amigável para punhos e ombros.', 'Mantenha o peito aberto mirando o esterno em direção às mãos.'],
  ['Barra fixa assistida', 'Costas', 'Costa', 'Máquina Graviton ou Superband', 'Iniciante', 'lat_pulldown', 4, '10-12', 30, 60, ['Grande Dorsal'], ['Bíceps Braquial'], 'Permite dominar a técnica completa da barra fixa com contrapeso auxiliar.', 'Reduza gradualmente o peso de assistência semana a semana conforme ganhar força.'],
  ['Remada curvada com barra', 'Costas', 'Costa', 'Barra Livre', 'Intermediário / Avançado', 'barbell_row', 4, '8-10', 55, 75, ['Grande Dorsal', 'Trapézio Médio e Romboides'], ['Eretores da Espinha', 'Deltoide Posterior', 'Bíceps'], 'Constrói densidade e espessura muscular em toda a região dorsal.', 'Mantenha o tronco inclinado a cerca de 45° com a coluna neutra e puxe a barra na direção do umbigo.'],
  ['Remada curvada com halteres', 'Costas', 'Costa', 'Par de Halteres', 'Intermediário', 'barbell_row', 4, '10-12', 22, 60, ['Grande Dorsal', 'Romboides'], ['Deltoide Posterior', 'Bíceps', 'Lombar'], 'Trabalha a espessura das costas com liberdade de rotação dos punhos e simetria bilateral.', 'Aperte as escápulas no topo por 1 segundo sem dar impulsos com a lombar.'],
  ['Remada unilateral com halter', 'Costas', 'Costa', 'Halter e Banco', 'Iniciante / Intermediário', 'barbell_row', 4, '10-12', 28, 60, ['Grande Dorsal Unilateral'], ['Romboides', 'Trapézio', 'Bíceps'], 'Isola cada lado das costas com apoio no banco para aliviar a coluna lombar.', 'Puxe o halter fazendo um arco em direção ao quadril, e não em direção ao ombro.'],
  ['Remada serrote', 'Costas', 'Costa', 'Halter Pesado e Banco Reto', 'Intermediário', 'barbell_row', 4, '10-12', 32, 60, ['Grande Dorsal (Fibras Laterais e Inferiores)'], ['Redondo Maior', 'Trapézio Médio', 'Bíceps'], 'Promove alongamento profundo na descida e contração máxima unilateral da dorsal.', 'Deixe o ombro alongar na parte baixa e retraia a escápula antes de puxar o halter.'],
  ['Remada baixa com triângulo', 'Costas', 'Costa', 'Polia Baixa e Puxador Triângulo', 'Iniciante', 'barbell_row', 4, '10-12', 55, 60, ['Grande Dorsal', 'Romboides'], ['Bíceps Braquial', 'Eretores da Espinha'], 'Desenvolve o miolo e a porção inferior das costas com tensão contínua do cabo.', 'Mantenha a coluna ereta e traga o triângulo ao abdômen com cotovelos colados ao corpo.'],
  ['Remada baixa aberta', 'Costas', 'Costa', 'Polia Baixa e Barra Longa', 'Iniciante / Intermediário', 'barbell_row', 4, '10-12', 50, 60, ['Trapézio Médio', 'Romboides', 'Deltoide Posterior'], ['Grande Dorsal', 'Bíceps'], 'Por usar pegada mais aberta, enfatiza a parte alta das costas e escápulas.', 'Puxe a barra na direção da linha superior do abdômen abrindo levemente os cotovelos.'],
  ['Remada cavalinho / T-bar', 'Costas', 'Costa', 'Barra T / Cavalinho', 'Intermediário / Avançado', 'barbell_row', 4, '8-12', 60, 75, ['Grande Dorsal', 'Trapézio Médio', 'Romboides'], ['Bíceps', 'Lombar'], 'Clássico do fisiculturismo para ganho extremo de densidade e espessura dorsal.', 'Mantenha os joelhos semiflexionados, peito estufado e coluna totalmente travada.'],
  ['Remada articulada', 'Costas', 'Costa', 'Máquina Articulada para Costas', 'Iniciante', 'barbell_row', 4, '10-12', 60, 60, ['Grande Dorsal', 'Romboides'], ['Bíceps Braquial'], 'Garante trajetória biomecânica perfeita e segurança para cargas altas.', 'Concentre-se em puxar com os cotovelos para trás, evitando tensionar o pescoço.'],
  ['Remada máquina com apoio no peito', 'Costas', 'Costa', 'Máquina Chest-Supported Row', 'Iniciante', 'barbell_row', 4, '10-12', 50, 60, ['Grande Dorsal', 'Trapézio Médio', 'Romboides'], ['Deltoide Posterior', 'Bíceps'], 'Com o peito apoiado no estofado, elimina 100% da sobrecarga na lombar e impede roubos.', 'Mantenha o esterno colado no apoio durante toda a puxada.'],
  ['Pulldown com braços estendidos', 'Costas', 'Costa', 'Polia Alta e Barra / Corda', 'Iniciante / Intermediário', 'lat_pulldown', 4, '12-15', 30, 45, ['Grande Dorsal', 'Redondo Maior'], ['Cabeça Longa do Tríceps', 'Core'], 'Único exercício que isola os dorsais sem participação dos bíceps.', 'Com cotovelos quase totalmente estendidos, descreva um arco da linha dos olhos até as coxas.'],
  ['Pullover com halter', 'Costas', 'Costa', 'Halter e Banco Reto', 'Intermediário', 'bench_press', 3, '12', 22, 60, ['Grande Dorsal', 'Peitoral Maior', 'Serrátil Anterior'], ['Tríceps (Cabeça Longa)'], 'Alonga os dorsais sob carga e trabalha a transição entre peitoral e costas.', 'Apoie a parte superior das costas no banco e desça o halter atrás da cabeça com cotovelos semiflexionados.'],
  ['Pullover na polia (Costas)', 'Costas', 'Costa', 'Polia Alta e Corda / Barra', 'Intermediário', 'lat_pulldown', 3, '12-15', 30, 45, ['Grande Dorsal'], ['Serrátil', 'Redondo Maior'], 'Mantém tensão nos dorsais mesmo no final do movimento junto ao quadril.', 'Imagine espremer as axilas para baixo ao encostar a barra nas coxas.'],
  ['Levantamento terra', 'Costas', 'Costa', 'Barra Olímpica e Anilhas', 'Avançado', 'squat', 4, '5-8', 100, 120, ['Cadeia Posterior Completa', 'Eretores da Espinha', 'Grande Dorsal'], ['Glúteos', 'Isquiotibiais', 'Trapézio', 'Antebraço'], 'Um dos exercícios mais completos de força bruta para toda a cadeia posterior.', 'Mantenha a barra colada às canelas, trave o abdômen e suba estendendo joelhos e quadril simultaneamente.'],
  ['Rack pull', 'Costas', 'Costa', 'Barra na Gaiola (Altura dos Joelhos)', 'Intermediário / Avançado', 'barbell_row', 4, '6-8', 110, 90, ['Trapézio', 'Eretores da Espinha', 'Grande Dorsal'], ['Glúteos', 'Antebraços'], 'Levantamento terra parcial focado na metade superior do movimento para espessura das costas.', 'Posicione as travas da gaiola logo abaixo ou na linha dos joelhos e retraia forte as escápulas no topo.'],
  ['Good morning', 'Costas', 'Costa', 'Barra nas Costas', 'Intermediário / Avançado', 'squat', 3, '10-12', 40, 60, ['Eretores da Espinha (Lombar)', 'Isquiotibiais'], ['Glúteo Máximo'], 'Fortalece a cadeia posterior e os paravertebrais através da flexão de quadril.', 'Use carga moderada, destrave os joelhos e incline o tronco mantendo a coluna reta.'],
  ['Extensão lombar', 'Costas', 'Costa', 'Banco Romano 45° ou 90°', 'Iniciante', 'barbell_row', 3, '12-15', 0, 45, ['Eretores da Espinha (Lombar)'], ['Glúteo Máximo', 'Posteriores de Coxa'], 'Fortalece a região lombar e previne dores nas costas.', 'Suba até alinhar o tronco com as pernas; evite hiperestender a coluna para trás no topo.'],

  // ================= 3. OMBROS (18 EXERCÍCIOS) =================
  ['Desenvolvimento militar com barra', 'Ombros', 'Ombro', 'Barra Livre (Em Pé ou Sentado)', 'Intermediário', 'shoulder_press', 4, '8-10', 35, 75, ['Deltoide Anterior e Lateral'], ['Tríceps Braquial', 'Trapézio Superior', 'Core'], 'Clássico construtor de força e massa muscular para toda a cintura escapular.', 'Contraia glúteos e abdômen para não arquear a lombar ao empurrar a barra acima da cabeça.'],
  ['Desenvolvimento com halteres', 'Ombros', 'Ombro', 'Par de Halteres e Banco 75°-90°', 'Iniciante / Intermediário', 'shoulder_press', 4, '10-12', 20, 60, ['Deltoide Anterior', 'Deltoide Lateral'], ['Tríceps Braquial'], 'Promove hipertrofia simétrica dos ombros com liberdade para a articulação glenoumeral.', 'Mantenha os cotovelos levemente avançados (cerca de 20° à frente da linha dos ombros).'],
  ['Desenvolvimento na máquina', 'Ombros', 'Ombro', 'Máquina Shoulder Press', 'Iniciante', 'shoulder_press', 4, '10-12', 40, 60, ['Deltoide Anterior e Lateral'], ['Tríceps Braquial'], 'Permite focar na força de empurrar verticalmente com total estabilidade.', 'Não deixe os pesos baterem no final da descida para manter tensão contínua nos deltoides.'],
  ['Arnold press', 'Ombros', 'Ombro', 'Par de Halteres', 'Intermediário', 'shoulder_press', 4, '10-12', 18, 60, ['Deltoide Anterior, Lateral e Posterior'], ['Tríceps Braquial'], 'Criado por Arnold Schwarzenegger, trabalha todas as porções do ombro com rotação durante a subida.', 'Inicie com as palmas voltadas para o rosto e gire gradualmente enquanto empurra para cima.'],
  ['Elevação lateral com halteres', 'Ombros', 'Ombro', 'Par de Halteres', 'Iniciante', 'lateral_raise', 4, '12-15', 12, 45, ['Deltoide Lateral (Médio)'], ['Trapézio Superior'], 'Principal exercício isolador para dar largura aos ombros.', 'Lidere a subida pelos cotovelos até a linha dos ombros, evitando impulsos com o corpo.'],
  ['Elevação lateral na polia', 'Ombros', 'Ombro', 'Polia Baixa', 'Intermediário', 'lateral_raise', 4, '12-15', 10, 45, ['Deltoide Lateral'], ['Supraespinhal'], 'Ao contrário do halter, a polia mantém tensão máxima no deltoide já nos primeiros graus da subida.', 'Cruze o cabo pela frente ou por trás do corpo e suba de forma limpa até a linha do ombro.'],
  ['Elevação lateral na máquina', 'Ombros', 'Ombro', 'Máquina de Elevação Lateral', 'Iniciante', 'lateral_raise', 4, '12-15', 30, 45, ['Deltoide Lateral'], ['Trapézio'], 'Isola perfeitamente o deltoide lateral apoiando os antebraços nas almofadas.', 'Empurre as almofadas com os cotovelos, relaxando a tensão das mãos.'],
  ['Elevação frontal com halteres', 'Ombros', 'Ombro', 'Par de Halteres', 'Iniciante', 'lateral_raise', 3, '12', 10, 45, ['Deltoide Anterior'], ['Peitoral Superior'], 'Trabalha diretamente a cabeça frontal do ombro de forma alternada ou simultânea.', 'Pare a subida na linha dos olhos para não sobrecarregar a articulação.'],
  ['Elevação frontal com barra', 'Ombros', 'Ombro', 'Barra Reta ou W', 'Iniciante', 'lateral_raise', 3, '12', 18, 45, ['Deltoide Anterior'], ['Peitoral Clavicular'], 'Isola a porção frontal dos deltoides com estabilidade bilateral.', 'Mantenha o tronco firme sem jogar o quadril para frente ao subir a barra.'],
  ['Elevação frontal na polia', 'Ombros', 'Ombro', 'Polia Baixa com Corda ou Barra', 'Iniciante', 'lateral_raise', 3, '12-15', 15, 45, ['Deltoide Anterior'], ['Peitoral Superior'], 'Garante resistência uniforme do cabo do início ao topo do movimento.', 'De costas para a polia com o cabo entre as pernas, eleve até a altura do queixo/olhos.'],
  ['Crucifixo inverso com halteres', 'Ombros', 'Ombro', 'Par de Halteres', 'Iniciante / Intermediário', 'chest_fly', 4, '12-15', 10, 45, ['Deltoide Posterior'], ['Romboides', 'Trapézio Médio'], 'Fortalece a parte de trás do ombro com o tronco inclinado à frente.', 'Incline o tronco quase paralelo ao chão e abra os braços liderando pelos cotovelos.'],
  ['Crucifixo inverso na máquina', 'Ombros', 'Ombro', 'Máquina Peck Deck Inverso', 'Iniciante', 'chest_fly', 4, '12-15', 40, 45, ['Deltoide Posterior'], ['Trapézio Médio', 'Romboides'], 'Isola o deltoide posterior com o peito apoiado no banco.', 'Mantenha os ombros baixos (longe das orelhas) ao abrir as alças para trás.'],
  ['Face pull', 'Ombros', 'Ombro', 'Polia Alta com Corda', 'Iniciante / Intermediário', 'barbell_row', 4, '15', 20, 45, ['Deltoide Posterior', 'Manguito Rotador'], ['Trapézio Médio e Inferior'], 'Essencial para saúde dos ombros, postura e fortalecimento do deltoide posterior e manguito.', 'Puxe a corda em direção à testa abrindo as mãos e fazendo rotação externa dos ombros no final.'],
  ['Remada alta com barra', 'Ombros', 'Ombro', 'Barra Reta ou W', 'Intermediário', 'shoulder_press', 3, '10-12', 25, 60, ['Deltoide Lateral', 'Trapézio Superior'], ['Bíceps', 'Antebraço'], 'Trabalha simultaneamente os deltoides laterais e o trapézio.', 'Use pegada na largura dos ombros e suba apenas até o peito (cotovelos na linha dos ombros) para evitar impacto articular.'],
  ['Remada alta na polia', 'Ombros', 'Ombro', 'Polia Baixa com Barra ou Corda', 'Iniciante / Intermediário', 'shoulder_press', 3, '12-15', 25, 45, ['Deltoide Lateral', 'Trapézio Superior'], ['Deltoide Anterior'], 'Versão mais fluida e contínua da remada alta utilizando o cabo.', 'Suba puxando pelos cotovelos até a linha dos ombros e controle a descida.'],
  ['Y-raise', 'Ombros', 'Ombro', 'Halteres Leves ou Cabos no Banco Inclinado', 'Intermediário', 'lateral_raise', 3, '12-15', 6, 45, ['Trapézio Inferior', 'Deltoide Lateral e Anterior'], ['Manguito Rotador'], 'Eleva os braços formando um "Y", fortalecendo estabilizadores escapulares e deltoides.', 'Use cargas leves e foque na estabilidade das escápulas no topo.'],
  ['Rotação externa com elástico ou polia', 'Ombros', 'Ombro', 'Elástico ou Polia na Altura do Cotovelo', 'Iniciante', 'bicep_curl', 3, '15', 5, 30, ['Infraespinhal', 'Redondo Menor (Manguito Rotador)'], ['Deltoide Posterior'], 'Fortalece o manguito rotador, prevenindo lesões no supino e desenvolvimento.', 'Mantenha o cotovelo dobrado a 90° colado na costela e gire o antebraço para fora.'],
  ['Rotação interna com elástico ou polia', 'Ombros', 'Ombro', 'Elástico ou Polia na Altura do Cotovelo', 'Iniciante', 'bicep_curl', 3, '15', 5, 30, ['Subescapular (Manguito Rotador)'], ['Peitoral Maior'], 'Estabiliza a parte anterior da cápsula do ombro.', 'Com cotovelo a 90° preso ao lado do tronco, gire o antebraço em direção ao abdômen com controle.'],

  // ================= 4. TRÍCEPS (13 EXERCÍCIOS) =================
  ['Tríceps pulley com barra', 'Tríceps', 'Tríceps', 'Polia Alta e Barra Reta ou W', 'Iniciante', 'tricep_pushdown', 4, '10-12', 30, 45, ['Tríceps Braquial (Cabeça Lateral e Medial)'], [], 'Isola o tríceps com alta estabilidade e foco na face lateral do braço.', 'Trave os cotovelos ao lado das costelas e mova apenas os antebraços.'],
  ['Tríceps pulley com corda', 'Tríceps', 'Tríceps', 'Polia Alta e Corda', 'Iniciante', 'tricep_pushdown', 4, '12-15', 25, 45, ['Tríceps Braquial (Ênfase na Cabeça Lateral)'], ['Ancôneo'], 'Permite abrir as extremidades da corda embaixo para contração máxima do tríceps.', 'Afaste as mãos no final da extensão e segure 1 segundo antes de subir.'],
  ['Tríceps testa com barra', 'Tríceps', 'Tríceps', 'Barra W ou Reta e Banco Reto', 'Intermediário', 'bench_press', 4, '10-12', 24, 60, ['Tríceps Braquial (Todas as 3 Cabeças)'], [], 'Grande construtor de volume global para as três cabeças do tríceps.', 'Mantenha os braços levemente inclinados para trás para manter tensão mesmo no topo.'],
  ['Tríceps testa com halteres', 'Tríceps', 'Tríceps', 'Par de Halteres e Banco Reto', 'Intermediário', 'bench_press', 4, '10-12', 12, 60, ['Tríceps Braquial'], [], 'Alivia a pressão nos punhos com pegada neutra e trabalha cada braço igualmente.', 'Desça os halteres ao lado das orelhas mantendo os cotovelos apontados para o teto.'],
  ['Tríceps francês unilateral', 'Tríceps', 'Tríceps', 'Halter Único', 'Iniciante / Intermediário', 'shoulder_press', 3, '10-12 cada', 12, 45, ['Cabeça Longa do Tríceps'], ['Cabeça Medial'], 'Alonga profundamente a cabeça longa do tríceps de forma individual em cada braço.', 'Use a mão livre para apoiar e estabilizar o cotovelo que está trabalhando.'],
  ['Tríceps francês bilateral', 'Tríceps', 'Tríceps', 'Halter Pesado ou Barra W', 'Iniciante / Intermediário', 'shoulder_press', 4, '10-12', 26, 60, ['Cabeça Longa do Tríceps'], ['Cabeça Lateral e Medial'], 'Trabalha a maior porção do tríceps com os braços elevados acima da cabeça.', 'Desça o halter atrás da nuca alongando bem e estenda sem abrir demais os cotovelos.'],
  ['Tríceps coice com halter', 'Tríceps', 'Tríceps', 'Halter e Banco', 'Iniciante', 'barbell_row', 3, '12-15', 8, 45, ['Tríceps Braquial (Pico de Contração)'], ['Deltoide Posterior'], 'Enfatiza o encurtamento máximo do tríceps quando o braço fica paralelo ao tronco.', 'Mantenha o cotovelo alto e fixo ao lado do tronco; só o antebraço se move para trás.'],
  ['Tríceps coice na polia', 'Tríceps', 'Tríceps', 'Polia Baixa', 'Intermediário', 'barbell_row', 3, '12-15', 10, 45, ['Tríceps Braquial'], [], 'Aprimora o tríceps coice mantendo resistência constante desde o início da extensão.', 'Incline o tronco a 45° e estenda o cabo completamente para trás.'],
  ['Mergulho nas paralelas', 'Tríceps', 'Tríceps', 'Barras Paralelas', 'Intermediário / Avançado', 'tricep_pushdown', 4, '8-12', 0, 60, ['Tríceps Braquial'], ['Peitoral Inferior', 'Deltoide Anterior'], 'Exercício composto de peso corporal para força e hipertrofia intensa dos tríceps.', 'Mantenha o tronco o mais vertical possível para focar no tríceps.'],
  ['Mergulho no banco', 'Tríceps', 'Tríceps', 'Banco Reto', 'Iniciante', 'tricep_pushdown', 3, '12-15', 0, 45, ['Tríceps Braquial'], ['Deltoide Anterior'], 'Variação prática usando um banco para trabalhar tríceps com o peso do corpo.', 'Desça apenas até os cotovelos formarem 90° mantendo o quadril bem próximo ao banco.'],
  ['Supino fechado', 'Tríceps', 'Tríceps', 'Barra e Banco Reto', 'Intermediário', 'bench_press', 4, '8-10', 40, 60, ['Tríceps Braquial'], ['Peitoral Maior', 'Deltoide Anterior'], 'Permite movimentar grandes cargas focando nos tríceps através da pegada na largura dos ombros.', 'Desça a barra mantendo os cotovelos colados às costelas.'],
  ['Flexão diamante (Tríceps)', 'Tríceps', 'Tríceps', 'Peso Corporal', 'Intermediário', 'bench_press', 3, '12-15', 0, 45, ['Tríceps Braquial'], ['Peitoral Medial', 'Deltoide Anterior'], 'Variação de flexão com mãos juntas que recruta fortemente os tríceps.', 'Evite abrir os cotovelos para os lados durante a subida.'],
  ['Extensão de tríceps acima da cabeça na polia', 'Tríceps', 'Tríceps', 'Polia e Corda', 'Iniciante / Intermediário', 'shoulder_press', 4, '12-15', 22, 45, ['Cabeça Longa do Tríceps'], ['Cabeça Lateral e Medial'], 'Une o alongamento acima da cabeça com a tensão contínua da polia.', 'De costas para a polia, incline o corpo à frente e estenda a corda acima e à frente da cabeça.'],

  // ================= 5. BÍCEPS E BRAQUIAL (15 EXERCÍCIOS) =================
  ['Rosca direta com barra', 'Bíceps e Braquial', 'Bíceps', 'Barra Reta', 'Iniciante', 'bicep_curl', 4, '10-12', 26, 60, ['Bíceps Braquial (Cabeça Curta e Longa)'], ['Braquial', 'Antebraço'], 'Clássico absoluto para ganho de massa e força bruta nos bíceps com supinação total.', 'Mantenha os cotovelos fixos ao lado do tronco sem balançar a lombar.'],
  ['Rosca direta com barra W', 'Bíceps e Braquial', 'Bíceps', 'Barra W', 'Iniciante', 'bicep_curl', 4, '10-12', 28, 60, ['Bíceps Braquial'], ['Braquial', 'Braquiorradial'], 'Oferece angulação ergonômica para os punhos e cotovelos permitindo cargas elevadas.', 'Controle a fase excêntrica (descida) em 2 a 3 segundos.'],
  ['Rosca alternada com halteres', 'Bíceps e Braquial', 'Bíceps', 'Par de Halteres', 'Iniciante', 'bicep_curl', 3, '10-12', 14, 45, ['Bíceps Braquial'], ['Braquial', 'Supinadores'], 'Permite girar o punho (supinar) durante a subida, ativando todas as funções do bíceps.', 'Gire a palma da mão para cima conforme o halter sobe.'],
  ['Rosca simultânea', 'Bíceps e Braquial', 'Bíceps', 'Par de Halteres', 'Iniciante', 'bicep_curl', 3, '10-12', 14, 45, ['Bíceps Braquial'], ['Braquial'], 'Subida simultânea dos dois halteres mantendo tempo sob tensão contínuo e evitando balanço lateral.', 'Mantenha o peito aberto e evite jogar os ombros para frente no final.'],
  ['Rosca martelo', 'Bíceps e Braquial', 'Bíceps', 'Par de Halteres', 'Iniciante', 'bicep_curl', 4, '12', 16, 45, ['Braquial', 'Braquiorradial'], ['Cabeça Longa do Bíceps'], 'Foca no músculo braquial e no antebraço, dando maior espessura lateral ao braço.', 'Mantenha as palmas voltadas uma para a outra do início ao fim.'],
  ['Rosca martelo cruzada', 'Bíceps e Braquial', 'Bíceps', 'Par de Halteres', 'Iniciante / Intermediário', 'bicep_curl', 3, '12 cada', 14, 45, ['Braquial', 'Braquiorradial', 'Cabeça Longa do Bíceps'], [], 'Cruza o halter à frente do peito em direção ao ombro oposto, enfatizando o braquial.', 'Suba um braço de cada vez rente ao abdômen e peito sem girar o tronco.'],
  ['Rosca Scott com barra', 'Bíceps e Braquial', 'Bíceps', 'Banco Scott e Barra W', 'Iniciante / Intermediário', 'bicep_curl', 4, '10-12', 25, 60, ['Bíceps Braquial (Porção Distal / Cabeça Curta)'], ['Braquial'], 'Isola os bíceps apoiando os braços na almofada e impedindo qualquer impulso.', 'Encaixe bem as axilas no topo do banco e alongue com controle na descida.'],
  ['Rosca Scott com halteres', 'Bíceps e Braquial', 'Bíceps', 'Banco Scott e Halter', 'Iniciante / Intermediário', 'bicep_curl', 3, '10-12', 12, 45, ['Bíceps Braquial Unilateral'], ['Braquial'], 'Permite trabalho unilateral isolado no banco Scott corrigindo diferenças entre os braços.', 'Não desencoste o tríceps da almofada ao subir o peso.'],
  ['Rosca concentrada', 'Bíceps e Braquial', 'Bíceps', 'Halter e Banco', 'Iniciante', 'bicep_curl', 3, '12 cada', 12, 45, ['Pico do Bíceps Braquial'], ['Braquial'], 'Isolamento máximo apoiando a parte posterior do braço na parte interna da coxa.', 'Contraia forte o bíceps por 1 segundo no topo de cada repetição.'],
  ['Rosca na polia baixa', 'Bíceps e Braquial', 'Bíceps', 'Polia Baixa com Barra ou Corda', 'Iniciante', 'bicep_curl', 4, '12-15', 25, 45, ['Bíceps Braquial'], ['Braquial'], 'Mantém tensão uniforme no bíceps durante todo o arco de movimento.', 'Dê meio passo para trás para manter o cabo tensionado mesmo com o braço esticado.'],
  ['Rosca na polia alta', 'Bíceps e Braquial', 'Bíceps', 'Cross Over (Polias Altas)', 'Intermediário', 'chest_fly', 3, '12-15', 15, 45, ['Cabeça Curta do Bíceps (Pico)'], [], 'Trabalha o bíceps na posição de duplo bíceps, excelente para pico de contração.', 'Mantenha os cotovelos elevados na linha dos ombros enquanto puxa as alças em direção às orelhas.'],
  ['Rosca spider', 'Bíceps e Braquial', 'Bíceps', 'Banco Inclinado 45° e Barra / Halteres', 'Intermediário', 'bicep_curl', 3, '12', 20, 45, ['Bíceps Braquial'], ['Braquial'], 'Executada com o peito apoiado no banco inclinado e braços livres à frente, gerando pico intenso.', 'Mantenha os braços perpendiculares ao solo sem balançar os cotovelos para trás.'],
  ['Rosca inversa', 'Bíceps e Braquial', 'Bíceps', 'Barra W ou Reta (Pegada Pronada)', 'Iniciante', 'bicep_curl', 3, '12-15', 18, 45, ['Braquiorradial (Antebraço)', 'Braquial'], ['Bíceps Braquial'], 'Com as palmas voltadas para baixo, desenvolve fortemente os extensores do antebraço e o braquial.', 'Mantenha os punhos retos e firmes, sem deixá-los dobrar para baixo.'],
  ['Rosca Zottman', 'Bíceps e Braquial', 'Bíceps', 'Par de Halteres', 'Intermediário', 'bicep_curl', 3, '10-12', 12, 45, ['Bíceps Braquial', 'Braquiorradial'], ['Braquial'], 'Sobe com pegada supinada (foco no bíceps) e desce com pegada pronada (foco no antebraço).', 'Gire as palmas para baixo no topo e desça lentamente em 3 segundos.'],
  ['Chin-up', 'Bíceps e Braquial', 'Bíceps', 'Barra Fixa (Pegada Supinada)', 'Intermediário', 'lat_pulldown', 4, '6-12', 0, 75, ['Bíceps Braquial', 'Grande Dorsal'], ['Braquial', 'Core'], 'Barra fixa com palmas voltadas para o rosto, um dos melhores exercícios compostos para bíceps.', 'Puxe o corpo focando na flexão dos cotovelos até o queixo passar da barra.'],

  // ================= 6. ANTEBRAÇOS E PEGADA (9 EXERCÍCIOS) =================
  ['Flexão de punho com barra', 'Antebraços e Pegada', 'Bíceps', 'Barra e Banco', 'Iniciante', 'bicep_curl', 4, '15-20', 16, 45, ['Flexores do Antebraço'], [], 'Hipertrofia e fortalece a parte interna do antebraço.', 'Apoie os antebraços nas coxas ou no banco deixando apenas as mãos livres para subir e descer a barra.'],
  ['Flexão de punho com halteres', 'Antebraços e Pegada', 'Bíceps', 'Halter e Banco', 'Iniciante', 'bicep_curl', 3, '15-20', 10, 45, ['Flexores do Antebraço Unilateral'], [], 'Permite trabalhar cada antebraço isoladamente com amplitude completa dos dedos ao punho.', 'Deixe o halter rolar até a ponta dos dedos na descida e feche o punho subindo máximo.'],
  ['Extensão de punho', 'Antebraços e Pegada', 'Bíceps', 'Barra ou Halteres', 'Iniciante', 'bicep_curl', 3, '15-20', 8, 45, ['Extensores do Antebraço'], [], 'Fortalece a face superior do antebraço e previne epicondilite (dor no cotovelo).', 'Com as palmas voltadas para baixo apoiadas no banco, eleve o dorso das mãos.'],
  ['Rosca inversa (Antebraço)', 'Antebraços e Pegada', 'Bíceps', 'Barra ou Polia Baixa', 'Iniciante', 'bicep_curl', 4, '12-15', 18, 45, ['Braquiorradial', 'Extensores do Carpo'], ['Braquial'], 'Aumenta o volume da parte superior próxima ao cotovelo.', 'Suba de forma controlada mantendo os cotovelos colados ao tronco.'],
  ["Farmer's walk / caminhada do fazendeiro", 'Antebraços e Pegada', 'Costa', 'Halteres Pesados ou Trap Bar', 'Iniciante / Intermediário', 'squat', 4, '30-40m', 32, 60, ['Pegada e Antebraços', 'Trapézio', 'Core'], ['Glúteos', 'Panturrilhas'], 'Desenvolve força brutal de pegada, estabilidade de core e condicionamento geral.', 'Caminhe com postura alta, ombros retraídos e abdômen travado segurando os pesos ao lado do corpo.'],
  ['Dead hang / suspensão na barra', 'Antebraços e Pegada', 'Costa', 'Barra Fixa', 'Iniciante', 'lat_pulldown', 3, '30-60s', 0, 45, ['Músculos da Pegada / Flexores dos Dedos'], ['Descompressão da Coluna e Ombros'], 'Aumenta a resistência isométrica das mãos e descomprime a coluna vertebral.', 'Segure firme na barra mantendo os ombros levemente ativos (sem soltar totalmente a articulação).'],
  ['Pinça de anilhas', 'Antebraços e Pegada', 'Bíceps', 'Anilhas', 'Iniciante / Intermediário', 'bicep_curl', 3, '30-45s', 10, 45, ['Pinça Digital (Polegar e Dedos)', 'Antebraço'], [], 'Fortalece a força de pinça entre o polegar e os demais dedos.', 'Segure uma ou duas anilhas lisas apenas pela pressão das pontas dos dedos ao lado do corpo.'],
  ['Hand grip', 'Antebraços e Pegada', 'Bíceps', 'Aparelho Hand Grip de Mola', 'Iniciante', 'bicep_curl', 4, '15-20', 0, 45, ['Flexores dos Dedos e Antebraço'], [], 'Aumenta a força de esmagamento da mão.', 'Feche o hand grip até encostar as hastes, segure 1 segundo e abra controladamente.'],
  ['Pronação e supinação do antebraço', 'Antebraços e Pegada', 'Bíceps', 'Halter Unilateral ou Bastão', 'Iniciante', 'bicep_curl', 3, '15 cada', 4, 30, ['Pronadores e Supinadores do Antebraço'], [], 'Fortalece a musculatura rotadora do rádio e ulna, protegendo punhos e cotovelos.', 'Com o antebraço apoiado no banco, gire a mão lentamente de palma para cima até palma para baixo.'],

  // ================= 7. QUADRÍCEPS (16 EXERCÍCIOS) =================
  ['Agachamento livre', 'Quadríceps', 'Perna', 'Barra Olímpica e Rack', 'Intermediário / Avançado', 'squat', 4, '8-10', 80, 90, ['Quadríceps Femoral', 'Glúteo Máximo'], ['Isquiotibiais', 'Eretores da Espinha', 'Core'], 'Rei dos exercícios de membros inferiores para força e massa muscular global.', 'Mantenha os joelhos alinhados à ponta dos pés e a coluna neutra durante toda a descida.'],
  ['Agachamento frontal', 'Quadríceps', 'Perna', 'Barra Olímpica no Rack', 'Avançado', 'squat', 4, '8-10', 60, 90, ['Quadríceps Femoral'], ['Glúteos', 'Core Superior e Torácica'], 'Com a barra apoiada à frente dos ombros, mantém o tronco mais vertical e isola ainda mais o quadríceps.', 'Mantenha os cotovelos apontados bem para o alto para criar uma prateleira firme para a barra.'],
  ['Agachamento goblet', 'Quadríceps', 'Perna', 'Halter ou Kettlebell junto ao Peito', 'Iniciante', 'squat', 4, '12', 24, 60, ['Quadríceps Femoral', 'Glúteo Máximo'], ['Core'], 'Excelente para aprimorar a postura e profundidade do agachamento segurando o peso à frente do peito.', 'Segure o halter em cálice encostado no esterno e desça mantendo o peito alto.'],
  ['Agachamento no Smith', 'Quadríceps', 'Perna', 'Máquina Smith (Barra Guiada)', 'Iniciante / Intermediário', 'squat', 4, '10-12', 60, 75, ['Quadríceps Femoral', 'Glúteo Máximo'], ['Posteriores de Coxa'], 'Oferece trajetória guiada permitindo posicionar os pés levemente à frente para focar em coxas e glúteos.', 'Evite arredondar a lombar (retroversão pélvica) no fundo do movimento.'],
  ['Agachamento no hack', 'Quadríceps', 'Perna', 'Máquina Hack Squat', 'Intermediário', 'leg_press', 4, '10-12', 100, 75, ['Quadríceps Femoral (Vasto Lateral e Reto Femoral)'], ['Glúteo Máximo'], 'Com as costas apoiadas no carro do aparelho, concentra sobrecarga máxima no quadríceps.', 'Mantenha a lombar e o quadril colados no encosto e empurre com a planta inteira do pé.'],
  ['Leg press 45°', 'Quadríceps', 'Perna', 'Máquina Leg Press 45°', 'Iniciante / Intermediário', 'leg_press', 4, '10-12', 180, 75, ['Quadríceps Femoral', 'Glúteo Máximo'], ['Isquiotibiais', 'Adutores'], 'Permite trabalhar membros inferiores com grandes cargas e coluna protegida.', 'Jamais trave completamente os joelhos no topo do movimento.'],
  ['Leg press horizontal', 'Quadríceps', 'Perna', 'Máquina Leg Press Horizontal', 'Iniciante', 'leg_press', 4, '12-15', 100, 60, ['Quadríceps Femoral'], ['Glúteo Máximo'], 'Versão segura e ergonômica em máquina de placas para fortalecimento de coxas e glúteos.', 'Ajuste a distância do banco para atingir 90° de flexão nos joelhos sem tirar o quadril do assento.'],
  ['Cadeira extensora', 'Quadríceps', 'Perna', 'Máquina Cadeira Extensora', 'Iniciante', 'leg_extension', 4, '12-15', 60, 60, ['Quadríceps (Todas as 4 Porções)'], [], 'Único exercício que isola 100% os quatro músculos do quadríceps.', 'Segure 1 segundo no topo com as pernas estendidas e desça controlando o peso.'],
  ['Afundo', 'Quadríceps', 'Perna', 'Halteres ou Barra', 'Iniciante / Intermediário', 'squat', 3, '10-12 cada', 16, 60, ['Quadríceps Femoral', 'Glúteo Máximo'], ['Isquiotibiais', 'Estabilizadores'], 'Exercício unilateral estacionário para força, simetria e hipertrofia de coxas e glúteos.', 'Desça na vertical até ambos os joelhos formarem aproximadamente 90°.'],
  ['Passada caminhando', 'Quadríceps', 'Perna', 'Halteres ou Barra', 'Intermediário', 'squat', 3, '20 passos', 14, 75, ['Quadríceps Femoral', 'Glúteo Máximo'], ['Posteriores', 'Core'], 'Variação dinâmica do afundo deslocando-se à frente, gerando alto estímulo metabólico e muscular.', 'Dê passos firmes mantendo o joelho da frente alinhado com o segundo dedo do pé.'],
  ['Avanço reverso', 'Quadríceps', 'Perna', 'Halteres ou Barra', 'Iniciante / Intermediário', 'squat', 3, '10-12 cada', 16, 60, ['Quadríceps', 'Glúteo Máximo'], ['Isquiotibiais'], 'Ao dar o passo para trás, reduz o cisalhamento no joelho da frente e facilita o equilíbrio.', 'Mantenha o peso concentrado no calcanhar da perna que permanece à frente.'],
  ['Agachamento búlgaro', 'Quadríceps', 'Perna', 'Halteres e Banco de Apoio', 'Intermediário / Avançado', 'squat', 3, '10 cada', 16, 60, ['Quadríceps Femoral', 'Glúteo Máximo'], ['Estabilizadores do Quadril'], 'Com o pé traseiro elevado no banco, promove recrutamento unilateral profundo da perna da frente.', 'Tronco mais ereto foca em quadríceps; tronco levemente inclinado à frente foca mais em glúteos.'],
  ['Step-up', 'Quadríceps', 'Perna', 'Caixa / Banco e Halteres', 'Iniciante / Intermediário', 'squat', 3, '10-12 cada', 12, 60, ['Quadríceps', 'Glúteo Máximo'], ['Panturrilha', 'Core'], 'Subida unilateral no caixote que desenvolve força funcional sem impacto.', 'Suba usando exclusivamente a força da perna apoiada na caixa, evitando impulsionar com o pé de baixo.'],
  ['Sissy squat', 'Quadríceps', 'Perna', 'Suporte Sissy Squat ou Peso Corporal', 'Avançado', 'squat', 3, '12-15', 0, 60, ['Reto Femoral e Vastos do Quadríceps'], [], 'Coloca o quadríceps (especialmente o reto femoral) sob alongamento extremo.', 'Mantenha o quadril estendido alinhado aos omelhos e joelhos enquanto desce o corpo para trás.'],
  ['Agachamento com pausa', 'Quadríceps', 'Perna', 'Barra Olímpica e Rack', 'Intermediário / Avançado', 'squat', 4, '6-8', 70, 90, ['Quadríceps Femoral', 'Glúteo Máximo'], ['Core', 'Eretores'], 'Elimina o reflexo elástico segurando 2 segundos no fundo do agachamento para ganho de força pura.', 'Mantenha o abdômen e a coluna totalmente contraídos durante a pausa lá embaixo, sem relaxar.'],
  ['Agachamento sumô', 'Quadríceps', 'Perna', 'Halter, Kettlebell ou Barra', 'Iniciante / Intermediário', 'squat', 4, '10-12', 30, 60, ['Quadríceps', 'Adutores da Coxa', 'Glúteo Máximo'], ['Posteriores'], 'Com base ampla e pés abertos a 45°, trabalha fortemente a parte interna da coxa (adutores) e glúteos.', 'Empurre os joelhos para fora na direção da ponta dos pés durante toda a execução.'],

  // ================= 8. POSTERIOR DE COXA (10 EXERCÍCIOS) =================
  ['Stiff com barra', 'Posterior de Coxa', 'Perna', 'Barra Livre', 'Intermediário', 'squat', 4, '10-12', 65, 75, ['Isquiotibiais (Posteriores de Coxa)', 'Glúteo Máximo'], ['Eretores da Espinha'], 'Alonga profundamente os posteriores de coxa por meio da dobradiça de quadril.', 'Desça a barra colada às coxas e canelas jogando o quadril para trás com coluna reta.'],
  ['Stiff com halteres', 'Posterior de Coxa', 'Perna', 'Par de Halteres', 'Iniciante / Intermediário', 'squat', 4, '10-12', 26, 60, ['Isquiotibiais', 'Glúteo Máximo'], ['Lombar'], 'Permite posicionar os pesos levemente na lateral das coxas com excelente conforto lombar.', 'Desça apenas até onde conseguir manter a curvatura neutra da coluna lombar.'],
  ['Levantamento terra romeno', 'Posterior de Coxa', 'Perna', 'Barra ou Halteres', 'Intermediário', 'squat', 4, '8-10', 75, 75, ['Isquiotibiais', 'Glúteo Máximo'], ['Eretores da Espinha', 'Grande Dorsal'], 'Conhecido como RDL, utiliza uma leve flexão de joelhos durante o recuo do quadril para cargas maiores.', 'Empurre o quadril para trás até sentir alongamento máximo nos posteriores e suba contraindo os glúteos.'],
  ['Mesa flexora', 'Posterior de Coxa', 'Perna', 'Máquina Mesa Flexora', 'Iniciante', 'leg_extension', 4, '12-15', 45, 60, ['Isquiotibiais (Bíceps Femoral, Semitendíneo, Semimembranáceo)'], ['Gastrocnêmio'], 'Isola os posteriores de coxa deitado de bruços.', 'Mantenha o quadril pressionado contra o banco sem empinar o bumbum ao subir o rolo.'],
  ['Cadeira flexora', 'Posterior de Coxa', 'Perna', 'Máquina Cadeira Flexora Sentado', 'Iniciante', 'leg_extension', 4, '12-15', 55, 60, ['Isquiotibiais'], ['Gastrocnêmio'], 'Por iniciar sentado (quadril flexionado), coloca os isquiotibiais em maior pré-alongamento, gerando hipertrofia superior.', 'Trave bem a almofada sobre as coxas e controle a subida do apoio em cada repetição.'],
  ['Flexora em pé', 'Posterior de Coxa', 'Perna', 'Máquina Flexora Unilateral ou Caneleira/Polia', 'Iniciante / Intermediário', 'leg_extension', 3, '12 cada', 25, 45, ['Isquiotibiais Unilateral'], [], 'Isola cada perna individualmente corrigindo assimetrias nos posteriores.', 'Mantenha a coxa de trabalho encostada no apoio sem jogar o joelho para frente.'],
  ['Nordic curl', 'Posterior de Coxa', 'Perna', 'Apoio de Tornozelos e Peso Corporal', 'Avançado', 'leg_extension', 3, '6-10', 0, 75, ['Isquiotibiais (Força Excêntrica)'], ['Glúteos'], 'Padrão-ouro científico para prevenção de estiramentos nos posteriores de coxa.', 'De joelhos com os pés presos, desça o corpo à frente o mais devagar possível segurando com os posteriores.'],
  ['Glute-ham raise', 'Posterior de Coxa', 'Perna', 'Aparelho GHD (Glute Ham Developer)', 'Avançado', 'leg_extension', 3, '8-12', 0, 75, ['Isquiotibiais', 'Glúteo Máximo'], ['Gastrocnêmio', 'Eretores'], 'Trabalha os posteriores simultaneamente nas articulações do quadril e do joelho.', 'Mantenha o quadril estendido alinhado ao tronco enquanto flexiona os joelhos para subir.'],
  ['Good morning (Posterior)', 'Posterior de Coxa', 'Perna', 'Barra nas Costas', 'Intermediário', 'squat', 3, '10-12', 40, 60, ['Isquiotibiais', 'Glúteo Máximo', 'Lombar'], [], 'Fortalece o alongamento dos posteriores sob carga axial.', 'Inicie o movimento sempre empurrando o quadril para trás como no Stiff.'],
  ['Pull-through na polia', 'Posterior de Coxa', 'Perna', 'Polia Baixa com Corda', 'Iniciante / Intermediário', 'squat', 3, '12-15', 30, 60, ['Glúteo Máximo', 'Isquiotibiais'], ['Eretores da Espinha'], 'Ensina o padrão perfeito de dobradiça de quadril (hip hinge) sem carga sobre a coluna.', 'De costas para a polia com a corda entre as pernas, recrie o movimento do RDL e contraia os glúteos no topo.'],

  // ================= 9. GLÚTEOS (13 EXERCÍCIOS) =================
  ['Elevação pélvica / hip thrust', 'Glúteos', 'Perna', 'Barra, Anilhas e Banco', 'Iniciante / Intermediário', 'leg_press', 4, '8-12', 80, 75, ['Glúteo Máximo'], ['Isquiotibiais', 'Quadríceps'], 'Exercício número 1 para sobrecarga direta e hipertrofia máxima do glúteo no ponto de encurtamento.', 'Apoie a borda inferior das escápulas no banco, olhe para frente e segure 1-2s no topo com a pelve alinhada.'],
  ['Elevação pélvica unilateral', 'Glúteos', 'Perna', 'Banco e Peso Corporal / Halter', 'Intermediário', 'leg_press', 3, '10-12 cada', 12, 60, ['Glúteo Máximo e Médio Unilateral'], ['Posteriores'], 'Isola um glúteo por vez, aumentando a exigência de estabilização pélvica.', 'Na subida, certifique-se de que a canela da perna de apoio fique 100% vertical (90° no joelho).'],
  ['Ponte de glúteos', 'Glúteos', 'Perna', 'Colchonete, Halter ou Barra', 'Iniciante', 'leg_press', 4, '15', 20, 45, ['Glúteo Máximo'], ['Isquiotibiais'], 'Executada com as costas deitadas no solo, ativa intensamente os glúteos com menor participação do quadríceps.', 'Empurre o chão pelos calcanhares e contraia os glúteos no topo sem arquear a lombar.'],
  ['Coice na polia', 'Glúteos', 'Perna', 'Polia Baixa e Tornozeleira', 'Iniciante', 'leg_extension', 4, '12-15 cada', 15, 45, ['Glúteo Máximo'], ['Glúteo Médio (quando diagonal)'], 'Isola o glúteo através da extensão do quadril com resistência contínua do cabo.', 'Incline levemente o tronco e chute para trás sem balançar a coluna lombar.'],
  ['Coice com caneleira', 'Glúteos', 'Perna', 'Caneleira e Colchonete / Banco', 'Iniciante', 'leg_extension', 3, '15 cada', 8, 45, ['Glúteo Máximo'], [], 'Trabalha a extensão do quadril em 4 apoios focando na contração isolada do glúteo.', 'Mantenha o abdômen contraído para que a lombar não afunde quando a perna sobe.'],
  ['Abdução de quadril na máquina', 'Glúteos', 'Perna', 'Cadeira Abdutora', 'Iniciante', 'leg_extension', 4, '15-20', 55, 45, ['Glúteo Médio e Mínimo'], ['Porção Superior do Glúteo Máximo'], 'Fundamental para desenhar a região lateral e superior dos glúteos e estabilizar o quadril.', 'Abra as pernas com explosão controlada, segure 1 segundo aberto e retorne devagar.'],
  ['Abdução com elástico', 'Glúteos', 'Perna', 'Miniband', 'Iniciante', 'leg_extension', 3, '20', 0, 30, ['Glúteo Médio e Mínimo'], [], 'Ativa profundamente os abdutores do quadril, excelente para pré-ativação ou finalização.', 'Posicione a miniband logo acima ou abaixo dos joelhos e mantenha tensão constante sem fechar tudo.'],
  ['Caminhada lateral com miniband', 'Glúteos', 'Perna', 'Miniband (Monster Walk)', 'Iniciante', 'squat', 3, '15 passos cada lado', 0, 45, ['Glúteo Médio e Mínimo'], ['Quadríceps'], 'Fortalece os estabilizadores laterais da pelve em posição de semiafachamento.', 'Mantenha os pés apontados para frente e não deixe os joelhos entrarem durante as passadas.'],
  ['Agachamento sumô (Glúteos)', 'Glúteos', 'Perna', 'Halter ou Barra', 'Iniciante / Intermediário', 'squat', 4, '10-12', 32, 60, ['Glúteo Máximo', 'Adutores'], ['Quadríceps'], 'A base afastada aumenta o recrutamento dos glúteos e parte interna das coxas.', 'Incline sutilmente o tronco à frente mantendo os joelhos abertos para maximizar o glúteo.'],
  ['Afundo (Glúteos)', 'Glúteos', 'Perna', 'Halteres', 'Iniciante / Intermediário', 'squat', 3, '10-12 cada', 16, 60, ['Glúteo Máximo'], ['Quadríceps'], 'Quando executado com passada levemente mais longa e tronco inclinado à frente, alonga profundamente o glúteo.', 'Foque em subir empurrando o calcanhar da perna da frente contra o solo.'],
  ['Agachamento búlgaro (Glúteos)', 'Glúteos', 'Perna', 'Halteres e Banco', 'Intermediário / Avançado', 'squat', 3, '10 cada', 16, 60, ['Glúteo Máximo'], ['Quadríceps'], 'Um dos maiores construtores unilaterais da porção inferior e lateral do glúteo.', 'Incline o tronco cerca de 20° à frente para colocar o glúteo em alongamento máximo no fundo.'],
  ['Step-up (Glúteos)', 'Glúteos', 'Perna', 'Caixa Alta e Halteres', 'Intermediário', 'squat', 3, '10-12 cada', 12, 60, ['Glúteo Máximo'], ['Quadríceps'], 'Subida em caixa alta exigindo forte extensão do quadril pelo glúteo.', 'Incline o tronco levemente sobre o joelho da frente antes de iniciar a subida.'],
  ['Extensão de quadril no banco', 'Glúteos', 'Perna', 'Banco Romano 45°', 'Iniciante / Intermediário', 'barbell_row', 3, '12-15', 10, 45, ['Glúteo Máximo'], ['Isquiotibiais'], 'Variação no banco romano focada exclusivamente nos glúteos.', 'Arredonde levemente a parte alta das costas, aponte os pés 45° para fora e suba contraindo apenas os glúteos.'],

  // ================= 10. PANTURRILHAS E TIBIAL (7 EXERCÍCIOS) =================
  ['Panturrilha em pé', 'Panturrilhas e Tibial', 'Perna', 'Máquina Gêmeos em Pé ou Halteres', 'Iniciante', 'squat', 4, '15-20', 60, 45, ['Gastrocnêmio (Cabeça Medial e Lateral)'], ['Sóleo'], 'Com os joelhos estendidos, recruta com intensidade máxima o músculo gastrocnêmio.', 'Suba na ponta dos pés até o limite, segure 2 segundos no topo e alongue bem o calcanhar embaixo.'],
  ['Panturrilha sentada', 'Panturrilhas e Tibial', 'Perna', 'Máquina Gêmeos Sentado', 'Iniciante', 'leg_extension', 4, '15-20', 40, 45, ['Sóleo'], ['Gastrocnêmio'], 'Com os joelhos dobrados a 90°, isola o músculo sóleo (que fica abaixo do gastrocnêmio e dá largura à canela).', 'Use cadência controlada sem quicar o peso no fundo.'],
  ['Panturrilha no leg press', 'Panturrilhas e Tibial', 'Perna', 'Máquina Leg Press 45° ou Horizontal', 'Iniciante', 'leg_press', 4, '15-20', 120, 45, ['Gastrocnêmio', 'Sóleo'], [], 'Excelente para aplicar sobrecarga elevada nas panturrilhas com a lombar apoiada.', 'Mantenha as travas de segurança acionadas e apoie apenas a parte frontal do pé na borda.'],
  ['Panturrilha unilateral', 'Panturrilhas e Tibial', 'Perna', 'Degrau / Step e Halter', 'Iniciante', 'squat', 3, '15 cada', 12, 45, ['Gastrocnêmio e Sóleo Unilateral'], [], 'Corrige diferenças de força e volume entre a panturrilha direita e esquerda.', 'Use uma mão para equilíbrio e foque em 100% da amplitude do tornozelo.'],
  ['Panturrilha no Smith', 'Panturrilhas e Tibial', 'Perna', 'Máquina Smith e Step', 'Iniciante / Intermediário', 'squat', 4, '15-20', 50, 45, ['Gastrocnêmio'], ['Sóleo'], 'Permite treinar panturrilha em pé com cargas altas quando não há máquina específica.', 'Posicione um step firme sob a barra para permitir que os calcanhares desçam além da linha dos dedos.'],
  ['Dorsiflexão com elástico', 'Panturrilhas e Tibial', 'Perna', 'Elástico / Superband', 'Iniciante', 'leg_extension', 3, '15-20', 0, 30, ['Tibial Anterior'], [], 'Fortalece a parte frontal da canela, prevenindo canelite e dores no joelho.', 'Prenda o elástico à frente do pé e puxe a ponta do pé em direção à canela.'],
  ['Elevação de ponta dos pés / tibial raise', 'Panturrilhas e Tibial', 'Perna', 'Parede e Peso Corporal', 'Iniciante', 'squat', 3, '20', 0, 30, ['Tibial Anterior'], [], 'Fortalece o tibial anterior e melhora a estabilidade do tornozelo para corrida e agachamento.', 'Apoie as costas na parede com os pés um passo à frente e levante as pontas dos pés o mais alto possível.'],

  // ================= 11. ABDÔMEN E CORE (19 EXERCÍCIOS) =================
  ['Crunch abdominal', 'Abdômen e Core', 'Costa', 'Colchonete', 'Iniciante', 'bench_press', 4, '15-20', 0, 45, ['Reto Abdominal (Porção Superior)'], ['Oblíquos'], 'Isola o reto abdominal através da flexão curta da coluna torácica.', 'Solte todo o ar pela boca ao subir as escápulas do chão e não puxe o pescoço com as mãos.'],
  ['Abdominal máquina', 'Abdômen e Core', 'Costa', 'Máquina Abdominal', 'Iniciante', 'leg_extension', 4, '12-15', 35, 45, ['Reto Abdominal'], ['Oblíquos'], 'Permite aplicar sobrecarga progressiva com placas de peso para hipertrofia dos gomos abdominais.', 'Enrole o tronco aproximando as costelas do quadril, em vez de dobrar apenas o quadril.'],
  ['Crunch na polia', 'Abdômen e Core', 'Costa', 'Polia Alta com Corda', 'Intermediário', 'lat_pulldown', 4, '12-15', 30, 45, ['Reto Abdominal'], ['Oblíquos'], 'Um dos melhores exercícios com carga para construir espessura na parede abdominal.', 'Ajoelhado, segure a corda ao lado da cabeça e curve a coluna levando os cotovelos em direção aos joelhos.'],
  ['Abdominal reverso', 'Abdômen e Core', 'Costa', 'Colchonete ou Banco', 'Iniciante', 'bench_press', 3, '15', 0, 45, ['Reto Abdominal (Porção Inferior / Infra)'], [], 'Enfatiza a região inferior do abdômen ao elevar a pelve em direção ao tórax.', 'Tire o quadril do colchonete no final da subida usando o abdômen, sem dar impulsos com as pernas.'],
  ['Elevação de pernas', 'Abdômen e Core', 'Costa', 'Solo ou Banco', 'Iniciante / Intermediário', 'bench_press', 3, '12-15', 0, 45, ['Abdômen Inferior', 'Flexores do Quadril'], [], 'Fortalece a região infra-abdominal e estabilizadores lombo-pélvicos.', 'Mantenha a lombar pressionada contra o banco ou chão durante a descida das pernas.'],
  ['Elevação de joelhos na barra', 'Abdômen e Core', 'Costa', 'Barra Fixa ou Paralela Capitão', 'Intermediário', 'lat_pulldown', 3, '12-15', 0, 45, ['Reto Abdominal Inferior'], ['Pegada', 'Flexores do Quadril'], 'Trabalha o abdômen inferior pendurado na barra.', 'Eleve os joelhos acima da linha da cintura enrolando a pelve para cima.'],
  ['Elevação de pernas suspenso', 'Abdômen e Core', 'Costa', 'Barra Fixa', 'Avançado', 'lat_pulldown', 3, '10-12', 0, 60, ['Reto Abdominal Completo', 'Oblíquos'], ['Flexores do Quadril', 'Pegada'], 'Versão avançada com pernas estendidas para força máxima do core.', 'Evite balançar o corpo (kipping); suba e desça as pernas com controle muscular.'],
  ['Prancha frontal', 'Abdômen e Core', 'Costa', 'Colchonete', 'Iniciante', 'bench_press', 3, '45-60s', 0, 45, ['Transverso do Abdômen', 'Reto Abdominal'], ['Glúteos', 'Estabilizadores Escapulares'], 'Fortalece o cinturão abdominal profundo em isometria e protege a coluna.', 'Contraia fortemente glúteos e abdômen mantendo o corpo em linha reta.'],
  ['Prancha lateral', 'Abdômen e Core', 'Costa', 'Colchonete', 'Iniciante / Intermediário', 'bench_press', 3, '30-45s cada', 0, 45, ['Oblíquos Internos e Externos', 'Quadrado Lombar'], ['Glúteo Médio'], 'Estabiliza a lateral do tronco e fortalece os oblíquos sem aumentar a circunferência da cintura.', 'Apoie o antebraço diretamente abaixo do ombro e mantenha o quadril alto.'],
  ['Prancha com toque no ombro', 'Abdômen e Core', 'Costa', 'Peso Corporal', 'Intermediário', 'bench_press', 3, '20 toques', 0, 45, ['Core Antirrotação', 'Reto Abdominal'], ['Deltoides'], 'Desenvolve estabilidade antirrotação ao tirar uma mão do chão de cada vez.', 'Afaste mais os pés e tente manter o quadril completamente imóvel enquanto toca o ombro oposto.'],
  ['Dead bug', 'Abdômen e Core', 'Costa', 'Colchonete', 'Iniciante', 'bench_press', 3, '12 cada lado', 0, 45, ['Transverso do Abdômen', 'Reto Abdominal'], ['Flexores do Quadril'], 'Excelente para controle motor do core mantendo a coluna lombar colada ao solo.', 'Estenda simultaneamente o braço direito e a perna esquerda sem deixar a lombar desencostar do chão.'],
  ['Bird dog', 'Abdômen e Core', 'Costa', 'Colchonete (4 Apoios)', 'Iniciante', 'barbell_row', 3, '12 cada lado', 0, 45, ['Multífidos', 'Eretores da Espinha', 'Core'], ['Glúteo Máximo', 'Deltoide'], 'Promove estabilidade cruzada da coluna e coordenação lombo-pélvica.', 'Em 4 apoios, estenda braço e perna opostos até ficarem alinhados ao tronco e segure 2s.'],
  ['Hollow hold', 'Abdômen e Core', 'Costa', 'Colchonete', 'Intermediário', 'bench_press', 3, '30-45s', 0, 45, ['Reto Abdominal', 'Transverso'], ['Flexores do Quadril'], 'Base da ginástica artística e calistenia para rigidez total do core (canoinha).', 'Achatando a lombar 100% no chão, eleve pernas e braços estendidos formando uma leve meia-lua.'],
  ['Ab wheel / roda abdominal', 'Abdômen e Core', 'Costa', 'Roda Abdominal', 'Intermediário / Avançado', 'bench_press', 3, '10-12', 0, 60, ['Reto Abdominal', 'Transverso'], ['Grande Dorsal', 'Tríceps'], 'Exercício antiextensão de altíssima ativação eletromiográfica para todo o abdômen.', 'Mantenha a pelve encaixada (retroversão) e nunca deixe a lombar afundar ao rolar para frente.'],
  ['Russian twist', 'Abdômen e Core', 'Costa', 'Anilha, Halter ou Medicine Ball', 'Iniciante / Intermediário', 'bicep_curl', 3, '20 giros', 8, 45, ['Oblíquos Internos e Externos'], ['Reto Abdominal'], 'Trabalha a força rotacional do tronco e os músculos oblíquos.', 'Gire os ombros e a caixa torácica de um lado ao outro, não apenas os braços.'],
  ['Pallof press', 'Abdômen e Core', 'Costa', 'Polia Média ou Elástico', 'Iniciante / Intermediário', 'chest_fly', 3, '12 cada lado', 15, 45, ['Oblíquos', 'Transverso do Abdômen (Antirrotação)'], ['Glúteos'], 'Padrão-ouro para força antirrotacional do core e proteção da coluna.', 'De lado para a polia, estenda os braços à frente do peito resistindo à puxada lateral do cabo.'],
  ['Mountain climber', 'Abdômen e Core', 'Costa', 'Peso Corporal', 'Iniciante', 'bench_press', 3, '30-45s', 0, 45, ['Reto Abdominal', 'Flexores do Quadril'], ['Ombros', 'Sistema Cardiovascular'], 'Combina fortalecimento dinâmico do core com elevado gasto calórico.', 'Em posição de prancha alta, alterne os joelhos em direção ao peito mantendo o quadril baixo.'],
  ['Abdominal bicicleta', 'Abdômen e Core', 'Costa', 'Colchonete', 'Iniciante', 'bench_press', 3, '20', 0, 45, ['Oblíquos', 'Reto Abdominal'], ['Flexores do Quadril'], 'Une flexão e rotação de tronco para atingir reto abdominal e oblíquos simultaneamente.', 'Aproxime o ombro do joelho oposto de forma pausada e controlada.'],
  ['Canivete / V-up', 'Abdômen e Core', 'Costa', 'Colchonete', 'Intermediário / Avançado', 'bench_press', 3, '12-15', 0, 45, ['Reto Abdominal Completo'], ['Flexores do Quadril'], 'Sobe tronco e pernas simultaneamente formando um "V" para recrutamento total do abdômen.', 'Suba de forma explosiva tocando as canelas ou pés e desça controlando o retorno.'],

  // ================= 12. LOMBAR E ESTABILIZADORES (8 EXERCÍCIOS) =================
  ['Bird dog (Lombar)', 'Lombar e Estabilizadores', 'Costa', 'Colchonete', 'Iniciante', 'barbell_row', 3, '12 cada lado', 0, 45, ['Multífidos', 'Eretores da Espinha'], ['Glúteos', 'Core'], 'Reabilita e fortalece os músculos profundos estabilizadores das vértebras lombares.', 'Evite girar o quadril ao elevar a perna para trás.'],
  ['Extensão lombar no banco', 'Lombar e Estabilizadores', 'Costa', 'Banco Romano 45°', 'Iniciante', 'barbell_row', 3, '12-15', 0, 45, ['Eretores da Espinha (Paravertebrais)'], ['Glúteos', 'Isquiotibiais'], 'Fortalece diretamente a musculatura lombar para sustentar cargas nos exercícios compostos.', 'Suba até o corpo ficar reto; não force a coluna para trás além da linha neutra.'],
  ['Superman', 'Lombar e Estabilizadores', 'Costa', 'Colchonete', 'Iniciante', 'bench_press', 3, '12-15', 0, 45, ['Eretores da Espinha', 'Glúteo Máximo'], ['Deltoide Posterior'], 'Fortalece toda a cadeia extensora da coluna deitado de bruços sem necessidade de aparelhos.', 'Eleve braços e pernas simultaneamente do chão, segure 2 segundos e desça devagar.'],
  ['Prancha (Estabilizadores)', 'Lombar e Estabilizadores', 'Costa', 'Colchonete', 'Iniciante', 'bench_press', 3, '45-60s', 0, 45, ['Cinturão Lombo-Pélvico', 'Transverso'], ['Glúteos'], 'Cria co-contração entre abdômen, lombar e glúteos para blindar a coluna.', 'Respire normalmente mantendo o umbigo puxado para dentro.'],
  ['Dead bug (Estabilizadores)', 'Lombar e Estabilizadores', 'Costa', 'Colchonete', 'Iniciante', 'bench_press', 3, '10 cada lado', 0, 45, ['Estabilizadores Lombo-Pélvicos'], ['Reto Abdominal'], 'Ensina a manter a coluna lombar estável enquanto braços e pernas se movem.', 'Se a lombar arquear, diminua a distância que a perna desce até o chão.'],
  ['Pallof press (Estabilizadores)', 'Lombar e Estabilizadores', 'Costa', 'Polia ou Elástico', 'Iniciante', 'chest_fly', 3, '12 cada', 12, 45, ['Oblíquos', 'Quadrado Lombar', 'Multífidos'], [], 'Protege a coluna contra forças de torção.', 'Segure 2 segundos com os braços totalmente estendidos à frente do esterno.'],
  ['Levantamento terra leve e técnico', 'Lombar e Estabilizadores', 'Costa', 'Barra ou Halteres', 'Iniciante / Intermediário', 'squat', 3, '10', 40, 60, ['Eretores da Espinha', 'Glúteos', 'Posteriores'], ['Core'], 'Desenvolve consciência postural, bracing abdominal e resistência nos paravertebrais.', 'Priorize 100% a técnica e o alinhamento neutro da coluna com carga leve a moderada.'],
  ['Good morning leve', 'Lombar e Estabilizadores', 'Costa', 'Bastão ou Barra Leve', 'Iniciante / Intermediário', 'squat', 3, '12', 20, 45, ['Eretores da Espinha', 'Isquiotibiais'], ['Glúteos'], 'Fortalece a resistência isométrica da lombar durante a flexão do quadril.', 'Mantenha as escápulas firmes e desça com controle total.'],

  // ================= 13. CARDIO E CONDICIONAMENTO (21 EXERCÍCIOS) =================
  ['Caminhada', 'Cardio e Condicionamento', 'Perna', 'Esteira ou Ar Livre', 'Iniciante', 'squat', 1, '30-45 min', 0, 0, ['Sistema Cardiovascular', 'Membros Inferiores'], [], 'Aumenta o gasto calórico diário e melhora a saúde cardiovascular sem impacto articular.', 'Mantenha ritmo constante e postura ereta com movimentação natural dos braços.'],
  ['Caminhada inclinada', 'Cardio e Condicionamento', 'Perna', 'Esteira com Inclinação (8% a 15%)', 'Iniciante / Intermediário', 'squat', 1, '20-30 min', 0, 0, ['Sistema Cardiovascular', 'Glúteos', 'Panturrilhas'], ['Posteriores de Coxa'], 'Eleva intensamente a frequência cardíaca e a queima de gordura sem o impacto da corrida.', 'Evite ficar pendurado segurando no painel da esteira para não reduzir o gasto energético.'],
  ['Corrida contínua', 'Cardio e Condicionamento', 'Perna', 'Esteira ou Rua', 'Intermediário', 'squat', 1, '20-40 min', 0, 0, ['Capacidade Aeróbica', 'Membros Inferiores'], ['Core'], 'Desenvolve resistência cardiorrespiratória de longa duração (VO2 máx).', 'Mantenha cadência confortável de passadas aterrizando próximo ao centro de gravidade.'],
  ['Corrida intervalada', 'Cardio e Condicionamento', 'Perna', 'Esteira ou Pista', 'Intermediário / Avançado', 'squat', 8, '1 min forte / 1 min leve', 0, 60, ['Potência Aeróbica e Anaeróbica (HIIT)'], ['Membros Inferiores'], 'Alterna picos de velocidade com recuperação ativa para acelerar o metabolismo.', 'Faça 5 minutos de aquecimento leve antes de iniciar os blocos intensos.'],
  ['Tiros / sprint', 'Cardio e Condicionamento', 'Perna', 'Pista, Gramado ou Esteira', 'Avançado', 'squat', 6, '15-30s máximo', 0, 90, ['Fibras Rápidas (Tipo II)', 'Glúteos', 'Isquiotibiais'], ['Potência Anaeróbica'], 'Estímulo máximo de velocidade, potência muscular e condicionamento anaeróbico.', 'Aqueça muito bem posteriores de coxa e quadril antes de dar tiros em velocidade máxima.'],
  ['Esteira', 'Cardio e Condicionamento', 'Perna', 'Esteira Ergométrica', 'Iniciante', 'squat', 1, '25 min', 0, 0, ['Condicionamento Cardiorrespiratório'], ['Pernas'], 'Permite controle exato de velocidade, inclinação e tempo de treino aeróbico.', 'Olhe para frente para manter o alinhamento cervical durante a caminhada ou corrida.'],
  ['Bicicleta ergométrica', 'Cardio e Condicionamento', 'Perna', 'Bike Horizontal ou Vertical', 'Iniciante', 'leg_press', 1, '25-35 min', 0, 0, ['Condicionamento Aeróbico', 'Quadríceps'], [], 'Cardio seguro com zero impacto para tornozelos, joelhos e quadris.', 'Ajuste a altura do selim para que o joelho fique levemente flexionado no ponto mais baixo do pedal.'],
  ['Spinning', 'Cardio e Condicionamento', 'Perna', 'Bike de Spinning', 'Intermediário', 'leg_press', 1, '30-45 min', 0, 0, ['Resistência Cardiovascular', 'Quadríceps', 'Glúteos'], ['Panturrilhas'], 'Treino ciclístico dinâmico alternando subidas com carga e sprints.', 'Mantenha sempre uma carga mínima na roda para não pedalar no vazio em alta rotação.'],
  ['Elíptico', 'Cardio e Condicionamento', 'Perna', 'Aparelho Elíptico / Transport', 'Iniciante', 'squat', 1, '25-30 min', 0, 0, ['Sistema Cardiovascular', 'Pernas e Membros Superiores'], [], 'Trabalha membros inferiores e superiores sincronizados sem impacto articular.', 'Mantenha os calcanhares apoiados nos pedais e trave o abdômen.'],
  ['Remo ergométrico', 'Cardio e Condicionamento', 'Costa', 'Concept2 / Remo Indoor', 'Intermediário', 'barbell_row', 4, '500m', 0, 60, ['Corpo Inteiro (Pernas, Costas, Core e Cardio)'], ['Bíceps', 'Ombros'], 'Recruta mais de 80% da musculatura do corpo com altíssimo gasto calórico.', 'Siga a ordem técnica: 1º empurre com as pernas, 2º incline o tronco, 3º puxe com os braços.'],
  ['Escada / stair climber', 'Cardio e Condicionamento', 'Perna', 'Simulador de Escada', 'Intermediário', 'squat', 1, '20-30 min', 0, 0, ['Sistema Cardiovascular', 'Glúteos', 'Quadríceps'], ['Panturrilhas'], 'Um dos aparelhos de cardio mais eficientes para queima calórica e resistência de glúteos e pernas.', 'Pise com o pé inteiro no degrau e evite apoiar o peso dos braços no corrimão.'],
  ['Pular corda', 'Cardio e Condicionamento', 'Perna', 'Corda de Pular', 'Iniciante / Intermediário', 'squat', 5, '1-2 min', 0, 45, ['Cardio', 'Panturrilhas', 'Coordenação Motora'], ['Antebraços', 'Ombros'], 'Desenvolve agilidade de pés, resistência de panturrilhas e alto gasto energético.', 'Gire a corda usando os punhos (e não os braços inteiros) com saltos baixos na ponta dos pés.'],
  ['Natação', 'Cardio e Condicionamento', 'Costa', 'Piscina', 'Iniciante / Intermediário', 'lat_pulldown', 1, '30-45 min', 0, 0, ['Capacidade Pulmonar', 'Dorsais', 'Ombros', 'Core'], ['Pernas'], 'Condicionamento completo de corpo inteiro dentro da água sem impacto nas articulações.', 'Coordene a respiração bilateral ou unilateral com o rolamento do tronco.'],
  ['Ciclismo', 'Cardio e Condicionamento', 'Perna', 'Bicicleta', 'Iniciante / Intermediário', 'leg_press', 1, '40-60 min', 0, 0, ['Resistência Aeróbica', 'Quadríceps', 'Glúteos'], [], 'Excelente modalidade ao ar livre para resistência muscular de membros inferiores e saúde cardíaca.', 'Mantenha cadência fluida de pedalada entre 75 e 90 RPM.'],
  ['Dança', 'Cardio e Condicionamento', 'Perna', 'Peso Corporal', 'Iniciante', 'squat', 1, '30-45 min', 0, 0, ['Condicionamento Aeróbico', 'Coordenação', 'Membros Inferiores'], ['Core'], 'Melhora o condicionamento cardiovascular, ritmo, mobilidade e bem-estar.', 'Mantenha hidratação constante e calçado com bom amortecimento.'],
  ['Circuito funcional', 'Cardio e Condicionamento', 'Perna', 'Estações Variadas', 'Intermediário', 'squat', 4, '45s ativo / 15s pausa', 0, 60, ['Condicionamento Metabólico Global'], ['Força e Resistência'], 'Encadeia exercícios multiarticulares sem descanso longo para elevar o consumo de oxigênio.', 'Priorize a execução limpa mesmo quando a fadiga cardiovascular aumentar.'],
  ['Burpee', 'Cardio e Condicionamento', 'Peito', 'Peso Corporal', 'Intermediário / Avançado', 'bench_press', 4, '10-15', 0, 60, ['Corpo Inteiro', 'Potência Metabólica'], ['Peito', 'Pernas', 'Core'], 'Une agachamento, prancha, flexão e salto vertical para condicionamento extremo.', 'Ao saltar os pés para trás na prancha, trave o abdômen para não chicotear a lombar.'],
  ['Polichinelo', 'Cardio e Condicionamento', 'Perna', 'Peso Corporal', 'Iniciante', 'lateral_raise', 4, '45-60s', 0, 30, ['Sistema Cardiovascular', 'Panturrilhas', 'Ombros'], [], 'Ótimo para aquecimento dinâmico e elevação rápida da frequência cardíaca.', 'Amorteça o pouso na ponta dos pés mantendo os joelhos destravados.'],
  ['Mountain climber (Cardio)', 'Cardio e Condicionamento', 'Costa', 'Peso Corporal', 'Iniciante / Intermediário', 'bench_press', 4, '40s', 0, 30, ['Cardio', 'Core', 'Flexores do Quadril'], ['Ombros'], 'Acelera os batimentos cardíacos enquanto trabalha a estabilidade de ombros e abdômen.', 'Mantenha as mãos exatamente abaixo da linha dos ombros.'],
  ['Sled push', 'Cardio e Condicionamento', 'Perna', 'Trenó (Sled / Prowler)', 'Intermediário / Avançado', 'leg_press', 4, '20m', 60, 75, ['Quadríceps', 'Glúteos', 'Panturrilhas', 'Cardio Anaeróbico'], ['Core', 'Ombros'], 'Empurrão de trenó que gera força explosiva e queima intensa nas pernas sem fase excêntrica.', 'Incline o corpo a 45°, trave os braços e dê passadas potentes empurrando o chão.'],
  ['Sled pull', 'Cardio e Condicionamento', 'Costa', 'Trenó e Corda / Cinta', 'Intermediário / Avançado', 'barbell_row', 4, '20m', 50, 75, ['Quadríceps (caminhando de costas)', 'Costas e Bíceps'], ['Core', 'Cardio'], 'Puxada de trenó excelente para saúde dos joelhos (quando puxado andando de costas) e força de tração.', 'Mantenha passos curtos e constantes mantendo tensão na fita.'],

  // ================= 14. FUNCIONAL, POTÊNCIA E PLIOMETRIA (15 EXERCÍCIOS) =================
  ['Salto vertical', 'Funcional, Potência e Pliometria', 'Perna', 'Peso Corporal', 'Intermediário', 'squat', 4, '6-8', 0, 60, ['Potência de Quadríceps, Glúteos e Panturrilhas'], ['Core'], 'Desenvolve potência explosiva de extensão tripla (tornozelo, joelho e quadril).', 'Use o balanço dos braços para impulsionar e aterrise suavemente flexionando os joelhos.'],
  ['Salto horizontal', 'Funcional, Potência e Pliometria', 'Perna', 'Peso Corporal (Broad Jump)', 'Intermediário', 'squat', 4, '6', 0, 60, ['Glúteo Máximo', 'Isquiotibiais', 'Quadríceps'], ['Core'], 'Foca na produção de força horizontal explosiva dos quadris.', 'Absorva o impacto do pouso com ambos os pés alinhados e equilibrados antes do próximo salto.'],
  ['Salto em caixa', 'Funcional, Potência e Pliometria', 'Perna', 'Plyo Box (Caixa Pliométrica)', 'Intermediário', 'squat', 4, '6-8', 0, 60, ['Potência de Membros Inferiores'], ['Core'], 'Salto pliométrico sobre a caixa reduzindo o impacto de aterrissagem.', 'Pouse com os dois pés inteiros no centro da caixa e desça um pé de cada vez.'],
  ['Saltos laterais', 'Funcional, Potência e Pliometria', 'Perna', 'Peso Corporal ou Barreira Baixa', 'Intermediário', 'squat', 3, '12-16', 0, 45, ['Glúteo Médio', 'Quadríceps', 'Panturrilhas'], ['Estabilidade de Tornozelo'], 'Melhora a agilidade multidirecional e a reatividade dos tendões.', 'Mantenha o joelho alinhado ao pé no momento da aterrissagem lateral.'],
  ['Agachamento com salto', 'Funcional, Potência e Pliometria', 'Perna', 'Peso Corporal', 'Intermediário', 'squat', 3, '10-12', 0, 60, ['Quadríceps', 'Glúteos (Fibras Explosivas)'], ['Panturrilhas'], 'Une a fase excêntrica do agachamento com propulsão vertical máxima.', 'Ao pousar, já amorteça descendo diretamente para a próxima repetição de forma fluida.'],
  ['Afundo com salto', 'Funcional, Potência e Pliometria', 'Perna', 'Peso Corporal', 'Avançado', 'squat', 3, '10 (5 cada)', 0, 60, ['Quadríceps', 'Glúteos', 'Potência Unilateral'], ['Equilíbrio e Core'], 'Pliometria unilateral alternando a base das pernas no ar.', 'Mantenha o tronco ereto e amorteça suavemente cada troca de base.'],
  ['Arremesso de medicine ball', 'Funcional, Potência e Pliometria', 'Ombro', 'Medicine Ball (Slam ou Parede)', 'Iniciante / Intermediário', 'shoulder_press', 4, '10', 8, 60, ['Potência de Core, Ombros, Peito e Dorsais'], ['Quadríceps'], 'Transfere potência dos membros inferiores e core para os membros superiores.', 'Use o corpo inteiro no arremesso, não apenas a força isolada dos braços.'],
  ['Wall ball', 'Funcional, Potência e Pliometria', 'Perna', 'Medicine Ball e Alvo na Parede', 'Intermediário', 'squat', 4, '15', 8, 60, ['Quadríceps', 'Glúteos', 'Ombros', 'Cardio'], ['Core'], 'Combina agachamento frontal profundo com arremesso vertical da bola no alvo.', 'Aproveite o impulso da subida do agachamento para lançar a bola no alvo.'],
  ['Kettlebell swing', 'Funcional, Potência e Pliometria', 'Perna', 'Kettlebell', 'Intermediário', 'squat', 4, '15-20', 20, 60, ['Glúteo Máximo', 'Isquiotibiais', 'Eretores da Espinha'], ['Core', 'Deltoides', 'Pegada'], 'Desenvolve potência explosiva de quadril e condicionamento metabólico intenso.', 'O movimento é uma dobradiça de quadril explosiva (e não um agachamento); os braços apenas guiam o peso.'],
  ['Kettlebell clean', 'Funcional, Potência e Pliometria', 'Ombro', 'Kettlebell', 'Intermediário', 'shoulder_press', 3, '8-10 cada', 16, 60, ['Quadril', 'Trapézio', 'Bíceps', 'Core'], ['Ombros'], 'Leva o kettlebell do balanço entre as pernas até a posição de rack junto ao peito.', 'Faça o kettlebell girar suavemente ao redor do punho sem bater com impacto no antebraço.'],
  ['Kettlebell snatch', 'Funcional, Potência e Pliometria', 'Ombro', 'Kettlebell', 'Avançado', 'shoulder_press', 3, '8 cada', 16, 75, ['Cadeia Posterior', 'Ombros', 'Trapézio', 'Core'], ['Condicionamento'], 'Movimento explosivo levando o kettlebell de baixo até acima da cabeça em um único fluxo.', 'Empurre a mão para dentro da alça no topo para amortecer o giro do peso.'],
  ['Battle ropes', 'Funcional, Potência e Pliometria', 'Ombro', 'Corda Naval', 'Iniciante / Intermediário', 'lateral_raise', 4, '30s', 0, 45, ['Deltoides', 'Core', 'Braços', 'Sistema Cardiovascular'], ['Pernas em Isometria'], 'Ondulações explosivas com corda naval para resistência anaeróbica de membros superiores.', 'Permaneça em base atlética (joelhos semiflexionados) mantendo ondas rápidas e contínuas.'],
  ['Prowler push', 'Funcional, Potência e Pliometria', 'Perna', 'Prowler / Trenó', 'Intermediário / Avançado', 'leg_press', 4, '20m', 60, 75, ['Potência de Pernas e Glúteos', 'Core'], ['Ombros', 'Cardio'], 'Desenvolve aceleração, força de empurrão horizontal e resistência lática.', 'Mantenha a coluna alinhada dos calcanhares à cabeça enquanto empurra.'],
  ['Caminhada do fazendeiro (Funcional)', 'Funcional, Potência e Pliometria', 'Costa', 'Kettlebells ou Halteres Pesados', 'Iniciante / Intermediário', 'squat', 4, '30m', 28, 60, ['Core', 'Trapézio', 'Pegada', 'Estabilizadores do Quadril'], [], 'Transporte de carga pesada essencial para força funcional na vida real.', 'Evite inclinar o tronco para os lados a cada passo.'],
  ['Turkish get-up', 'Funcional, Potência e Pliometria', 'Ombro', 'Kettlebell ou Halter', 'Avançado', 'shoulder_press', 3, '3-5 cada lado', 12, 75, ['Estabilidade de Ombro', 'Core 360°', 'Quadril e Pernas'], [], 'Levantar-se do chão até ficar em pé mantendo um peso sustentado acima da cabeça.', 'Mantenha os olhos fixos no kettlebell durante todas as etapas da subida e descida.'],

  // ================= 15. CALISTENIA E PESO CORPORAL (16 EXERCÍCIOS) =================
  ['Flexão de braços (Calistenia)', 'Calistenia e Peso Corporal', 'Peito', 'Peso Corporal', 'Iniciante', 'bench_press', 4, '15-20', 0, 45, ['Peitoral Maior', 'Tríceps', 'Deltoide Anterior'], ['Core'], 'Base fundamental de empurrar horizontal na calistenia.', 'No topo do movimento, empurre o chão protrusando levemente as escápulas.'],
  ['Barra fixa (Calistenia)', 'Calistenia e Peso Corporal', 'Costa', 'Barra Fixa', 'Intermediário', 'lat_pulldown', 4, '8-12', 0, 75, ['Grande Dorsal', 'Bíceps', 'Core'], ['Antebraços'], 'Base fundamental de puxar vertical com o próprio peso corporal.', 'Evite cruzar as pernas atrás; mantenha as pernas unidas à frente em hollow body.'],
  ['Chin-up (Calistenia)', 'Calistenia e Peso Corporal', 'Bíceps', 'Barra Fixa', 'Intermediário', 'lat_pulldown', 4, '8-12', 0, 75, ['Bíceps Braquial', 'Grande Dorsal'], ['Core'], 'Puxada na barra com pegada supinada para força máxima de braços e dorsais.', 'Desça até estender totalmente os cotovelos antes da próxima repetição.'],
  ['Paralelas / dips', 'Calistenia e Peso Corporal', 'Tríceps', 'Barras Paralelas', 'Intermediário', 'tricep_pushdown', 4, '8-15', 0, 60, ['Tríceps Braquial', 'Peitoral Inferior', 'Deltoide Anterior'], ['Core'], 'Conhecido como o "agachamento dos membros superiores" na calistenia.', 'Deprima os ombros para longe das orelhas durante toda a série.'],
  ['Agachamento livre (Peso Corporal)', 'Calistenia e Peso Corporal', 'Perna', 'Peso Corporal', 'Iniciante', 'squat', 4, '20-25', 0, 45, ['Quadríceps', 'Glúteos'], ['Mobilidade de Quadril e Tornozelo'], 'Fortalece as pernas e melhora o padrão natural de agachar.', 'Desça de forma profunda mantendo os calcanhares 100% no solo.'],
  ['Pistol squat', 'Calistenia e Peso Corporal', 'Perna', 'Peso Corporal', 'Avançado', 'squat', 3, '5-8 cada', 0, 75, ['Quadríceps Unilateral', 'Glúteo', 'Equilíbrio e Mobilidade'], ['Core', 'Flexores do Quadril'], 'Agachamento profundo em uma perna só com a outra estendida à frente.', 'Se estiver iniciando, segure em uma argola/poste ou desça sentado até um banco.'],
  ['Afundo (Calistenia)', 'Calistenia e Peso Corporal', 'Perna', 'Peso Corporal', 'Iniciante', 'squat', 3, '15 cada', 0, 45, ['Quadríceps', 'Glúteos'], ['Estabilidade'], 'Trabalha resistência e equilíbrio unilateral dos membros inferiores.', 'Mantenha o tronco alinhado e controle a descida até próximo ao chão.'],
  ['Prancha (Calistenia)', 'Calistenia e Peso Corporal', 'Costa', 'Peso Corporal', 'Iniciante', 'bench_press', 3, '60s', 0, 45, ['Core Completo', 'Glúteos'], ['Ombros'], 'Desenvolve a tensão corporal integrada exigida em movimentos avançados de calistenia.', 'Contraia quadríceps, glúteos e abdômen simultaneamente.'],
  ['L-sit', 'Calistenia e Peso Corporal', 'Costa', 'Paralelas Baixas (Parallettes) ou Chão', 'Avançado', 'tricep_pushdown', 4, '15-30s', 0, 60, ['Reto Abdominal', 'Flexores do Quadril', 'Tríceps'], ['Depressores da Escápula'], 'Sustentação isométrica do corpo com as pernas estendidas a 90° formando um "L".', 'Se ainda for difícil, inicie mantendo os joelhos recolhidos junto ao peito (Tuck L-sit).'],
  ['Handstand hold', 'Calistenia e Peso Corporal', 'Ombro', 'Parede ou Solo', 'Avançado', 'shoulder_press', 4, '20-45s', 0, 60, ['Deltoides', 'Trapézio', 'Tríceps', 'Core'], ['Punhos e Equilíbrio'], 'Parada de mãos isométrica para força vertical de ombros e propriocepção.', 'Empurre o chão com força máxima pelos ombros e pressione a ponta dos dedos no solo para equilibrar.'],
  ['Flexão em pino', 'Calistenia e Peso Corporal', 'Ombro', 'Parede ou Caixa (Pike Push-up / HSPU)', 'Avançado', 'shoulder_press', 3, '6-10', 0, 75, ['Deltoides', 'Tríceps Braquial', 'Trapézio'], ['Core'], 'Desenvolvimento de ombros invertido usando o peso corporal.', 'Inicie com o Pike Push-up (quadril alto em V) antes de progredir para a parede.'],
  ['Australian pull-up', 'Calistenia e Peso Corporal', 'Costa', 'Barra Baixa ou Argolas', 'Iniciante', 'barbell_row', 4, '12-15', 0, 45, ['Grande Dorsal', 'Romboides', 'Trapézio Médio'], ['Bíceps', 'Core'], 'Remada invertida horizontal excelente para iniciantes na barra fixa e fortalecimento escapular.', 'Quanto mais horizontal seu corpo ficar em relação ao chão, mais desafiador será o exercício.'],
  ['Muscle-up', 'Calistenia e Peso Corporal', 'Costa', 'Barra Fixa ou Argolas', 'Avançado', 'lat_pulldown', 3, '3-6', 0, 90, ['Grande Dorsal', 'Peitoral', 'Tríceps', 'Core Explosivo'], ['Bíceps', 'Antebraços'], 'Movimento avançado que combina uma barra fixa explosiva até a cintura seguida de transição e mergulho no topo.', 'Domine pelo menos 12 barras fixas limpas até o peito antes de treinar a transição do muscle-up.'],
  ['Burpee (Calistenia)', 'Calistenia e Peso Corporal', 'Peito', 'Peso Corporal', 'Intermediário', 'bench_press', 4, '12-15', 0, 60, ['Resistência Muscular e Cardiovascular Global'], [], 'Trabalha resistência de empurrar e explosão de membros inferiores.', 'Mantenha ritmo cadenciado para completar todas as séries com boa forma.'],
  ['Ponte', 'Calistenia e Peso Corporal', 'Perna', 'Solo', 'Iniciante', 'leg_press', 3, '15-20', 0, 45, ['Glúteos', 'Cadeia Posterior'], ['Core'], 'Ativa glúteos e mobiliza os flexores do quadril.', 'Pressione os calcanhares no solo e segure 2 segundos no topo.'],
  ['Elevação de panturrilha', 'Calistenia e Peso Corporal', 'Perna', 'Degrau e Peso Corporal', 'Iniciante', 'squat', 4, '20-25', 0, 45, ['Gastrocnêmio', 'Sóleo'], [], 'Fortalece panturrilhas e tendão de Aquiles em qualquer lugar.', 'Faça pausas de 2 segundos no pico da contração para compensar a ausência de carga externa.'],

  // ================= 16. MOBILIDADE E ALONGAMENTO (15 EXERCÍCIOS) =================
  ['Mobilidade de tornozelo na parede', 'Mobilidade e Alongamento', 'Perna', 'Parede', 'Iniciante', 'squat', 3, '12 cada lado', 0, 30, ['Mobilidade de Dorsiflexão do Tornozelo'], ['Sóleo', 'Tendão de Aquiles'], 'Aumenta a dorsiflexão do tornozelo, fundamental para agachar fundo sem tirar o calcanhar do chão.', 'Com o pé a cerca de 10cm da parede, leve o joelho até tocar a parede sem levantar o calcanhar.'],
  ['Alongamento de posterior de coxa', 'Mobilidade e Alongamento', 'Perna', 'Solo, Banco ou Fita', 'Iniciante', 'squat', 3, '30-45s cada', 0, 20, ['Flexibilidade dos Isquiotibiais'], ['Lombar'], 'Reduz o encurtamento posterior da coxa e melhora a mobilidade pélvica.', 'Mantenha a coluna alinhada ao inclinar o quadril, evitando apenas curvar as costas.'],
  ['Alongamento de flexores do quadril', 'Mobilidade e Alongamento', 'Perna', 'Colchonete (Posição de Cavaleiro)', 'Iniciante', 'squat', 3, '30-45s cada', 0, 20, ['Iliopsoas', 'Reto Femoral'], ['Alívio Lombar'], 'Essencial para quem passa horas sentado, liberando a tensão anterior do quadril.', 'Em posição de semiajoelhado, contraia o glúteo de trás encaixando a pelve antes de avançar levemente.'],
  ['Alongamento de peitoral na parede', 'Mobilidade e Alongamento', 'Peito', 'Parede ou Batente de Porta', 'Iniciante', 'chest_fly', 3, '30-45s cada', 0, 20, ['Peitoral Maior e Menor', 'Deltoide Anterior'], [], 'Abre a postura torácica e melhora a posição dos ombros.', 'Apoie o antebraço no batente a 90° e gire suavemente o tronco para o lado oposto.'],
  ['Rotação torácica', 'Mobilidade e Alongamento', 'Costa', 'Colchonete (4 Apoios ou Deitado)', 'Iniciante', 'barbell_row', 3, '10 cada lado', 0, 30, ['Mobilidade da Coluna Torácica'], ['Ombros'], 'Restaura o giro natural da parte média das costas, protegendo pescoço e lombar.', 'Com uma mão na nuca em 4 apoios, gire o cotovelo em direção ao teto acompanhando com o olhar.'],
  ['Cat-cow', 'Mobilidade e Alongamento', 'Costa', 'Colchonete (Gato-Vaca)', 'Iniciante', 'barbell_row', 3, '12 ciclos', 0, 30, ['Mobilidade Segmentar de Toda a Coluna'], [], 'Lubrifica e mobiliza vértebra por vértebra da cervical à lombar.', 'Inspire olhando à frente arqueando suavemente e expire arredondando as costas para o teto.'],
  ["World's greatest stretch", 'Mobilidade e Alongamento', 'Perna', 'Peso Corporal', 'Iniciante / Intermediário', 'squat', 2, '6 cada lado', 0, 30, ['Quadril', 'Coluna Torácica', 'Isquiotibiais', 'Tornozelos'], [], 'O alongamento dinâmico mais completo para aquecimento pré-treino de corpo inteiro.', 'Em passada longa, leve o cotovelo ao pé da frente e depois gire o braço abrindo o peito para o teto.'],
  ['Alongamento de panturrilha', 'Mobilidade e Alongamento', 'Perna', 'Parede ou Degrau', 'Iniciante', 'squat', 3, '30s cada', 0, 20, ['Gastrocnêmio e Sóleo'], [], 'Alivia a tensão nas panturrilhas e melhora a amplitude do tornozelo.', 'Mantenha o calcanhar de trás totalmente colado no chão enquanto inclina à frente.'],
  ['Alongamento de quadríceps', 'Mobilidade e Alongamento', 'Perna', 'Em Pé ou Deitado', 'Iniciante', 'leg_extension', 3, '30s cada', 0, 20, ['Quadríceps Femoral'], ['Flexores do Quadril'], 'Alivia a tensão na parte frontal da coxa e patela.', 'Puxe o peito do pé em direção ao glúteo mantendo os dois joelhos unidos e o quadril encaixado.'],
  ['Alongamento de glúteos', 'Mobilidade e Alongamento', 'Perna', 'Colchonete (Figura 4 / Pombo)', 'Iniciante', 'squat', 3, '30-45s cada', 0, 20, ['Glúteo Máximo, Médio e Piriforme'], [], 'Libera a musculatura profunda do quadril e alivia tensões lombares e ciáticas.', 'Deitado de costas, cruze o tornozelo sobre o joelho oposto e puxe a coxa em direção ao peito.'],
  ['Alongamento de dorsal', 'Mobilidade e Alongamento', 'Costa', 'Barra ou Espaldar', 'Iniciante', 'lat_pulldown', 3, '30s cada', 0, 20, ['Grande Dorsal', 'Redondo Maior'], ['Ombros'], 'Melhora a elevação dos braços acima da cabeça.', 'Segure em um suporte firme e jogue o quadril para trás deixando o tronco afundar entre os braços.'],
  ['Agachamento profundo sustentado', 'Mobilidade e Alongamento', 'Perna', 'Peso Corporal (Deep Squat Hold)', 'Iniciante', 'squat', 3, '45-60s', 0, 30, ['Mobilidade de Quadril, Joelhos, Tornozelos e Lombar'], [], 'Posição natural de cócoras para abrir os quadris e descomprimir a lombar.', 'Use os cotovelos por dentro dos joelhos para empurrá-los suavemente para fora mantendo o peito alto.'],
  ['Mobilidade de ombros com bastão', 'Mobilidade e Alongamento', 'Ombro', 'Bastão de PVC ou Elástico', 'Iniciante', 'shoulder_press', 3, '12', 0, 30, ['Mobilidade da Cintura Escapular e Peitoral'], [], 'Aquece a cápsula articular dos ombros antes de treinos de membros superiores.', 'Com pegada bem aberta no bastão e cotovelos esticados, passe o bastão da frente até as costas com suavidade.'],
  ['Alongamento de punhos', 'Mobilidade e Alongamento', 'Bíceps', 'Solo (4 Apoios) ou Em Pé', 'Iniciante', 'bicep_curl', 2, '30s', 0, 20, ['Flexores e Extensores do Punho'], [], 'Prepara os punhos para supino, flexões, barra e levantamentos olímpicos.', 'Apoie as palmas no chão com dedos voltados para você e incline suavemente para trás.'],
  ['Rotação externa de ombro com elástico', 'Mobilidade e Alongamento', 'Ombro', 'Elástico Leve', 'Iniciante', 'bicep_curl', 3, '15', 0, 30, ['Manguito Rotador (Infraespinhal e Redondo Menor)'], ['Estabilizadores Escapulares'], 'Ativa e lubrifica o manguito rotador antes das séries principais.', 'Execute o movimento de forma lenta e controlada, sem pressa.'],

  // ================= 17. EXERCÍCIOS OLÍMPICOS E LEVANTAMENTO DE PESO (12 EXERCÍCIOS) =================
  ['Arranco (snatch)', 'Exercícios Olímpicos e Levantamento de Peso', 'Ombro', 'Barra Olímpica e Anilhas Bumper', 'Avançado', 'shoulder_press', 5, '2-3', 50, 120, ['Potência de Corpo Inteiro', 'Cadeia Posterior', 'Ombros', 'Pernas'], ['Core', 'Trapézio'], 'Levantamento olímpico clássico que leva a barra do chão até acima da cabeça em um único movimento explosivo.', 'Exige domínio técnico de extensão tripla, pegada aberta (snatch grip) e recepção em agachamento overhead.'],
  ['Arranco de potência', 'Exercícios Olímpicos e Levantamento de Peso', 'Ombro', 'Barra Olímpica (Power Snatch)', 'Avançado', 'shoulder_press', 4, '3-5', 45, 90, ['Potência Explosiva de Quadril, Trapézio e Ombros'], ['Quadríceps', 'Core'], 'Variação do arranco recebendo a barra acima da cabeça em semiafachamento (acima da linha paralela).', 'Mantenha a barra subindo bem próxima ao corpo após o contato com o quadril.'],
  ['Arremesso (clean and jerk)', 'Exercícios Olímpicos e Levantamento de Peso', 'Ombro', 'Barra Olímpica e Anilhas Bumper', 'Avançado', 'shoulder_press', 5, '2-3', 65, 120, ['Potência Máxima de Corpo Inteiro', 'Pernas', 'Ombros', 'Costas'], ['Core', 'Tríceps'], 'Levantamento olímpico em dois tempos: 1º leva a barra do solo aos ombros (Clean) e 2º arremessa acima da cabeça (Jerk).', 'Estabilize totalmente o tronco e os pés após o Clean antes de iniciar o impulso do Jerk.'],
  ['Clean', 'Exercícios Olímpicos e Levantamento de Peso', 'Perna', 'Barra Olímpica', 'Avançado', 'squat', 4, '3-5', 65, 90, ['Quadríceps', 'Glúteos', 'Isquiotibiais', 'Trapézio'], ['Core', 'Deltoides'], 'Primeira fase do arremesso olímpico, puxando a barra do chão e recebendo-a em agachamento frontal.', 'Gire os cotovelos rapidamente para a frente na recepção da barra sobre os deltoides.'],
  ['Power clean', 'Exercícios Olímpicos e Levantamento de Peso', 'Perna', 'Barra Olímpica', 'Intermediário / Avançado', 'squat', 4, '3-5', 60, 90, ['Potência de Quadril, Posteriores, Glúteos e Trapézio'], ['Quadríceps', 'Core'], 'Variação muito utilizada na preparação esportiva onde a barra é recebida nos ombros sem precisar agachar fundo.', 'A força vem da extensão explosiva dos quadris e pernas, e não de puxar cedo com os braços.'],
  ['Hang clean', 'Exercícios Olímpicos e Levantamento de Peso', 'Perna', 'Barra Olímpica', 'Intermediário / Avançado', 'squat', 4, '4-6', 55, 90, ['Potência de Quadril', 'Trapézio', 'Quadríceps'], ['Core'], 'Inicia com a barra suspensa acima dos joelhos, facilitando o aprendizado da explosão de quadril.', 'Incline o quadril para trás levando a barra até acima dos joelhos e exploda verticalmente.'],
  ['Jerk', 'Exercícios Olímpicos e Levantamento de Peso', 'Ombro', 'Barra Olímpica (Split Jerk ou Power Jerk)', 'Avançado', 'shoulder_press', 4, '3-5', 60, 90, ['Potência de Pernas, Ombros e Tríceps'], ['Core', 'Estabilidade'], 'Segunda fase do arremesso olímpico: impulsiona a barra dos ombros para cima da cabeça entrando embaixo dela.', 'Use o impulso rápido dos joelhos (dip and drive) e trave os cotovelos entrando firme sob a barra.'],
  ['Push press', 'Exercícios Olímpicos e Levantamento de Peso', 'Ombro', 'Barra Olímpica ou Halteres', 'Intermediário', 'shoulder_press', 4, '6-8', 45, 75, ['Deltoides', 'Tríceps', 'Quadríceps'], ['Core'], 'Desenvolvimento em pé com um curto impulso inicial dos joelhos para movimentar mais carga acima da cabeça.', 'Flexione os joelhos cerca de 10cm mantendo o tronco vertical e empurre de forma explosiva.'],
  ['Agachamento de arranco', 'Exercícios Olímpicos e Levantamento de Peso', 'Perna', 'Barra Olímpica (Overhead Squat)', 'Avançado', 'squat', 4, '5-8', 40, 90, ['Quadríceps', 'Glúteos', 'Estabilidade de Ombros e Core'], ['Mobilidade Torácica e Tornozelo'], 'Agachamento profundo sustentando a barra com pegada aberta acima da cabeça.', 'Empurre ativamente a barra contra o teto durante toda a descida e subida.'],
  ['Levantamento terra (LPO / Básico)', 'Exercícios Olímpicos e Levantamento de Peso', 'Costa', 'Barra Olímpica', 'Intermediário / Avançado', 'squat', 4, '5', 100, 120, ['Cadeia Posterior', 'Glúteos', 'Eretores da Espinha', 'Grande Dorsal'], ['Quadríceps', 'Pegada'], 'Levantamento básico fundamental de força máxima tirando a carga inerte do solo.', 'Tire a folga da barra antes de puxar e mantenha a coluna neutra do início ao fim.'],
  ['Agachamento (LPO / Básico)', 'Exercícios Olímpicos e Levantamento de Peso', 'Perna', 'Barra Olímpica e Rack', 'Intermediário / Avançado', 'squat', 4, '5-8', 85, 90, ['Quadríceps Femoral', 'Glúteo Máximo'], ['Core', 'Eretores da Espinha'], 'Pilar de força de membros inferiores no levantamento de peso básico e olímpico.', 'Inspire fundo travando o abdômen em 360° antes de iniciar cada repetição.'],
  ['Supino (Básico de Força)', 'Exercícios Olímpicos e Levantamento de Peso', 'Peito', 'Barra Olímpica e Banco Reto', 'Intermediário / Avançado', 'bench_press', 4, '5-8', 60, 90, ['Peitoral Maior', 'Tríceps Braquial', 'Deltoide Anterior'], ['Dorsais e Leg Drive'], 'Levantamento básico de força máxima para membros superiores.', 'Mantenha pés firmes no solo (leg drive) e escápulas retraídas contra o banco.'],
  ['Desenvolvimento em pé', 'Exercícios Olímpicos e Levantamento de Peso', 'Ombro', 'Barra Olímpica (Strict Press)', 'Intermediário', 'shoulder_press', 4, '6-8', 40, 75, ['Deltoide Anterior e Lateral', 'Tríceps Braquial'], ['Core', 'Glúteos'], 'Empurrão vertical estrito em pé sem auxílio das pernas para força pura de ombros.', 'Contraia glúteos e quadríceps em pé e passe a barra rente ao queixo encaixando a cabeça à frente no topo.']
];

// ============================================================================
// MOTOR BIOMECÂNICO E ANATÔMICO DE ALTA PRECISÃO (28 PADRÕES + 23 ZONAS MUSCULARES)
// ============================================================================
const MUSCLE_ZONE_LABELS = {
  upper_chest: 'Peitoral Superior (Clavicular)',
  mid_chest: 'Peitoral Medial (Esternal)',
  lower_chest: 'Peitoral Inferior (Abdominal)',
  front_delts: 'Deltoide Anterior (Frontal)',
  side_delts: 'Deltoide Lateral (Médio)',
  rear_delts: 'Deltoide Posterior / Manguito',
  upper_traps: 'Trapézio Superior',
  mid_traps: 'Trapézio Médio e Romboides',
  lats: 'Grande Dorsal (Latíssimo)',
  lower_back: 'Lombar (Eretores da Espinha)',
  biceps: 'Bíceps Braquial e Braquial',
  triceps: 'Tríceps Braquial (3 Cabeças)',
  forearms: 'Antebraços e Pegada',
  upper_abs: 'Reto Abdominal Superior',
  lower_abs: 'Abdômen Inferior (Infra)',
  obliques: 'Oblíquos e Core Transverso',
  quads: 'Quadríceps Femoral',
  adductors: 'Adutores (Interno da Coxa)',
  hamstrings: 'Isquiotibiais (Posterior de Coxa)',
  glutes_max: 'Glúteo Máximo',
  glutes_med: 'Glúteo Médio e Mínimo (Lateral)',
  calves: 'Panturrilhas (Gastrocnêmio/Sóleo)',
  tibialis: 'Tibial Anterior (Canela)'
};

function resolveExerciseBiomechanics(name = '', subCategory = '', category = '', primaryMuscles = [], secondaryMuscles = [], equipment = '') {
  const n = name.toLowerCase();
  const sub = (subCategory || '').toLowerCase();
  const primText = (primaryMuscles || []).join(' ').toLowerCase();
  const secText = (secondaryMuscles || []).join(' ').toLowerCase();

  let pattern = 'bench_press';
  let primaryZones = [];
  let secondaryZones = [];
  let cue = 'CONTROLE A FASE EXCÊNTRICA • AMPLITUDE COMPLETA';
  let steps = [];

  // 1. PEITO E VARIAÇÕES DE EMPURRAR HORIZONTAL / SOLO / MÁQUINA
  if (n.includes('flexão em pino') || n.includes('handstand')) {
    pattern = 'handstand';
    primaryZones = ['front_delts', 'side_delts', 'triceps'];
    secondaryZones = ['upper_traps', 'upper_abs'];
    cue = 'CORPO INVERTIDO FIRME • EMPURRE O SOLO COM OS OMBROS';
  } else if (n.includes('burpee')) {
    pattern = 'burpee';
    primaryZones = ['mid_chest', 'quads', 'front_delts'];
    secondaryZones = ['triceps', 'upper_abs', 'calves'];
    cue = 'AGACHE, PRANCHA NO SOLO E SALTO EXPLOSIVO VERTICAL';
  } else if (n.includes('flexão')) {
    pattern = 'push_up';
    if (n.includes('diamante')) {
      primaryZones = ['triceps', 'mid_chest'];
      secondaryZones = ['front_delts', 'upper_abs'];
      cue = 'MÃOS UNIDAS EM DIAMANTE • COTOVELOS RENTES AO TRONCO';
    } else if (n.includes('declinada')) {
      primaryZones = ['upper_chest', 'front_delts'];
      secondaryZones = ['triceps', 'upper_abs'];
      cue = 'PÉS ELEVADOS • FOCO NO PEITORAL SUPERIOR';
    } else if (n.includes('inclinada')) {
      primaryZones = ['lower_chest', 'mid_chest'];
      secondaryZones = ['triceps', 'front_delts'];
      cue = 'MÃOS NO BANCO • CORPO EM LINHA RETA';
    } else {
      primaryZones = ['mid_chest', 'triceps'];
      secondaryZones = ['front_delts', 'upper_abs'];
      cue = 'TRONCO EM PRANCHA RÍGIDA • PEITO PRÓXIMO AO SOLO';
    }
  } else if (n.includes('chest press') || n.includes('supino articulado')) {
    pattern = 'seated_chest_press';
    primaryZones = ['mid_chest'];
    secondaryZones = ['front_delts', 'triceps'];
    cue = 'COSTAS APOIADAS NA MÁQUINA • EMPURRE À FRENTE DO PEITO';
  } else if (n.includes('peck deck') || n.includes('voador')) {
    pattern = 'peck_deck';
    primaryZones = ['mid_chest'];
    secondaryZones = ['front_delts'];
    cue = 'SENTADO NA MÁQUINA • UNA OS COTOVELOS E ESMAGUE O PEITORAL';
  } else if (n.includes('pullover com halter')) {
    pattern = 'dumbbell_pullover';
    primaryZones = ['lats', 'mid_chest'];
    secondaryZones = ['triceps', 'upper_abs'];
    cue = 'DEITADO NO BANCO • DESÇA O HALTER ATRÁS DA CABEÇA EM ARCO';
  } else if (n.includes('supino inclinado') || n.includes('crucifixo inclinado') || n.includes('crossover na polia baixa')) {
    pattern = n.includes('crucifixo') || n.includes('crossover') ? 'chest_fly' : 'incline_press';
    primaryZones = ['upper_chest'];
    secondaryZones = ['front_delts', 'triceps'];
    cue = 'BANCO A 30°-45° • MÁXIMA ATIVAÇÃO CLAVICULAR (SUPERIOR)';
  } else if (n.includes('supino declinado') || n.includes('crucifixo declinado') || n.includes('crossover na polia alta')) {
    pattern = n.includes('crucifixo') || n.includes('crossover') ? 'chest_fly' : 'decline_press';
    primaryZones = ['lower_chest', 'mid_chest'];
    secondaryZones = ['triceps', 'front_delts'];
    cue = 'ESCÁPULAS RETRAÍDAS • FOCO NAS FIBRAS INFERIORES DO PEITO';
  } else if (n.includes('supino fechado')) {
    pattern = 'bench_press';
    primaryZones = ['triceps'];
    secondaryZones = ['mid_chest', 'front_delts'];
    cue = 'PEGADA NA LARGURA DOS OMBROS • COTOVELOS COLADOS AO CORPO';
  } else if (n.includes('supino')) {
    pattern = 'bench_press';
    primaryZones = ['mid_chest'];
    secondaryZones = ['front_delts', 'triceps'];
    cue = 'ESCÁPULAS RETRAÍDAS NO BANCO • COTOVELOS A 45°-60°';
  } else if (n.includes('crucifixo inverso com halter')) {
    pattern = 'bent_over_reverse_fly';
    primaryZones = ['rear_delts', 'mid_traps'];
    secondaryZones = ['upper_traps', 'lower_back'];
    cue = 'TRONCO INCLINADO À FRENTE • ABRA OS HALTERES COM OS COTOVELOS';
  } else if (n.includes('crucifixo inverso') || n.includes('face pull')) {
    pattern = 'rear_delt';
    primaryZones = ['rear_delts', 'mid_traps'];
    secondaryZones = ['upper_traps'];
    cue = 'ABRA LIDERANDO PELOS COTOVELOS • FOCO NO DELTOIDE POSTERIOR';
  } else if (n.includes('crucifixo') || n.includes('crossover') || n.includes('alongamento de peitoral')) {
    pattern = 'chest_fly';
    primaryZones = ['mid_chest'];
    secondaryZones = ['front_delts'];
    cue = 'COTOVELOS SEMIFLEXIONADOS • ESMAGUE O PEITORAL NO CENTRO';
  } else if (n.includes('pullover') || n.includes('pulldown') || n.includes('alongamento de dorsal')) {
    pattern = 'pullover_pulldown';
    primaryZones = n.includes('peito') ? ['mid_chest', 'lats'] : ['lats'];
    secondaryZones = ['triceps', 'upper_abs'];
    cue = 'BRAÇOS SEMIESTENDIDOS • MOVIMENTO EXCLUSIVO DO OMBRO';
  }
  // 2. COSTAS (BARRA FIXA, PUXADAS E REMADAS)
  else if (n.includes('australian pull-up')) {
    pattern = 'inverted_row';
    primaryZones = ['mid_traps', 'lats'];
    secondaryZones = ['biceps', 'rear_delts', 'upper_abs'];
    cue = 'CORPO RETO SOB A BARRA BAIXA • PUXE O PEITO ATÉ A BARRA';
  } else if (n.includes('barra fixa') || n.includes('chin-up') || n.includes('muscle-up')) {
    pattern = 'pull_up';
    if (n.includes('supinada') || n.includes('chin-up')) {
      primaryZones = ['lats', 'biceps'];
      secondaryZones = ['mid_traps', 'forearms'];
      cue = 'PEGADA SUPINADA • PUXE ATÉ O QUEIXO PASSAR DA BARRA';
    } else {
      primaryZones = ['lats', 'mid_traps'];
      secondaryZones = ['biceps', 'rear_delts', 'forearms'];
      cue = 'DEPRIMA AS ESCÁPULAS • LEVE O PEITO EM DIREÇÃO À BARRA';
    }
  } else if (n.includes('puxada')) {
    pattern = 'lat_pulldown';
    primaryZones = ['lats'];
    secondaryZones = ['biceps', 'mid_traps', 'rear_delts'];
    cue = 'PEITO ESTUFADO • PUXE OS COTOVELOS PARA BAIXO E PARA TRÁS';
  } else if (n.includes('remada unilateral') || n.includes('remada serrote')) {
    pattern = 'one_arm_row';
    primaryZones = ['lats', 'mid_traps'];
    secondaryZones = ['biceps', 'rear_delts'];
    cue = 'MÃO E JOELHO APOIADOS NO BANCO • PUXE O HALTER EM DIREÇÃO AO QUADRIL';
  } else if (n.includes('remada baixa') || n.includes('remada articulada') || n.includes('remada máquina') || n.includes('remo ergométrico') || n.includes('sled pull')) {
    pattern = 'seated_row';
    primaryZones = ['mid_traps', 'lats'];
    secondaryZones = ['rear_delts', 'biceps', 'forearms'];
    cue = 'COLUNA ERETA • APERTE AS ESCÁPULAS NO FINAL DA PUXADA';
  } else if (n.includes('remada alta')) {
    pattern = 'upright_row';
    primaryZones = ['side_delts', 'upper_traps'];
    secondaryZones = ['front_delts', 'biceps', 'forearms'];
    cue = 'SUBA PELOS COTOVELOS ATÉ A LINHA DOS OMBROS';
  } else if (n.includes('remada') || n.includes('rack pull')) {
    pattern = 'barbell_row';
    primaryZones = ['lats', 'mid_traps'];
    secondaryZones = ['rear_delts', 'biceps', 'lower_back'];
    cue = 'TRONCO INCLINADO COM COLUNA NEUTRA • PUXE NA DIREÇÃO DO UMBIGO';
  }
  // 3. OMBROS
  else if (n.includes('desenvolvimento') || n.includes('arnold press') || n.includes('push press') || n.includes('jerk') || n.includes('arremesso de medicine') || n.includes('mobilidade de ombros')) {
    pattern = 'shoulder_press';
    primaryZones = ['front_delts', 'side_delts'];
    secondaryZones = ['triceps', 'upper_traps'];
    cue = 'CORE TRAVADO • EMPURRE VERTICALMENTE ACIMA DA CABEÇA';
  } else if (n.includes('elevação frontal') || n.includes('y-raise') || n.includes('battle ropes')) {
    pattern = 'front_raise';
    primaryZones = ['front_delts'];
    secondaryZones = ['upper_chest', 'side_delts'];
    cue = 'SUBA SEM IMPULSO ATÉ A ALTURA DOS OLHOS';
  } else if (n.includes('elevação lateral')) {
    pattern = 'lateral_raise';
    primaryZones = ['side_delts'];
    secondaryZones = ['upper_traps', 'front_delts'];
    cue = 'LIDERE COM OS COTOVELOS • FOCO TOTAL NO DELTOIDE LATERAL';
  } else if (n.includes('rotação externa') || n.includes('rotação interna')) {
    pattern = 'rotator_cuff';
    primaryZones = ['rear_delts'];
    secondaryZones = ['side_delts'];
    cue = 'COTOVELO COLADO NA COSTELA A 90° • ROTAÇÃO PURA DO ÚMERO';
  }
  // 4. TRÍCEPS
  else if (n.includes('tríceps testa')) {
    pattern = 'skull_crusher';
    primaryZones = ['triceps'];
    secondaryZones = ['forearms'];
    cue = 'COTOVELOS APONTADOS PARA O TETO • DESÇA NA LINHA DA TESTA';
  } else if (n.includes('tríceps francês') || n.includes('acima da cabeça')) {
    pattern = 'overhead_tricep';
    primaryZones = ['triceps'];
    secondaryZones = ['front_delts'];
    cue = 'BRAÇOS ELEVADOS • ALONGAMENTO MÁXIMO DA CABEÇA LONGA DO TRÍCEPS';
  } else if (n.includes('tríceps coice')) {
    pattern = 'tricep_kickback';
    primaryZones = ['triceps'];
    secondaryZones = ['rear_delts'];
    cue = 'COTOVELO ALTO E FIXO AO LADO DO TRONCO • ESTENDA PARA TRÁS';
  } else if (n.includes('mergulho no banco')) {
    pattern = 'bench_dip';
    primaryZones = ['triceps'];
    secondaryZones = ['front_delts', 'lower_chest'];
    cue = 'MÃOS APOIADAS NO BANCO ATRÁS DO QUADRIL • FLEXIONE OS COTOVELOS A 90°';
  } else if (n.includes('mergulho') || n.includes('paralelas') || n.includes('dips')) {
    pattern = 'dips';
    primaryZones = ['triceps', 'lower_chest'];
    secondaryZones = ['front_delts'];
    cue = 'OMBROS LONGE DAS ORELHAS • DESÇA ATÉ 90° NOS COTOVELOS';
  } else if (n.includes('tríceps pulley') || n.includes('tríceps corda')) {
    pattern = 'tricep_pushdown';
    primaryZones = ['triceps'];
    secondaryZones = ['forearms'];
    cue = 'COTOVELOS TRAVADOS NAS COSTELAS • EXTENSÃO TOTAL EMBAIXO';
  }
  // 5. BÍCEPS E ANTEBRAÇO
  else if (n.includes('rosca na polia alta')) {
    pattern = 'high_cable_curl';
    primaryZones = ['biceps'];
    secondaryZones = ['forearms'];
    cue = 'COTOVELOS ALINHADOS AOS OMBROS • PUXE AS POLIAS EM DUPLO BÍCEPS';
  } else if (n.includes('rosca scott') || n.includes('rosca spider') || n.includes('rosca concentrada')) {
    pattern = 'preacher_curl';
    primaryZones = ['biceps'];
    secondaryZones = ['forearms'];
    cue = 'BRAÇO APOIADO SEM ROUBO • ISOLAMENTO TOTAL DO BÍCEPS';
  } else if (n.includes('punho') || n.includes('hand grip') || n.includes('pinça') || n.includes('pronação')) {
    pattern = 'wrist_curl';
    primaryZones = ['forearms'];
    secondaryZones = ['biceps'];
    cue = 'ANTEBRAÇO ESTABILIZADO • AMPLITUDE MÁXIMA DO PUNHO E DEDOS';
  } else if (n.includes('rosca inversa') || n.includes('rosca martelo') || n.includes('rosca zottman')) {
    pattern = 'bicep_curl';
    primaryZones = ['biceps', 'forearms'];
    secondaryZones = [];
    cue = 'COTOVELOS FIXOS • FORTE ATIVAÇÃO DE BRAQUIAL E ANTEBRAÇO';
  } else if (n.includes('rosca')) {
    pattern = 'bicep_curl';
    primaryZones = ['biceps'];
    secondaryZones = ['forearms'];
    cue = 'COTOVELOS FIXOS AO LADO DO CORPO • SUPINAÇÃO E PICO DE CONTRAÇÃO';
  } else if (n.includes('farmer') || n.includes('fazendeiro')) {
    pattern = 'farmers_walk';
    primaryZones = ['forearms', 'upper_traps', 'obliques'];
    secondaryZones = ['glutes_med', 'calves'];
    cue = 'POSTURA ALTA E OMBROS RETRAÍDOS • PEGADA FIRME CAMINHANDO';
  } else if (n.includes('dead hang') || n.includes('suspensão')) {
    pattern = 'pull_up';
    primaryZones = ['forearms', 'lats'];
    secondaryZones = ['side_delts'];
    cue = 'SUSPENSÃO ISOMÉTRICA • OMBROS ESTÁVEIS E PEGADA FECHADA';
  }
  // 6. PERNAS, GLÚTEOS, POSTERIOR E PANTURRILHA
  else if (n.includes('elevação pélvica') || n.includes('hip thrust') || n.includes('ponte')) {
    pattern = 'hip_thrust';
    primaryZones = ['glutes_max'];
    secondaryZones = ['hamstrings', 'quads'];
    cue = 'ESCÁPULAS NO BANCO • CONTRAIA FORTE OS GLÚTEOS NO TOPO POR 2S';
  } else if (n.includes('stiff') || n.includes('terra romeno') || n.includes('good morning') || n.includes('pull-through') || n.includes('kettlebell swing') || n.includes('alongamento de posterior')) {
    pattern = 'hip_hinge';
    primaryZones = ['hamstrings', 'glutes_max'];
    secondaryZones = ['lower_back'];
    cue = 'DOBRADIÇA DE QUADRIL • EMPURRE O QUADRIL PARA TRÁS COM COLUNA RETA';
  } else if (n.includes('levantamento terra')) {
    pattern = 'deadlift';
    primaryZones = ['hamstrings', 'glutes_max', 'lower_back', 'lats'];
    secondaryZones = ['quads', 'upper_traps', 'forearms'];
    cue = 'BARRA COLADA NA CANELA • COLUNA NEUTRA E EXTENSÃO SIMULTÂNEA';
  } else if (n.includes('cadeira flexora')) {
    pattern = 'seated_leg_curl';
    primaryZones = ['hamstrings'];
    secondaryZones = ['calves'];
    cue = 'SENTADO COM COXAS TRAVADAS • FLEXIONE OS JOELHOS PARA BAIXO E PARA TRÁS';
  } else if (n.includes('flexora em pé')) {
    pattern = 'standing_leg_curl';
    primaryZones = ['hamstrings'];
    secondaryZones = ['calves', 'glutes_max'];
    cue = 'EM PÉ APOIADO • FLEXIONE UM JOELHO DE CADA VEZ ISOLANDO O POSTERIOR';
  } else if (n.includes('nordic curl') || n.includes('glute-ham')) {
    pattern = 'nordic_curl';
    primaryZones = ['hamstrings'];
    secondaryZones = ['glutes_max', 'lower_back'];
    cue = 'TORNOZELOS PRESOS • DESÇA O TRONCO CONTROLANDO COM OS POSTERIORES';
  } else if (n.includes('mesa flexora')) {
    pattern = 'leg_curl';
    primaryZones = ['hamstrings'];
    secondaryZones = ['calves', 'glutes_max'];
    cue = 'DEITADO DE BRUÇOS • FLEXIONE OS JOELHOS SEM ELEVAR O QUADRIL';
  } else if (n.includes('cadeira extensora') || n.includes('alongamento de quadríceps')) {
    pattern = 'leg_extension';
    primaryZones = ['quads'];
    secondaryZones = [];
    cue = 'ISOLAMENTO TOTAL DO QUADRÍCEPS • SEGURE 1S NA EXTENSÃO MÁXIMA';
  } else if (n.includes('bicicleta') || n.includes('spinning') || n.includes('ciclismo')) {
    pattern = 'cycling_bike';
    primaryZones = ['quads', 'calves'];
    secondaryZones = ['glutes_max', 'hamstrings'];
    cue = 'CADÊNCIA FLUIDA NOS PEDAIS • JOELHOS ALINHADOS COM OS PÉS';
  } else if (n.includes('leg press') || n.includes('hack')) {
    pattern = 'leg_press';
    primaryZones = n.includes('panturrilha') ? ['calves'] : ['quads', 'glutes_max'];
    secondaryZones = n.includes('panturrilha') ? ['tibialis'] : ['hamstrings', 'adductors'];
    cue = 'LOMBAR COLADA NO ENCOSTO • EMPURRE A PLATAFORMA SEM TRAVAR JOELHOS';
  } else if (n.includes('step-up') || n.includes('escada') || n.includes('stair climber')) {
    pattern = 'step_up';
    primaryZones = sub.includes('glúteo') ? ['glutes_max', 'quads'] : ['quads', 'glutes_max'];
    secondaryZones = ['calves', 'hamstrings'];
    cue = 'SUBA NO DEGRAU/CAIXA EMPURRANDO COM O CALCANHAR DA PERNA DE CIMA';
  } else if (n.includes('pistol squat')) {
    pattern = 'pistol_squat';
    primaryZones = ['quads', 'glutes_max'];
    secondaryZones = ['hamstrings', 'upper_abs', 'calves'];
    cue = 'AGACHAMENTO PROFUNDO EM UMA PERNA SÓ • PERNA LIVRE ESTENDIDA À FRENTE';
  } else if (n.includes('afundo') || n.includes('passada') || n.includes('avanço') || n.includes('búlgaro') || n.includes('flexores do quadril') || n.includes('greatest stretch')) {
    pattern = 'lunge';
    primaryZones = sub.includes('glúteo') ? ['glutes_max', 'quads'] : ['quads', 'glutes_max'];
    secondaryZones = ['hamstrings', 'glutes_med'];
    cue = 'JOELHO DA FRENTE ALINHADO AO PÉ • FORÇA NO CALCANHAR DA PERNA APOIADA';
  } else if (n.includes('abdução') || n.includes('miniband') || n.includes('alongamento de glúteos')) {
    pattern = 'hip_abduction';
    primaryZones = ['glutes_med', 'glutes_max'];
    secondaryZones = ['hamstrings'];
    cue = 'ABERTURA LATERAL CONTROLADA • FOCO NO GLÚTEO MÉDIO E SUPERIOR';
  } else if (n.includes('coice') || n.includes('extensão de quadril')) {
    pattern = 'glute_kickback';
    primaryZones = ['glutes_max'];
    secondaryZones = ['hamstrings', 'glutes_med'];
    cue = 'PELVE ESTÁVEL SEM ARQUEAR A LOMBAR • EXTENSÃO DE QUADRIL NO GLÚTEO';
  } else if (n.includes('panturrilha sentada')) {
    pattern = 'seated_calf_raise';
    primaryZones = ['calves'];
    secondaryZones = ['tibialis'];
    cue = 'SENTADO COM JOELHOS A 90° • FOCO TOTAL NO MÚSCULO SÓLEO';
  } else if (n.includes('panturrilha') || n.includes('alongamento de panturrilha')) {
    pattern = 'calf_raise';
    primaryZones = ['calves'];
    secondaryZones = ['tibialis'];
    cue = 'AMPLITUDE MÁXIMA NO TORNOZELO • PAUSA DE 2S NO PICO NA PONTA DOS PÉS';
  } else if (n.includes('dorsiflexão') || n.includes('tibial') || n.includes('mobilidade de tornozelo')) {
    pattern = 'tibialis_raise';
    primaryZones = ['tibialis'];
    secondaryZones = ['calves'];
    cue = 'CALCANHAR NO CHÃO E PONTA DO PÉ PARA CIMA • FOCO NO TIBIAL ANTERIOR';
  } else if (n.includes('salto') || n.includes('saltos')) {
    pattern = 'box_jump';
    primaryZones = ['quads', 'glutes_max', 'calves'];
    secondaryZones = ['hamstrings', 'upper_abs'];
    cue = 'IMPULSO EXPLOSIVO DE QUADRIL E JOELHOS • ATERRISSAGEM SUAVE';
  } else if (n.includes('agachamento sumô')) {
    pattern = 'squat';
    primaryZones = ['quads', 'adductors', 'glutes_max'];
    secondaryZones = ['hamstrings', 'lower_back'];
    cue = 'BASE AMPLA COM PÉS A 45° • JOELHOS EMPURRADOS PARA FORA';
  } else if (n.includes('agachamento') || n.includes('sissy') || n.includes('wall ball')) {
    pattern = 'squat';
    primaryZones = n.includes('arranco') ? ['quads', 'glutes_max', 'front_delts', 'upper_traps'] : ['quads', 'glutes_max'];
    secondaryZones = ['hamstrings', 'lower_back', 'upper_abs'];
    cue = n.includes('arranco')
      ? 'BARRA SUSTENTADA ACIMA DA CABEÇA • AGACHE PROFUNDO COM TRONCO FIRME'
      : 'PEITO ALTO E COLUNA NEUTRA • JOELHOS ALINHADOS À PONTA DOS PÉS';
  }
  // 7. ABDÔMEN, CORE E LOMBAR
  else if (n.includes('l-sit')) {
    pattern = 'l_sit';
    primaryZones = ['lower_abs', 'upper_abs', 'triceps'];
    secondaryZones = ['quads', 'front_delts'];
    cue = 'BRAÇOS ESTENDIDOS NAS PARALELAS • PERNAS ELEVADAS A 90° EM L';
  } else if (n.includes('elevação de pernas suspenso') || n.includes('elevação de joelhos na barra')) {
    pattern = 'hanging_abs';
    primaryZones = ['lower_abs', 'upper_abs'];
    secondaryZones = ['obliques', 'forearms'];
    cue = 'SUSPENSO NA BARRA FIXA • ELEVE PERNAS/JOELHOS ENROLANDO A PELVE';
  } else if (n.includes('elevação de pernas') || n.includes('abdominal reverso') || n.includes('canivete') || n.includes('v-up') || n.includes('hollow')) {
    pattern = 'lying_leg_raise';
    primaryZones = ['lower_abs', 'upper_abs'];
    secondaryZones = ['obliques'];
    cue = 'LOMBAR PRESSIONADA NO SOLO • ELEVE AS PERNAS COM CONTROLE ABDOMINAL';
  } else if (n.includes('crunch na polia')) {
    pattern = 'cable_crunch';
    primaryZones = ['upper_abs', 'lower_abs'];
    secondaryZones = ['obliques'];
    cue = 'AJOELHADO NA POLIA ALTA • CURVE A COLUNA LEVANDO OS COTOVELOS AOS JOELHOS';
  } else if (n.includes('prancha lateral')) {
    pattern = 'side_plank';
    primaryZones = ['obliques'];
    secondaryZones = ['glutes_med', 'upper_abs'];
    cue = 'APOIADO EM UM ANTEBRAÇO DE LADO • MANTENHA O QUADRIL ALTO E ALINHADO';
  } else if (n.includes('mountain climber')) {
    pattern = 'mountain_climber';
    primaryZones = ['lower_abs', 'upper_abs'];
    secondaryZones = ['front_delts', 'quads'];
    cue = 'PRANCHA ALTA DINÂMICA • ALTERNE OS JOELHOS EM DIREÇÃO AO PEITO';
  } else if (n.includes('dead bug')) {
    pattern = 'dead_bug';
    primaryZones = ['upper_abs', 'lower_abs'];
    secondaryZones = ['obliques'];
    cue = 'COSTAS COLADAS NO CHÃO • ESTENDA BRAÇO E PERNA OPOSTOS ALTERNADAMENTE';
  } else if (n.includes('prancha') || n.includes('ab wheel') || n.includes('roda abdominal')) {
    pattern = 'plank_core';
    primaryZones = ['upper_abs', 'lower_abs', 'obliques'];
    secondaryZones = ['glutes_max', 'front_delts'];
    cue = 'COSTELAS FECHADAS E GLÚTEOS CONTRAÍDOS • NÃO DEIXE A LOMBAR AFUNDAR';
  } else if (n.includes('pallof')) {
    pattern = 'pallof_press';
    primaryZones = ['obliques', 'upper_abs'];
    secondaryZones = ['glutes_med'];
    cue = 'EM PÉ DE LADO PARA A POLIA • ESTENDA OS BRAÇOS RESISTINDO À ROTAÇÃO';
  } else if (n.includes('russian twist')) {
    pattern = 'russian_twist';
    primaryZones = ['obliques', 'upper_abs'];
    secondaryZones = ['lower_abs'];
    cue = 'SENTADO EM V • GIRE OS OMBROS E O TRONCO DE UM LADO PARA O OUTRO';
  } else if (n.includes('crunch') || n.includes('abdominal')) {
    pattern = 'crunch_abs';
    primaryZones = n.includes('bicicleta') ? ['obliques', 'upper_abs'] : ['upper_abs', 'lower_abs'];
    secondaryZones = ['obliques'];
    cue = 'SOLTE O AR CURVANDO AS COSTELAS NA DIREÇÃO DO QUADRIL';
  } else if (n.includes('superman')) {
    pattern = 'superman_floor';
    primaryZones = ['lower_back', 'glutes_max'];
    secondaryZones = ['rear_delts', 'hamstrings'];
    cue = 'DEITADO DE BRUÇOS NO SOLO • ELEVE BRAÇOS E PERNAS SIMULTANEAMENTE';
  } else if (n.includes('bird dog') || n.includes('cat-cow') || n.includes('rotação torácica')) {
    pattern = 'quadruped_core';
    primaryZones = ['lower_back', 'upper_abs'];
    secondaryZones = ['glutes_max', 'mid_traps'];
    cue = 'EM 4 APOIOS NO SOLO • CONTROLE VERTEBRAL E ESTABILIDADE LOMBO-PÉLVICA';
  } else if (n.includes('extensão lombar')) {
    pattern = 'back_extension';
    primaryZones = ['lower_back'];
    secondaryZones = ['glutes_max', 'hamstrings', 'mid_traps'];
    cue = 'NO BANCO ROMANO 45° • ALINHE O TRONCO SEM HIPERESTENDER A COLUNA';
  }
  // 8. OLÍMPICOS (LPO), TRENÓ E CARDIO
  else if (n.includes('arranco') || n.includes('snatch') || n.includes('clean') || n.includes('arremesso') || n.includes('turkish')) {
    pattern = 'olympic_lift';
    primaryZones = ['quads', 'glutes_max', 'hamstrings', 'front_delts', 'upper_traps'];
    secondaryZones = ['lower_back', 'triceps', 'upper_abs'];
    cue = 'EXTENSÃO TRIPLA EXPLOSIVA (TORNOZELO, JOELHO E QUADRIL) • BARRA PRÓXIMA AO CORPO';
  } else if (n.includes('sled') || n.includes('prowler')) {
    pattern = 'sled_push';
    primaryZones = ['quads', 'glutes_max', 'calves'];
    secondaryZones = ['upper_abs', 'front_delts', 'hamstrings'];
    cue = 'TRONCO A 45° E BRAÇOS FIRMES • PASSADAS POTENTES EMPURRANDO O CHÃO';
  } else if (n.includes('polichinelo')) {
    pattern = 'jumping_jack';
    primaryZones = ['calves', 'side_delts'];
    secondaryZones = ['quads', 'glutes_med'];
    cue = 'SALTE ABRINDO AS PERNAS E ELEVANDO OS BRAÇOS ACIMA DA CABEÇA';
  } else if (n.includes('pular corda')) {
    pattern = 'jump_rope';
    primaryZones = ['calves', 'forearms'];
    secondaryZones = ['quads', 'front_delts'];
    cue = 'SALTOS RÁPIDOS NA PONTA DOS PÉS • GIRE A CORDA USANDO OS PUNHOS';
  } else if (n.includes('caminhada') || n.includes('corrida') || n.includes('tiros') || n.includes('esteira') || n.includes('elíptico') || n.includes('dança') || n.includes('circuito') || n.includes('natação')) {
    pattern = 'running_cardio';
    primaryZones = ['quads', 'calves', 'glutes_max'];
    secondaryZones = ['hamstrings', 'upper_abs'];
    cue = 'POSTURA ERETA E RESPIRAÇÃO RITMADA • AMORTEÇA O IMPACTO NOS PÉS';
  } else {
    if (category === 'Peito') {
      pattern = 'bench_press';
      primaryZones = ['mid_chest'];
      secondaryZones = ['front_delts', 'triceps'];
    } else if (category === 'Ombro') {
      pattern = 'shoulder_press';
      primaryZones = ['front_delts', 'side_delts'];
      secondaryZones = ['triceps'];
    } else if (category === 'Costa') {
      pattern = 'lat_pulldown';
      primaryZones = ['lats', 'mid_traps'];
      secondaryZones = ['biceps'];
    } else if (category === 'Bíceps') {
      pattern = 'bicep_curl';
      primaryZones = ['biceps'];
      secondaryZones = ['forearms'];
    } else if (category === 'Tríceps') {
      pattern = 'tricep_pushdown';
      primaryZones = ['triceps'];
      secondaryZones = ['forearms'];
    } else {
      pattern = 'squat';
      primaryZones = ['quads', 'glutes_max'];
      secondaryZones = ['hamstrings', 'calves'];
    }
  }

  const primaryReadable = primaryZones.map((z) => MUSCLE_ZONE_LABELS[z]).filter(Boolean).join(' e ') || primaryMuscles.join(', ');
  steps = [
    `Posicione-se em ${equipment} ajustando a base e estabilizando as articulações antes de iniciar.`,
    `Execute a fase principal (concêntrica) concentrando a força diretamente em ${primaryReadable}.`,
    `Atingindo o ponto máximo do movimento (${cue.split('•')[0].trim().toLowerCase()}), sustente a contração por 1 segundo.`,
    `Retorne devagar na fase excêntrica (2 a 3 segundos) mantendo tensão muscular contínua sem perder a postura.`
  ];

  return {
    pattern,
    primaryZones,
    secondaryZones,
    cue,
    steps
  };
}

const EXERCISE_CATALOG = RAW_PDF_EXERCISES.map((row, index) => {
  const [
    name,
    subCategory,
    category,
    equipment,
    level,
    _oldAnimationType,
    defaultSets,
    defaultReps,
    defaultWeight,
    defaultRest,
    primaryMuscles,
    secondaryMuscles,
    purpose,
    proTip
  ] = row;

  const bio = resolveExerciseBiomechanics(
    name,
    subCategory,
    category,
    primaryMuscles,
    secondaryMuscles,
    equipment
  );

  return {
    id: `pdf_ex_${index + 1}`,
    name,
    subCategory,
    category,
    equipment,
    level,
    animationType: bio.pattern,
    primaryZones: bio.primaryZones,
    secondaryZones: bio.secondaryZones,
    biomechanicalCue: bio.cue,
    defaultSets,
    defaultReps,
    defaultWeight,
    defaultRest,
    primaryMuscles,
    secondaryMuscles,
    purpose,
    executionSteps: bio.steps,
    proTip
  };
});

// Sugestões rápidas de exercícios por categoria para facilitar o cadastro
const EXERCISE_SUGGESTIONS = {
  Peito: EXERCISE_CATALOG.filter((e) => e.category === 'Peito').map((e) => e.name),
  Ombro: EXERCISE_CATALOG.filter((e) => e.category === 'Ombro').map((e) => e.name),
  Perna: EXERCISE_CATALOG.filter((e) => e.category === 'Perna').map((e) => e.name),
  Costa: EXERCISE_CATALOG.filter((e) => e.category === 'Costa').map((e) => e.name),
  Bíceps: EXERCISE_CATALOG.filter((e) => e.category === 'Bíceps').map((e) => e.name),
  Tríceps: EXERCISE_CATALOG.filter((e) => e.category === 'Tríceps').map((e) => e.name)
};

// ============================================================================
// MOTOR 3D / 4D BIOMECÂNICO INTERATIVO EM 60 FPS + MAPA ANATÔMICO DE 23 ZONAS
// ============================================================================
function AnatomicalBodyMapSVG({ primaryZones = [], secondaryZones = [] }) {
  const getZoneFill = (zoneId) => {
    if (primaryZones.includes(zoneId)) return '#10b981'; // Verde Neon Principal
    if (secondaryZones.includes(zoneId)) return '#eab308'; // Âmbar Sinergista
    return '#27272a'; // Músculo inativo
  };

  const getZoneStroke = (zoneId) => {
    if (primaryZones.includes(zoneId)) return '#6ee7b7';
    if (secondaryZones.includes(zoneId)) return '#fde047';
    return '#3f3f46';
  };

  const isZoneActive = (zoneId) => primaryZones.includes(zoneId);

  return (
    <svg viewBox="0 0 250 185" className="w-full h-full select-none">
      <defs>
        <filter id="neonMuscleGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ==================== VISTA ANTERIOR (FRENTE) ==================== */}
      <g transform="translate(18, 6)">
        <text x="45" y="10" textAnchor="middle" fill="#a1a1aa" fontSize="7.5" fontWeight="bold">
          ANTERIOR (FRENTE)
        </text>
        <circle cx="45" cy="23" r="8" fill="#3f3f46" stroke="#52525b" strokeWidth="1" />
        <rect x="42" y="31" width="6" height="4" fill="#3f3f46" />

        <path
          d="M32 35 L42 32 L48 32 L58 35 L54 38 L36 38 Z"
          fill={getZoneFill('upper_traps')}
          stroke={getZoneStroke('upper_traps')}
          strokeWidth="0.9"
          filter={isZoneActive('upper_traps') ? 'url(#neonMuscleGlow)' : undefined}
        />

        <path
          d="M31 38 L44 38 L44 44 L30 43 Z M59 38 L46 38 L46 44 L60 43 Z"
          fill={getZoneFill('upper_chest')}
          stroke={getZoneStroke('upper_chest')}
          strokeWidth="0.9"
          filter={isZoneActive('upper_chest') ? 'url(#neonMuscleGlow)' : undefined}
        />
        <path
          d="M30 44 L44 44 L44 51 L31 50 Z M60 44 L46 44 L46 51 L59 50 Z"
          fill={getZoneFill('mid_chest')}
          stroke={getZoneStroke('mid_chest')}
          strokeWidth="0.9"
          filter={isZoneActive('mid_chest') ? 'url(#neonMuscleGlow)' : undefined}
        />
        <path
          d="M31 51 L44 51 L43 55 L33 55 Z M59 51 L46 51 L47 55 L57 55 Z"
          fill={getZoneFill('lower_chest')}
          stroke={getZoneStroke('lower_chest')}
          strokeWidth="0.9"
          filter={isZoneActive('lower_chest') ? 'url(#neonMuscleGlow)' : undefined}
        />

        <path
          d="M23 38 Q26 35 30 38 L28 48 L22 46 Z M67 38 Q64 35 60 38 L62 48 L68 46 Z"
          fill={getZoneFill('side_delts')}
          stroke={getZoneStroke('side_delts')}
          strokeWidth="0.9"
          filter={isZoneActive('side_delts') ? 'url(#neonMuscleGlow)' : undefined}
        />
        <path
          d="M28 39 L31 39 L31 48 L27 47 Z M62 39 L59 39 L59 48 L63 47 Z"
          fill={getZoneFill('front_delts')}
          stroke={getZoneStroke('front_delts')}
          strokeWidth="0.9"
          filter={isZoneActive('front_delts') ? 'url(#neonMuscleGlow)' : undefined}
        />

        <path
          d="M22 48 L28 49 L26 62 L20 61 Z M68 48 L62 49 L64 62 L70 61 Z"
          fill={getZoneFill('biceps')}
          stroke={getZoneStroke('biceps')}
          strokeWidth="0.9"
          filter={isZoneActive('biceps') ? 'url(#neonMuscleGlow)' : undefined}
        />
        <path
          d="M19 63 L25 63 L22 79 L17 78 Z M71 63 L65 63 L68 79 L73 78 Z"
          fill={getZoneFill('forearms')}
          stroke={getZoneStroke('forearms')}
          strokeWidth="0.9"
          filter={isZoneActive('forearms') ? 'url(#neonMuscleGlow)' : undefined}
        />

        <path
          d="M38 56 L52 56 L51 69 L39 69 Z"
          fill={getZoneFill('upper_abs')}
          stroke={getZoneStroke('upper_abs')}
          strokeWidth="0.9"
          filter={isZoneActive('upper_abs') ? 'url(#neonMuscleGlow)' : undefined}
        />
        <path
          d="M39 70 L51 70 L49 83 L41 83 Z"
          fill={getZoneFill('lower_abs')}
          stroke={getZoneStroke('lower_abs')}
          strokeWidth="0.9"
          filter={isZoneActive('lower_abs') ? 'url(#neonMuscleGlow)' : undefined}
        />
        <path
          d="M33 56 L37 56 L38 80 L34 78 Z M57 56 L53 56 L52 80 L56 78 Z"
          fill={getZoneFill('obliques')}
          stroke={getZoneStroke('obliques')}
          strokeWidth="0.9"
          filter={isZoneActive('obliques') ? 'url(#neonMuscleGlow)' : undefined}
        />

        <path
          d="M40 85 L44 85 L42 112 L39 110 Z M50 85 L46 85 L48 112 L51 110 Z"
          fill={getZoneFill('adductors')}
          stroke={getZoneStroke('adductors')}
          strokeWidth="0.9"
          filter={isZoneActive('adductors') ? 'url(#neonMuscleGlow)' : undefined}
        />
        <path
          d="M32 84 L39 85 L38 120 L30 118 Z M58 84 L51 85 L52 120 L60 118 Z"
          fill={getZoneFill('quads')}
          stroke={getZoneStroke('quads')}
          strokeWidth="0.9"
          filter={isZoneActive('quads') ? 'url(#neonMuscleGlow)' : undefined}
        />

        <path
          d="M31 123 L37 123 L36 152 L31 152 Z M59 123 L53 123 L54 152 L59 152 Z"
          fill={getZoneFill('tibialis')}
          stroke={getZoneStroke('tibialis')}
          strokeWidth="0.9"
          filter={isZoneActive('tibialis') ? 'url(#neonMuscleGlow)' : undefined}
        />
      </g>

      {/* ==================== VISTA POSTERIOR (COSTAS) ==================== */}
      <g transform="translate(132, 6)">
        <text x="45" y="10" textAnchor="middle" fill="#a1a1aa" fontSize="7.5" fontWeight="bold">
          POSTERIOR (COSTAS)
        </text>
        <circle cx="45" cy="23" r="8" fill="#3f3f46" stroke="#52525b" strokeWidth="1" />

        <path
          d="M32 34 L45 30 L58 34 L52 41 L38 41 Z"
          fill={getZoneFill('upper_traps')}
          stroke={getZoneStroke('upper_traps')}
          strokeWidth="0.9"
          filter={isZoneActive('upper_traps') ? 'url(#neonMuscleGlow)' : undefined}
        />
        <path
          d="M38 41 L52 41 L49 58 L41 58 Z"
          fill={getZoneFill('mid_traps')}
          stroke={getZoneStroke('mid_traps')}
          strokeWidth="0.9"
          filter={isZoneActive('mid_traps') ? 'url(#neonMuscleGlow)' : undefined}
        />
        <path
          d="M24 38 L32 36 L32 46 L24 45 Z M66 38 L58 36 L58 46 L66 45 Z"
          fill={getZoneFill('rear_delts')}
          stroke={getZoneStroke('rear_delts')}
          strokeWidth="0.9"
          filter={isZoneActive('rear_delts') ? 'url(#neonMuscleGlow)' : undefined}
        />

        <path
          d="M31 45 L40 45 L41 68 L33 65 Z M59 45 L50 45 L49 68 L57 65 Z"
          fill={getZoneFill('lats')}
          stroke={getZoneStroke('lats')}
          strokeWidth="0.9"
          filter={isZoneActive('lats') ? 'url(#neonMuscleGlow)' : undefined}
        />
        <path
          d="M37 68 L53 68 L51 81 L39 81 Z"
          fill={getZoneFill('lower_back')}
          stroke={getZoneStroke('lower_back')}
          strokeWidth="0.9"
          filter={isZoneActive('lower_back') ? 'url(#neonMuscleGlow)' : undefined}
        />

        <path
          d="M22 47 L29 47 L27 62 L20 61 Z M68 47 L61 47 L63 62 L70 61 Z"
          fill={getZoneFill('triceps')}
          stroke={getZoneStroke('triceps')}
          strokeWidth="0.9"
          filter={isZoneActive('triceps') ? 'url(#neonMuscleGlow)' : undefined}
        />
        <path
          d="M19 63 L25 63 L22 79 L17 78 Z M71 63 L65 63 L68 79 L73 78 Z"
          fill={getZoneFill('forearms')}
          stroke={getZoneStroke('forearms')}
          strokeWidth="0.9"
          filter={isZoneActive('forearms') ? 'url(#neonMuscleGlow)' : undefined}
        />

        <path
          d="M33 81 L44 81 L43 87 L32 87 Z M57 81 L46 81 L47 87 L58 87 Z"
          fill={getZoneFill('glutes_med')}
          stroke={getZoneStroke('glutes_med')}
          strokeWidth="0.9"
          filter={isZoneActive('glutes_med') ? 'url(#neonMuscleGlow)' : undefined}
        />
        <path
          d="M32 87 L44 87 L44 98 L32 97 Z M58 87 L46 87 L46 98 L58 97 Z"
          fill={getZoneFill('glutes_max')}
          stroke={getZoneStroke('glutes_max')}
          strokeWidth="0.9"
          filter={isZoneActive('glutes_max') ? 'url(#neonMuscleGlow)' : undefined}
        />

        <path
          d="M32 99 L43 99 L41 123 L31 122 Z M58 99 L47 99 L49 123 L59 122 Z"
          fill={getZoneFill('hamstrings')}
          stroke={getZoneStroke('hamstrings')}
          strokeWidth="0.9"
          filter={isZoneActive('hamstrings') ? 'url(#neonMuscleGlow)' : undefined}
        />
        <path
          d="M31 125 L40 125 L38 153 L32 153 Z M59 125 L50 125 L52 153 L58 153 Z"
          fill={getZoneFill('calves')}
          stroke={getZoneStroke('calves')}
          strokeWidth="0.9"
          filter={isZoneActive('calves') ? 'url(#neonMuscleGlow)' : undefined}
        />
      </g>

      <g transform="translate(15, 174)">
        <circle cx="8" cy="-3" r="4" fill="#10b981" />
        <text x="16" y="0" fill="#d4d4d8" fontSize="7.5" fontWeight="bold">
          Músculo Principal (Alvo)
        </text>
        <circle cx="128" cy="-3" r="4" fill="#eab308" />
        <text x="136" y="0" fill="#a1a1aa" fontSize="7.5" fontWeight="bold">
          Músculos Secundários (Sinergistas)
        </text>
      </g>
    </svg>
  );
}

// ============================================================================
// GERADOR CINEMÁTICO 3D/4D DE ARTICULAÇÕES E APARELHOS (32 PADRÕES DISTINTOS)
// ============================================================================
function compute3DBiomechanicalScene(pattern, phase, exerciseName = '') {
  const n = (exerciseName || '').toLowerCase();
  const isDumbbell = n.includes('halter') || n.includes('alternada') || n.includes('martelo') || n.includes('arnold') || n.includes('unilateral') || n.includes('serrote') || n.includes('concentrada');
  const isKettlebell = n.includes('kettlebell') || n.includes('goblet');

  const lerp = (a, b, t) => a + (b - a) * t;
  const p = phase; // 0 = alongado (início), 1 = pico de contração

  // Estrutura padrão em pé (unidades em metros aproximados: Y = altura, X = lateral, Z = frente/trás)
  const J = {
    head: [0, 1.56, 0],
    neck: [0, 1.40, 0],
    chest: [0, 1.22, 0.04],
    back: [0, 1.22, -0.06],
    waist: [0, 1.00, 0],
    pelvis: [0, 0.86, 0],
    shoulderL: [-0.21, 1.36, 0],
    shoulderR: [0.21, 1.36, 0],
    elbowL: [-0.25, 1.06, 0.04],
    elbowR: [0.25, 1.06, 0.04],
    wristL: [-0.24, 0.82, 0.14],
    wristR: [0.24, 0.82, 0.14],
    hipL: [-0.12, 0.86, 0],
    hipR: [0.12, 0.86, 0],
    kneeL: [-0.13, 0.46, 0.03],
    kneeR: [0.13, 0.46, 0.03],
    ankleL: [-0.13, 0.06, 0],
    ankleR: [0.13, 0.06, 0],
    footL: [-0.13, 0.03, 0.12],
    footR: [0.13, 0.03, 0.12]
  };

  const equipment = []; // { type: 'box'|'cylinder'|'plate'|'cable'|'sphere', ... }
  let forceVector = null; // { from: [x,y,z], to: [x,y,z] }

  // Helper para criar banco 3D
  const addBench = (yTop = 0.44, zStart = -0.45, zEnd = 0.35, inclineDeg = 0) => {
    equipment.push({
      type: 'bench',
      p1: [0, yTop, zStart],
      p2: [0, yTop + Math.sin((inclineDeg * Math.PI) / 180) * 0.55, zEnd],
      width: 0.28
    });
    equipment.push({ type: 'post', p1: [0, 0, zStart + 0.08], p2: [0, yTop, zStart + 0.08], r: 0.03 });
    equipment.push({ type: 'post', p1: [0, 0, zEnd - 0.08], p2: [0, yTop, zEnd - 0.08], r: 0.03 });
  };

  // Helper para criar Barra Olímpica 3D ou Par de Halteres 3D nas mãos
  const addHandWeights = (wL, wR, mode = isDumbbell ? 'dumbbell' : isKettlebell ? 'kettlebell' : 'barbell') => {
    if (mode === 'barbell') {
      const dir = [wR[0] - wL[0], wR[1] - wL[1], wR[2] - wL[2]];
      const len = Math.hypot(dir[0], dir[1], dir[2]) || 1;
      const ux = dir[0] / len;
      const uy = dir[1] / len;
      const uz = dir[2] / len;
      const ext = 0.26;
      const endL = [wL[0] - ux * ext, wL[1] - uy * ext, wL[2] - uz * ext];
      const endR = [wR[0] + ux * ext, wR[1] + uy * ext, wR[2] + uz * ext];
      equipment.push({ type: 'bar', p1: endL, p2: endR, r: 0.016, color: '#e4e4e7' });
      equipment.push({ type: 'plate', center: [wL[0] - ux * 0.14, wL[1] - uy * 0.14, wL[2] - uz * 0.14], r: 0.13 });
      equipment.push({ type: 'plate', center: [wL[0] - ux * 0.18, wL[1] - uy * 0.18, wL[2] - uz * 0.18], r: 0.10 });
      equipment.push({ type: 'plate', center: [wR[0] + ux * 0.14, wR[1] + uy * 0.14, wR[2] + uz * 0.14], r: 0.13 });
      equipment.push({ type: 'plate', center: [wR[0] + ux * 0.18, wR[1] + uy * 0.18, wR[2] + uz * 0.18], r: 0.10 });
    } else if (mode === 'kettlebell') {
      const mid = [(wL[0] + wR[0]) / 2, (wL[1] + wR[1]) / 2 - 0.08, (wL[2] + wR[2]) / 2];
      equipment.push({ type: 'kettlebell', center: mid, r: 0.09 });
    } else {
      equipment.push({ type: 'dumbbell', center: wL, r: 0.065 });
      equipment.push({ type: 'dumbbell', center: wR, r: 0.065 });
    }
  };

  // =========================================================================
  // 1. SUPINO RETO / DECLINADO (DEITADO NO BANCO)
  // =========================================================================
  if (pattern === 'bench_press' || pattern === 'decline_press') {
    const isDecline = pattern === 'decline_press';
    addBench(0.45, -0.50, 0.32, isDecline ? -14 : 0);
    // Racks laterais
    equipment.push({ type: 'post', p1: [-0.34, 0, -0.36], p2: [-0.34, 0.95, -0.36], r: 0.025 });
    equipment.push({ type: 'post', p1: [0.34, 0, -0.36], p2: [0.34, 0.95, -0.36], r: 0.025 });

    const headY = isDecline ? 0.44 : 0.54;
    const pelvisY = isDecline ? 0.56 : 0.52;
    J.head = [0, headY + 0.05, -0.42];
    J.neck = [0, headY, -0.30];
    J.chest = [0, lerp(headY, pelvisY, 0.35) + 0.06, -0.14];
    J.back = [0, lerp(headY, pelvisY, 0.35) - 0.03, -0.14];
    J.waist = [0, lerp(headY, pelvisY, 0.7), 0.05];
    J.pelvis = [0, pelvisY, 0.22];

    J.shoulderL = [-0.21, headY + 0.02, -0.22];
    J.shoulderR = [0.21, headY + 0.02, -0.22];

    const pressH = lerp(headY + 0.14, headY + 0.48, p);
    const elbowY = lerp(headY - 0.08, headY + 0.24, p);
    const elbowOut = n.includes('fechado') ? 0.23 : 0.33;
    const handSpan = isDumbbell ? lerp(0.28, 0.15, p) : n.includes('fechado') ? 0.19 : 0.30;

    J.elbowL = [-elbowOut, elbowY, -0.12];
    J.elbowR = [elbowOut, elbowY, -0.12];
    J.wristL = [-handSpan, pressH, -0.14];
    J.wristR = [handSpan, pressH, -0.14];

    J.hipL = [-0.13, pelvisY, 0.22];
    J.hipR = [0.13, pelvisY, 0.22];
    J.kneeL = [-0.18, 0.48, 0.52];
    J.kneeR = [0.18, 0.48, 0.52];
    J.ankleL = [-0.18, 0.05, 0.48];
    J.ankleR = [0.18, 0.05, 0.48];
    J.footL = [-0.18, 0.02, 0.58];
    J.footR = [0.18, 0.02, 0.58];

    addHandWeights(J.wristL, J.wristR);
    forceVector = { from: [0, J.chest[1], -0.14], to: [0, pressH + 0.14, -0.14] };
  }

  // =========================================================================
  // 2. SUPINO INCLINADO (BANCO A 35°)
  // =========================================================================
  else if (pattern === 'incline_press') {
    equipment.push({ type: 'bench', p1: [0, 0.42, 0.12], p2: [0, 0.88, -0.32], width: 0.28 });
    equipment.push({ type: 'bench', p1: [0, 0.42, 0.12], p2: [0, 0.45, 0.36], width: 0.28 });
    equipment.push({ type: 'post', p1: [0, 0, -0.18], p2: [0, 0.65, -0.18], r: 0.03 });
    equipment.push({ type: 'post', p1: [0, 0, 0.24], p2: [0, 0.42, 0.24], r: 0.03 });

    J.head = [0, 0.96, -0.30];
    J.neck = [0, 0.84, -0.20];
    J.chest = [0, 0.74, -0.06];
    J.back = [0, 0.68, -0.14];
    J.waist = [0, 0.58, 0.02];
    J.pelvis = [0, 0.48, 0.14];

    J.shoulderL = [-0.21, 0.80, -0.15];
    J.shoulderR = [0.21, 0.80, -0.15];

    const pressY = lerp(0.88, 1.24, p);
    const elbowY = lerp(0.62, 0.98, p);
    const span = isDumbbell ? lerp(0.28, 0.16, p) : 0.29;

    J.elbowL = [-0.32, elbowY, -0.04];
    J.elbowR = [0.32, elbowY, -0.04];
    J.wristL = [-span, pressY, -0.06];
    J.wristR = [span, pressY, -0.06];

    J.hipL = [-0.13, 0.48, 0.14];
    J.hipR = [0.13, 0.48, 0.14];
    J.kneeL = [-0.18, 0.45, 0.46];
    J.kneeR = [0.18, 0.45, 0.46];
    J.ankleL = [-0.18, 0.05, 0.46];
    J.ankleR = [0.18, 0.05, 0.46];
    J.footL = [-0.18, 0.02, 0.56];
    J.footR = [0.18, 0.02, 0.56];

    addHandWeights(J.wristL, J.wristR);
    forceVector = { from: [0, 0.78, -0.08], to: [0, pressY + 0.12, -0.06] };
  }

  // =========================================================================
  // 3. FLEXÃO DE BRAÇOS NO SOLO (PUSH-UP)
  // =========================================================================
  else if (pattern === 'push_up') {
    const isDecline = n.includes('declinada');
    const isIncline = n.includes('inclinada');
    const isDiamond = n.includes('diamante');

    if (isDecline) {
      equipment.push({ type: 'box', center: [0, 0.18, -0.58], size: [0.42, 0.36, 0.32] });
    } else if (isIncline) {
      equipment.push({ type: 'box', center: [0, 0.18, 0.45], size: [0.52, 0.36, 0.32] });
    }

    const footY = isDecline ? 0.38 : 0.06;
    const handY = isIncline ? 0.36 : 0.03;
    const chestH = lerp(handY + 0.14, handY + 0.46, p);
    const hipH = lerp((footY + handY) * 0.5 + 0.09, (footY + handY) * 0.5 + 0.27, p);

    J.head = [0, chestH + 0.08, 0.58];
    J.neck = [0, chestH + 0.04, 0.44];
    J.chest = [0, chestH - 0.02, 0.30];
    J.back = [0, chestH + 0.05, 0.30];
    J.waist = [0, lerp(chestH, hipH, 0.55), 0.08];
    J.pelvis = [0, hipH, -0.10];

    J.shoulderL = [-0.20, chestH + 0.02, 0.38];
    J.shoulderR = [0.20, chestH + 0.02, 0.38];

    const handX = isDiamond ? 0.07 : n.includes('aberta') ? 0.32 : 0.22;
    const elbowX = isDiamond ? 0.18 : 0.30;
    const elbowH = lerp(handY + 0.22, handY + 0.26, p);

    J.elbowL = [-elbowX, elbowH, 0.30];
    J.elbowR = [elbowX, elbowH, 0.30];
    J.wristL = [-handX, handY, 0.42];
    J.wristR = [handX, handY, 0.42];

    J.hipL = [-0.11, hipH, -0.10];
    J.hipR = [0.11, hipH, -0.10];
    J.kneeL = [-0.11, lerp(hipH, footY, 0.5), -0.34];
    J.kneeR = [0.11, lerp(hipH, footY, 0.5), -0.34];
    J.ankleL = [-0.11, footY + 0.04, -0.56];
    J.ankleR = [0.11, footY + 0.04, -0.56];
    J.footL = [-0.11, footY, -0.58];
    J.footR = [0.11, footY, -0.58];

    forceVector = { from: [0, handY, 0.40], to: [0, chestH + 0.18, 0.40] };
  }

  // =========================================================================
  // 4. CRUCIFIXO / PECK DECK / CROSSOVER NAS POLIAS
  // =========================================================================
  else if (pattern === 'chest_fly') {
    const isCrossover = n.includes('crossover') || n.includes('peck deck') || n.includes('voador') || n.includes('parede');
    if (isCrossover) {
      // Torres de Cross Over 3D
      equipment.push({ type: 'post', p1: [-0.62, 0, -0.15], p2: [-0.62, 1.78, -0.15], r: 0.03 });
      equipment.push({ type: 'post', p1: [0.62, 0, -0.15], p2: [0.62, 1.78, -0.15], r: 0.03 });
      equipment.push({ type: 'bar', p1: [-0.62, 1.76, -0.15], p2: [0.62, 1.76, -0.15], r: 0.025, color: '#52525b' });

      const pulleyY = n.includes('baixa') ? 0.20 : n.includes('média') ? 1.25 : 1.68;
      const spreadX = lerp(0.50, 0.08, p);
      const handZ = lerp(-0.02, 0.36, p);
      const handY = n.includes('baixa') ? lerp(0.75, 1.32, p) : n.includes('alta') ? lerp(1.36, 0.92, p) : 1.18;

      J.elbowL = [-lerp(0.38, 0.18, p), lerp(1.26, 1.12, p), lerp(0.02, 0.22, p)];
      J.elbowR = [lerp(0.38, 0.18, p), lerp(1.26, 1.12, p), lerp(0.02, 0.22, p)];
      J.wristL = [-spreadX, handY, handZ];
      J.wristR = [spreadX, handY, handZ];

      equipment.push({ type: 'cable', p1: [-0.60, pulleyY, -0.15], p2: J.wristL });
      equipment.push({ type: 'cable', p1: [0.60, pulleyY, -0.15], p2: J.wristR });
      equipment.push({ type: 'sphere', center: J.wristL, r: 0.04, color: '#10b981' });
      equipment.push({ type: 'sphere', center: J.wristR, r: 0.04, color: '#10b981' });
    } else {
      // Crucifixo com halteres no banco
      addBench(0.45, -0.48, 0.32, n.includes('inclinado') ? 28 : 0);
      J.head = [0, 0.58, -0.40];
      J.neck = [0, 0.54, -0.28];
      J.chest = [0, 0.56, -0.12];
      J.back = [0, 0.48, -0.12];
      J.waist = [0, 0.52, 0.05];
      J.pelvis = [0, 0.50, 0.22];
      J.shoulderL = [-0.21, 0.55, -0.20];
      J.shoulderR = [0.21, 0.55, -0.20];

      const angle = lerp(0.15, 1.35, p);
      const rArm = 0.42;
      const wx = Math.cos(angle) * rArm + 0.08;
      const wy = 0.54 + Math.sin(angle) * rArm;

      J.elbowL = [-wx * 0.72, wy - 0.12, -0.16];
      J.elbowR = [wx * 0.72, wy - 0.12, -0.16];
      J.wristL = [-wx, wy, -0.16];
      J.wristR = [wx, wy, -0.16];

      J.hipL = [-0.13, 0.50, 0.22];
      J.hipR = [0.13, 0.50, 0.22];
      J.kneeL = [-0.18, 0.48, 0.50];
      J.kneeR = [0.18, 0.48, 0.50];
      J.ankleL = [-0.18, 0.05, 0.48];
      J.ankleR = [0.18, 0.05, 0.48];
      J.footL = [-0.18, 0.02, 0.58];
      J.footR = [0.18, 0.02, 0.58];

      addHandWeights(J.wristL, J.wristR, 'dumbbell');
    }
  }

  // =========================================================================
  // 4B. CHEST PRESS SENTADO / SUPINO ARTICULADO E PECK DECK (VOADOR)
  // =========================================================================
  else if (pattern === 'seated_chest_press' || pattern === 'peck_deck') {
    equipment.push({ type: 'bench', p1: [0, 0.46, -0.15], p2: [0, 0.46, 0.20], width: 0.34 });
    equipment.push({ type: 'bench', p1: [0, 0.46, -0.15], p2: [0, 1.28, -0.22], width: 0.34 });
    equipment.push({ type: 'post', p1: [0, 0, -0.18], p2: [0, 1.65, -0.18], r: 0.035 });

    J.head = [0, 1.34, -0.12];
    J.neck = [0, 1.20, -0.10];
    J.chest = [0, 1.04, -0.02];
    J.back = [0, 1.04, -0.12];
    J.waist = [0, 0.80, -0.06];
    J.pelvis = [0, 0.52, -0.04];
    J.shoulderL = [-0.21, 1.14, -0.06];
    J.shoulderR = [0.21, 1.14, -0.06];

    J.hipL = [-0.13, 0.52, -0.04];
    J.hipR = [0.13, 0.52, -0.04];
    J.kneeL = [-0.15, 0.50, 0.32];
    J.kneeR = [0.15, 0.50, 0.32];
    J.ankleL = [-0.15, 0.06, 0.34];
    J.ankleR = [0.15, 0.06, 0.34];
    J.footL = [-0.15, 0.02, 0.46];
    J.footR = [0.15, 0.02, 0.46];

    if (pattern === 'seated_chest_press') {
      const pushZ = lerp(0.04, 0.44, p);
      const handX = lerp(0.28, 0.18, p);
      J.elbowL = [-0.32, 0.98, lerp(-0.14, 0.18, p)];
      J.elbowR = [0.32, 0.98, lerp(-0.14, 0.18, p)];
      J.wristL = [-handX, 1.04, pushZ];
      J.wristR = [handX, 1.04, pushZ];
      equipment.push({ type: 'bar', p1: [-0.32, 1.55, -0.10], p2: J.wristL, r: 0.015, color: '#52525b' });
      equipment.push({ type: 'bar', p1: [0.32, 1.55, -0.10], p2: J.wristR, r: 0.015, color: '#52525b' });
      forceVector = { from: [0, 1.04, 0.02], to: [0, 1.04, pushZ + 0.15] };
    } else {
      // Peck Deck / Voador com braços em 90° fechando à frente
      const flyAngle = lerp(0.15, 1.42, p);
      const radius = 0.28;
      const ex = Math.cos(flyAngle) * radius + 0.05;
      const ez = -0.04 + Math.sin(flyAngle) * radius;
      J.elbowL = [-ex, 1.04, ez];
      J.elbowR = [ex, 1.04, ez];
      J.wristL = [-ex * 0.85, 1.26, ez + 0.04];
      J.wristR = [ex * 0.85, 1.26, ez + 0.04];
      equipment.push({ type: 'bar', p1: [-ex * 0.85, 1.58, ez], p2: J.elbowL, r: 0.018, color: '#10b981' });
      equipment.push({ type: 'bar', p1: [ex * 0.85, 1.58, ez], p2: J.elbowR, r: 0.018, color: '#10b981' });
    }
  }

  // =========================================================================
  // 4C. PULLOVER COM HALTER DEITADO NO BANCO
  // =========================================================================
  else if (pattern === 'dumbbell_pullover') {
    addBench(0.45, -0.45, 0.32, 0);
    J.head = [0, 0.56, -0.38];
    J.neck = [0, 0.52, -0.26];
    J.chest = [0, 0.56, -0.10];
    J.back = [0, 0.48, -0.10];
    J.waist = [0, 0.52, 0.06];
    J.pelvis = [0, 0.50, 0.22];
    J.shoulderL = [-0.20, 0.54, -0.20];
    J.shoulderR = [0.20, 0.54, -0.20];

    // Arco de trás da cabeça (p=0) até acima do peito (p=1)
    const arc = lerp(-0.35, 1.50, p);
    const armLen = 0.44;
    const wy = 0.54 + Math.sin(arc) * armLen;
    const wz = -0.20 - Math.cos(arc) * armLen;

    J.elbowL = [-0.16, lerp(0.54, wy, 0.55), lerp(-0.20, wz, 0.55)];
    J.elbowR = [0.16, lerp(0.54, wy, 0.55), lerp(-0.20, wz, 0.55)];
    J.wristL = [-0.05, wy, wz];
    J.wristR = [0.05, wy, wz];

    J.hipL = [-0.13, 0.50, 0.22];
    J.hipR = [0.13, 0.50, 0.22];
    J.kneeL = [-0.18, 0.48, 0.50];
    J.kneeR = [0.18, 0.48, 0.50];
    J.ankleL = [-0.18, 0.05, 0.48];
    J.ankleR = [0.18, 0.05, 0.48];
    J.footL = [-0.18, 0.02, 0.58];
    J.footR = [0.18, 0.02, 0.58];

    equipment.push({ type: 'dumbbell', center: [0, wy, wz], r: 0.08 });
    forceVector = { from: [0, wy, wz], to: [0, 0.95, -0.12] };
  }

  // =========================================================================
  // 5. PULLDOWN COM BRAÇOS ESTENDIDOS / PULLOVER NA POLIA
  // =========================================================================
  else if (pattern === 'pullover_pulldown') {
    equipment.push({ type: 'post', p1: [0, 0, 0.55], p2: [0, 1.85, 0.55], r: 0.035 });
    equipment.push({ type: 'bar', p1: [0, 1.82, 0.55], p2: [0, 1.82, 0.30], r: 0.025, color: '#52525b' });

    // Tronco levemente inclinado à frente
    J.head = [0, 1.48, 0.12];
    J.neck = [0, 1.34, 0.06];
    J.chest = [0, 1.18, 0.05];
    J.back = [0, 1.20, -0.05];
    J.waist = [0, 0.98, -0.04];
    J.pelvis = [0, 0.84, -0.08];
    J.shoulderL = [-0.20, 1.30, 0.04];
    J.shoulderR = [0.20, 1.30, 0.04];

    const arcAngle = lerp(0.55, -1.15, p); // de frente alta até as coxas
    const armLen = 0.48;
    const wy = 1.30 + Math.sin(arcAngle) * armLen;
    const wz = 0.04 + Math.cos(arcAngle) * armLen;

    J.elbowL = [-0.20, lerp(1.30, wy, 0.52), lerp(0.04, wz, 0.52)];
    J.elbowR = [0.20, lerp(1.30, wy, 0.52), lerp(0.04, wz, 0.52)];
    J.wristL = [-0.18, wy, wz];
    J.wristR = [0.18, wy, wz];

    equipment.push({ type: 'cable', p1: [0, 1.82, 0.32], p2: [0, wy, wz] });
    equipment.push({ type: 'bar', p1: [-0.24, wy, wz], p2: [0.24, wy, wz], r: 0.016, color: '#10b981' });
    forceVector = { from: [0, wy, wz], to: [0, 0.85, 0.02] };
  }

  // =========================================================================
  // 6. BARRA FIXA / CHIN-UP / MUSCLE-UP (SUSPENSO NA BARRA)
  // =========================================================================
  else if (pattern === 'pull_up') {
    const barY = 1.88;
    equipment.push({ type: 'post', p1: [-0.52, 0, 0], p2: [-0.52, barY + 0.05, 0], r: 0.03 });
    equipment.push({ type: 'post', p1: [0.52, 0, 0], p2: [0.52, barY + 0.05, 0], r: 0.03 });
    equipment.push({ type: 'bar', p1: [-0.55, barY, 0], p2: [0.55, barY, 0], r: 0.02, color: '#e4e4e7' });

    const isDeadHang = n.includes('dead hang') || n.includes('suspensão');
    const lift = isDeadHang ? 0.05 : lerp(0, 0.42, p);
    const baseHeadY = 1.48 + lift;

    J.head = [0, baseHeadY, 0.04];
    J.neck = [0, baseHeadY - 0.14, 0.02];
    J.chest = [0, baseHeadY - 0.30, 0.05];
    J.back = [0, baseHeadY - 0.30, -0.06];
    J.waist = [0, baseHeadY - 0.52, 0];
    J.pelvis = [0, baseHeadY - 0.66, 0];

    const gripX = n.includes('supinada') || n.includes('chin-up') || n.includes('neutra') ? 0.20 : 0.34;
    J.wristL = [-gripX, barY, 0];
    J.wristR = [gripX, barY, 0];
    J.shoulderL = [-0.21, baseHeadY - 0.18, 0];
    J.shoulderR = [0.21, baseHeadY - 0.18, 0];

    const elbowY = lerp(barY - 0.24, baseHeadY - 0.32, p);
    const elbowX = gripX + lerp(0.02, 0.10, p);
    J.elbowL = [-elbowX, elbowY, 0.04];
    J.elbowR = [elbowX, elbowY, 0.04];

    J.hipL = [-0.11, baseHeadY - 0.66, 0];
    J.hipR = [0.11, baseHeadY - 0.66, 0];
    J.kneeL = [-0.11, baseHeadY - 1.04, 0.04];
    J.kneeR = [0.11, baseHeadY - 1.04, 0.04];
    J.ankleL = [-0.11, baseHeadY - 1.34, -0.08];
    J.ankleR = [0.11, baseHeadY - 1.34, -0.08];
    J.footL = [-0.11, baseHeadY - 1.38, -0.02];
    J.footR = [0.11, baseHeadY - 1.38, -0.02];

    forceVector = { from: [0, J.pelvis[1], 0], to: [0, barY, 0] };
  }

  // =========================================================================
  // 7. PUXADA NO PULLEY ALTO (SENTADO NA MÁQUINA)
  // =========================================================================
  else if (pattern === 'lat_pulldown') {
    equipment.push({ type: 'post', p1: [0, 0, 0.48], p2: [0, 1.88, 0.48], r: 0.035 });
    equipment.push({ type: 'bar', p1: [0, 1.86, 0.48], p2: [0, 1.86, 0.08], r: 0.025, color: '#52525b' });
    addBench(0.45, -0.15, 0.20, 0);

    J.head = [0, 1.32, -0.06];
    J.neck = [0, 1.18, -0.04];
    J.chest = [0, 1.02, 0.03];
    J.back = [0, 1.02, -0.08];
    J.waist = [0, 0.78, -0.02];
    J.pelvis = [0, 0.52, 0];

    J.shoulderL = [-0.21, 1.14, -0.02];
    J.shoulderR = [0.21, 1.14, -0.02];

    const barH = lerp(1.62, 1.12, p);
    const gripW = n.includes('aberta') ? 0.38 : 0.20;
    J.wristL = [-gripW, barH, 0.08];
    J.wristR = [gripW, barH, 0.08];
    J.elbowL = [-(gripW + 0.05), lerp(1.38, 0.90, p), 0.04];
    J.elbowR = [gripW + 0.05, lerp(1.38, 0.90, p), 0.04];

    J.hipL = [-0.12, 0.52, 0];
    J.hipR = [0.12, 0.52, 0];
    J.kneeL = [-0.14, 0.50, 0.34];
    J.kneeR = [0.14, 0.50, 0.34];
    J.ankleL = [-0.14, 0.06, 0.34];
    J.ankleR = [0.14, 0.06, 0.34];
    J.footL = [-0.14, 0.02, 0.46];
    J.footR = [0.14, 0.02, 0.46];

    equipment.push({ type: 'cable', p1: [0, 1.86, 0.08], p2: [0, barH, 0.08] });
    equipment.push({ type: 'bar', p1: [-gripW - 0.06, barH, 0.08], p2: [gripW + 0.06, barH, 0.08], r: 0.016, color: '#10b981' });
    forceVector = { from: [0, barH, 0.08], to: [0, 1.05, 0.04] };
  }

  // =========================================================================
  // 8. REMADA BAIXA SENTADO / MÁQUINA / REMO ERGOMÉTRICO
  // =========================================================================
  else if (pattern === 'seated_row') {
    equipment.push({ type: 'post', p1: [0, 0, 0.65], p2: [0, 1.15, 0.65], r: 0.035 });
    equipment.push({ type: 'bench', p1: [0, 0.38, -0.38], p2: [0, 0.38, 0.25], width: 0.26 });
    equipment.push({ type: 'post', p1: [0, 0, -0.25], p2: [0, 0.38, -0.25], r: 0.03 });
    equipment.push({ type: 'post', p1: [0, 0, 0.15], p2: [0, 0.38, 0.15], r: 0.03 });

    const leanZ = lerp(0.06, -0.10, p);
    J.head = [0, 1.24, leanZ];
    J.neck = [0, 1.10, leanZ];
    J.chest = [0, 0.94, leanZ + 0.05];
    J.back = [0, 0.94, leanZ - 0.06];
    J.waist = [0, 0.68, -0.06];
    J.pelvis = [0, 0.44, -0.12];

    J.shoulderL = [-0.21, 1.06, leanZ];
    J.shoulderR = [0.21, 1.06, leanZ];

    const pullZ = lerp(0.38, -0.02, p);
    const gripX = n.includes('aberta') ? 0.28 : 0.10;
    J.wristL = [-gripX, 0.78, pullZ];
    J.wristR = [gripX, 0.78, pullZ];
    J.elbowL = [-0.25, 0.80, lerp(0.18, -0.24, p)];
    J.elbowR = [0.25, 0.80, lerp(0.18, -0.24, p)];

    J.hipL = [-0.12, 0.44, -0.12];
    J.hipR = [0.12, 0.44, -0.12];
    J.kneeL = [-0.13, 0.48, 0.24];
    J.kneeR = [0.13, 0.48, 0.24];
    J.ankleL = [-0.13, 0.38, 0.56];
    J.ankleR = [0.13, 0.38, 0.56];
    J.footL = [-0.13, 0.48, 0.60];
    J.footR = [0.13, 0.48, 0.60];

    equipment.push({ type: 'cable', p1: [0, 0.78, 0.64], p2: [0, 0.78, pullZ] });
    equipment.push({ type: 'bar', p1: [-gripX - 0.04, 0.78, pullZ], p2: [gripX + 0.04, 0.78, pullZ], r: 0.018, color: '#10b981' });
    forceVector = { from: [0, 0.78, pullZ], to: [0, 0.78, -0.15] };
  }

  // =========================================================================
  // 9. REMADA CURVADA COM BARRA / HALTERES / SERROTE / CAVALINHO
  // =========================================================================
  else if (pattern === 'barbell_row') {
    J.head = [0, 1.24, 0.38];
    J.neck = [0, 1.16, 0.26];
    J.chest = [0, 1.04, 0.14];
    J.back = [0, 1.12, 0.08];
    J.waist = [0, 0.96, -0.04];
    J.pelvis = [0, 0.86, -0.18];

    J.shoulderL = [-0.21, 1.12, 0.20];
    J.shoulderR = [0.21, 1.12, 0.20];

    const barY = lerp(0.54, 0.88, p);
    const barZ = lerp(0.24, 0.04, p);
    J.wristL = [-0.23, barY, barZ];
    J.wristR = [0.23, barY, barZ];
    J.elbowL = [-0.28, lerp(0.82, 1.16, p), lerp(0.22, -0.06, p)];
    J.elbowR = [0.28, lerp(0.82, 1.16, p), lerp(0.22, -0.06, p)];

    J.hipL = [-0.13, 0.86, -0.18];
    J.hipR = [0.13, 0.86, -0.18];
    J.kneeL = [-0.14, 0.46, -0.04];
    J.kneeR = [0.14, 0.46, -0.04];
    J.ankleL = [-0.14, 0.06, -0.08];
    J.ankleR = [0.14, 0.06, -0.08];
    J.footL = [-0.14, 0.02, 0.05];
    J.footR = [0.14, 0.02, 0.05];

    addHandWeights(J.wristL, J.wristR);
    forceVector = { from: [0, barY, barZ], to: [0, 0.96, -0.02] };
  }

  // =========================================================================
  // 9B. REMADA UNILATERAL / SERROTE (APOIADO NO BANCO) E AUSTRALIAN PULL-UP
  // =========================================================================
  else if (pattern === 'one_arm_row') {
    addBench(0.44, -0.35, 0.42, 0);
    J.head = [0, 1.02, 0.42];
    J.neck = [0, 0.96, 0.28];
    J.chest = [0, 0.88, 0.12];
    J.back = [0, 0.95, 0.10];
    J.waist = [0, 0.84, -0.06];
    J.pelvis = [0, 0.80, -0.22];

    J.shoulderL = [-0.20, 0.92, 0.20];
    J.shoulderR = [0.20, 0.92, 0.20];
    // Braço esquerdo apoiado no banco
    J.elbowL = [-0.16, 0.68, 0.26];
    J.wristL = [-0.12, 0.46, 0.30];
    // Perna esquerda com joelho apoiado no banco
    J.hipL = [-0.12, 0.80, -0.20];
    J.kneeL = [-0.12, 0.48, -0.16];
    J.ankleL = [-0.12, 0.48, -0.42];
    J.footL = [-0.12, 0.42, -0.46];
    // Perna direita firme no chão
    J.hipR = [0.14, 0.80, -0.22];
    J.kneeR = [0.18, 0.44, -0.26];
    J.ankleR = [0.20, 0.06, -0.32];
    J.footR = [0.20, 0.02, -0.20];

    // Braço direito puxando o halter em direção ao quadril
    const pullY = lerp(0.36, 0.78, p);
    const pullZ = lerp(0.22, -0.04, p);
    J.elbowR = [0.26, lerp(0.64, 1.04, p), lerp(0.18, -0.12, p)];
    J.wristR = [0.24, pullY, pullZ];
    equipment.push({ type: 'dumbbell', center: J.wristR, r: 0.075 });
    forceVector = { from: J.wristR, to: [0.24, 0.86, -0.06] };
  }
  else if (pattern === 'inverted_row') {
    // Barra baixa para Australian Pull-up
    const barH = 0.92;
    equipment.push({ type: 'post', p1: [-0.48, 0, 0.10], p2: [-0.48, barH + 0.06, 0.10], r: 0.03 });
    equipment.push({ type: 'post', p1: [0.48, 0, 0.10], p2: [0.48, barH + 0.06, 0.10], r: 0.03 });
    equipment.push({ type: 'bar', p1: [-0.50, barH, 0.10], p2: [0.50, barH, 0.10], r: 0.02, color: '#e4e4e7' });

    const chestH = lerp(0.46, 0.82, p);
    const pelvisH = lerp(0.28, 0.52, p);
    J.head = [0, chestH + 0.10, -0.02];
    J.neck = [0, chestH + 0.04, 0.06];
    J.chest = [0, chestH, 0.12];
    J.back = [0, chestH - 0.06, 0.08];
    J.waist = [0, lerp(chestH, pelvisH, 0.55), 0.24];
    J.pelvis = [0, pelvisH, 0.36];

    J.shoulderL = [-0.21, chestH, 0.10];
    J.shoulderR = [0.21, chestH, 0.10];
    J.wristL = [-0.24, barH, 0.10];
    J.wristR = [0.24, barH, 0.10];
    J.elbowL = [-0.30, lerp(0.68, 0.72, p), lerp(0.10, -0.06, p)];
    J.elbowR = [0.30, lerp(0.68, 0.72, p), lerp(0.10, -0.06, p)];

    J.hipL = [-0.11, pelvisH, 0.36];
    J.hipR = [0.11, pelvisH, 0.36];
    J.kneeL = [-0.11, lerp(pelvisH, 0.06, 0.5), 0.54];
    J.kneeR = [0.11, lerp(pelvisH, 0.06, 0.5), 0.54];
    J.ankleL = [-0.11, 0.06, 0.72];
    J.ankleR = [0.11, 0.06, 0.72];
    J.footL = [-0.11, 0.12, 0.78];
    J.footR = [0.11, 0.12, 0.78];
  }

  // =========================================================================
  // 10. DESENVOLVIMENTO DE OMBROS (MILITAR / HALTERES / ARNOLD)
  // =========================================================================
  else if (pattern === 'shoulder_press') {
    const pressY = lerp(1.38, 1.84, p);
    const elbowY = lerp(1.12, 1.58, p);
    const elbowX = lerp(0.34, 0.25, p);
    const wristX = isDumbbell ? lerp(0.30, 0.18, p) : 0.28;

    J.elbowL = [-elbowX, elbowY, 0.06];
    J.elbowR = [elbowX, elbowY, 0.06];
    J.wristL = [-wristX, pressY, 0.04];
    J.wristR = [wristX, pressY, 0.04];

    addHandWeights(J.wristL, J.wristR);
    forceVector = { from: [0, 1.38, 0.04], to: [0, pressY + 0.12, 0.04] };
  }

  // =========================================================================
  // 11. ELEVAÇÃO LATERAL (HALTERES / POLIA / MÁQUINA)
  // =========================================================================
  else if (pattern === 'lateral_raise') {
    const angle = lerp(0.12, 1.48, p); // de braço ao lado até horizontal (90°)
    const upperLen = 0.28;
    const fullLen = 0.52;

    J.elbowL = [-0.21 - Math.sin(angle) * upperLen, 1.36 - Math.cos(angle) * upperLen, 0.04];
    J.elbowR = [0.21 + Math.sin(angle) * upperLen, 1.36 - Math.cos(angle) * upperLen, 0.04];
    J.wristL = [-0.21 - Math.sin(angle) * fullLen, 1.36 - Math.cos(angle) * fullLen, 0.08];
    J.wristR = [0.21 + Math.sin(angle) * fullLen, 1.36 - Math.cos(angle) * fullLen, 0.08];

    addHandWeights(J.wristL, J.wristR, 'dumbbell');
  }

  // =========================================================================
  // 12. ELEVAÇÃO FRONTAL / Y-RAISE / CORDA NAVAL
  // =========================================================================
  else if (pattern === 'front_raise') {
    const angle = lerp(0.10, 1.52, p);
    const upperLen = 0.27;
    const fullLen = 0.52;

    J.elbowL = [-0.21, 1.36 - Math.cos(angle) * upperLen, Math.sin(angle) * upperLen];
    J.elbowR = [0.21, 1.36 - Math.cos(angle) * upperLen, Math.sin(angle) * upperLen];
    J.wristL = [-0.20, 1.36 - Math.cos(angle) * fullLen, Math.sin(angle) * fullLen];
    J.wristR = [0.20, 1.36 - Math.cos(angle) * fullLen, Math.sin(angle) * fullLen];

    addHandWeights(J.wristL, J.wristR, n.includes('barra') ? 'barbell' : 'dumbbell');
  }

  // =========================================================================
  // 13. DELTOIDE POSTERIOR (FACE PULL / CRUCIFIXO INVERSO)
  // =========================================================================
  else if (pattern === 'rear_delt') {
    equipment.push({ type: 'post', p1: [0, 0, 0.58], p2: [0, 1.68, 0.58], r: 0.035 });
    const pullZ = lerp(0.42, -0.06, p);
    const spreadX = lerp(0.14, 0.36, p);

    J.elbowL = [-lerp(0.22, 0.38, p), 1.36, lerp(0.24, -0.14, p)];
    J.elbowR = [lerp(0.22, 0.38, p), 1.36, lerp(0.24, -0.14, p)];
    J.wristL = [-spreadX, 1.44, pullZ];
    J.wristR = [spreadX, 1.44, pullZ];

    equipment.push({ type: 'cable', p1: [0, 1.46, 0.56], p2: J.wristL });
    equipment.push({ type: 'cable', p1: [0, 1.46, 0.56], p2: J.wristR });
  }
  else if (pattern === 'bent_over_reverse_fly') {
    // Crucifixo inverso com halteres (tronco inclinado à frente)
    J.head = [0, 1.18, 0.40];
    J.neck = [0, 1.12, 0.28];
    J.chest = [0, 1.02, 0.14];
    J.back = [0, 1.10, 0.08];
    J.waist = [0, 0.94, -0.04];
    J.pelvis = [0, 0.86, -0.18];
    J.shoulderL = [-0.20, 1.08, 0.20];
    J.shoulderR = [0.20, 1.08, 0.20];

    const flyAng = lerp(0.12, 1.42, p);
    const armR = 0.44;
    const wx = 0.20 + Math.sin(flyAng) * armR;
    const wy = 1.08 - Math.cos(flyAng) * armR;
    J.elbowL = [-wx * 0.65, wy + 0.06, 0.18];
    J.elbowR = [wx * 0.65, wy + 0.06, 0.18];
    J.wristL = [-wx, wy, 0.16];
    J.wristR = [wx, wy, 0.16];

    J.hipL = [-0.13, 0.86, -0.18];
    J.hipR = [0.13, 0.86, -0.18];
    J.kneeL = [-0.14, 0.46, -0.04];
    J.kneeR = [0.14, 0.46, -0.04];
    addHandWeights(J.wristL, J.wristR, 'dumbbell');
  }

  // =========================================================================
  // 14. REMADA ALTA (UPRIGHT ROW)
  // =========================================================================
  else if (pattern === 'upright_row') {
    const barY = lerp(0.82, 1.28, p);
    const elbowY = lerp(1.06, 1.44, p);
    const elbowX = lerp(0.24, 0.38, p);

    J.elbowL = [-elbowX, elbowY, 0.06];
    J.elbowR = [elbowX, elbowY, 0.06];
    J.wristL = [-0.15, barY, 0.14];
    J.wristR = [0.15, barY, 0.14];

    addHandWeights(J.wristL, J.wristR, 'barbell');
  }

  // =========================================================================
  // 15. ROTAÇÃO EXTERNA / INTERNA DE MANGUITO ROTADOR
  // =========================================================================
  else if (pattern === 'rotator_cuff') {
    equipment.push({ type: 'post', p1: [-0.58, 0, 0], p2: [-0.58, 1.50, 0], r: 0.03 });
    J.elbowR = [0.23, 1.06, 0.02];
    const rotAngle = lerp(-0.5, 1.0, p);
    J.wristR = [0.23 + Math.sin(rotAngle) * 0.26, 1.06, Math.cos(rotAngle) * 0.26];
    equipment.push({ type: 'cable', p1: [-0.56, 1.06, 0], p2: J.wristR });
    equipment.push({ type: 'sphere', center: J.wristR, r: 0.04, color: '#10b981' });
  }

  // =========================================================================
  // 16. TRÍCEPS TESTA (DEITADO NO BANCO)
  // =========================================================================
  else if (pattern === 'skull_crusher') {
    addBench(0.45, -0.48, 0.32, 0);
    J.head = [0, 0.56, -0.40];
    J.neck = [0, 0.52, -0.28];
    J.chest = [0, 0.55, -0.12];
    J.back = [0, 0.48, -0.12];
    J.waist = [0, 0.52, 0.05];
    J.pelvis = [0, 0.50, 0.22];
    J.shoulderL = [-0.20, 0.54, -0.20];
    J.shoulderR = [0.20, 0.54, -0.20];

    // Úmero fixo apontando para o teto
    J.elbowL = [-0.18, 0.84, -0.24];
    J.elbowR = [0.18, 0.84, -0.24];

    // Antebraço dobra até a testa (p=0) e estende para o alto (p=1)
    const extAngle = lerp(-0.95, 1.45, p);
    const foreLen = 0.26;
    const wy = 0.84 + Math.sin(extAngle) * foreLen;
    const wz = -0.24 + Math.cos(extAngle) * foreLen * -1;

    J.wristL = [-0.16, wy, wz];
    J.wristR = [0.16, wy, wz];

    J.hipL = [-0.13, 0.50, 0.22];
    J.hipR = [0.13, 0.50, 0.22];
    J.kneeL = [-0.18, 0.48, 0.50];
    J.kneeR = [0.18, 0.48, 0.50];
    J.ankleL = [-0.18, 0.05, 0.48];
    J.ankleR = [0.18, 0.05, 0.48];
    J.footL = [-0.18, 0.02, 0.58];
    J.footR = [0.18, 0.02, 0.58];

    addHandWeights(J.wristL, J.wristR, isDumbbell ? 'dumbbell' : 'barbell');
  }

  // =========================================================================
  // 17. TRÍCEPS FRANCÊS (ACIMA DA CABEÇA)
  // =========================================================================
  else if (pattern === 'overhead_tricep') {
    J.elbowL = [-0.18, 1.62, -0.02];
    J.elbowR = [0.18, 1.62, -0.02];

    const extAngle = lerp(-1.1, 1.50, p);
    const foreLen = 0.26;
    const wy = 1.62 + Math.sin(extAngle) * foreLen;
    const wz = -0.02 - Math.cos(extAngle) * foreLen;

    J.wristL = [-0.08, wy, wz];
    J.wristR = [0.08, wy, wz];
    addHandWeights(J.wristL, J.wristR, 'dumbbell');
  }

  // =========================================================================
  // 18. TRÍCEPS COICE (KICKBACK)
  // =========================================================================
  else if (pattern === 'tricep_kickback') {
    J.head = [0, 1.24, 0.36];
    J.neck = [0, 1.16, 0.24];
    J.chest = [0, 1.04, 0.12];
    J.back = [0, 1.12, 0.06];
    J.waist = [0, 0.96, -0.04];
    J.pelvis = [0, 0.86, -0.18];

    J.shoulderL = [-0.20, 1.12, 0.18];
    J.shoulderR = [0.20, 1.12, 0.18];
    // Cotovelo fixo alto ao lado do tronco
    J.elbowL = [-0.22, 1.06, -0.06];
    J.elbowR = [0.22, 1.06, -0.06];

    const kickAngle = lerp(-1.45, -0.05, p);
    const foreLen = 0.26;
    const wy = 1.06 + Math.sin(kickAngle) * foreLen;
    const wz = -0.06 - Math.cos(kickAngle) * foreLen;

    J.wristL = [-0.22, wy, wz];
    J.wristR = [0.22, wy, wz];
    addHandWeights(J.wristL, J.wristR, 'dumbbell');
  }

  // =========================================================================
  // 19. MERGULHO NAS PARALELAS / BANCO (DIPS)
  // =========================================================================
  else if (pattern === 'dips') {
    // Barras Paralelas 3D
    equipment.push({ type: 'bar', p1: [-0.28, 1.02, -0.25], p2: [-0.28, 1.02, 0.25], r: 0.02, color: '#52525b' });
    equipment.push({ type: 'bar', p1: [0.28, 1.02, -0.25], p2: [0.28, 1.02, 0.25], r: 0.02, color: '#52525b' });
    equipment.push({ type: 'post', p1: [-0.28, 0, -0.22], p2: [-0.28, 1.02, -0.22], r: 0.025 });
    equipment.push({ type: 'post', p1: [0.28, 0, -0.22], p2: [0.28, 1.02, -0.22], r: 0.025 });

    const dipDrop = lerp(0, 0.28, 1 - p); // p=1 em cima, p=0 embaixo
    J.head = [0, 1.62 - dipDrop, 0.06];
    J.neck = [0, 1.46 - dipDrop, 0.04];
    J.chest = [0, 1.28 - dipDrop, 0.06];
    J.back = [0, 1.28 - dipDrop, -0.05];
    J.waist = [0, 1.06 - dipDrop, 0];
    J.pelvis = [0, 0.90 - dipDrop, -0.02];

    J.shoulderL = [-0.22, 1.40 - dipDrop, 0.02];
    J.shoulderR = [0.22, 1.40 - dipDrop, 0.02];
    J.wristL = [-0.28, 1.02, 0.02];
    J.wristR = [0.28, 1.02, 0.02];
    J.elbowL = [-0.28, 1.22 - dipDrop * 0.4, -0.16 * (1 - p)];
    J.elbowR = [0.28, 1.22 - dipDrop * 0.4, -0.16 * (1 - p)];

    J.hipL = [-0.11, 0.90 - dipDrop, -0.02];
    J.hipR = [0.11, 0.90 - dipDrop, -0.02];
    J.kneeL = [-0.11, 0.54 - dipDrop, 0.02];
    J.kneeR = [0.11, 0.54 - dipDrop, 0.02];
    J.ankleL = [-0.11, 0.36 - dipDrop * 0.5, -0.22];
    J.ankleR = [0.11, 0.36 - dipDrop * 0.5, -0.22];
    J.footL = [-0.11, 0.30 - dipDrop * 0.5, -0.20];
    J.footR = [0.11, 0.30 - dipDrop * 0.5, -0.20];
  }
  else if (pattern === 'bench_dip') {
    // Mergulho no banco com mãos apoiadas atrás do quadril e calcanhares no solo
    equipment.push({ type: 'box', center: [0, 0.22, -0.32], size: [0.54, 0.44, 0.28] });
    const drop = (1 - p) * 0.24;
    const pelvisY = 0.44 - drop;

    J.wristL = [-0.20, 0.44, -0.22];
    J.wristR = [0.20, 0.44, -0.22];
    J.elbowL = [-0.22, 0.62 - drop * 0.5, -0.22 - (1 - p) * 0.14];
    J.elbowR = [0.22, 0.62 - drop * 0.5, -0.22 - (1 - p) * 0.14];
    J.shoulderL = [-0.20, 0.82 - drop, -0.08];
    J.shoulderR = [0.20, 0.82 - drop, -0.08];

    J.head = [0, 1.02 - drop, -0.04];
    J.neck = [0, 0.88 - drop, -0.06];
    J.chest = [0, 0.72 - drop, 0];
    J.back = [0, 0.72 - drop, -0.10];
    J.waist = [0, 0.56 - drop, -0.02];
    J.pelvis = [0, pelvisY, 0.02];

    J.hipL = [-0.12, pelvisY, 0.02];
    J.hipR = [0.12, pelvisY, 0.02];
    J.kneeL = [-0.12, lerp(pelvisY, 0.08, 0.5) + (1 - p) * 0.06, 0.28];
    J.kneeR = [0.12, lerp(pelvisY, 0.08, 0.5) + (1 - p) * 0.06, 0.28];
    J.ankleL = [-0.12, 0.06, 0.56];
    J.ankleR = [0.12, 0.06, 0.56];
    J.footL = [-0.12, 0.12, 0.62];
    J.footR = [0.12, 0.12, 0.62];
  }

  // =========================================================================
  // 20. TRÍCEPS PULLEY / CORDA NA POLIA ALTA
  // =========================================================================
  else if (pattern === 'tricep_pushdown') {
    equipment.push({ type: 'post', p1: [0, 0, 0.52], p2: [0, 1.85, 0.52], r: 0.035 });
    equipment.push({ type: 'bar', p1: [0, 1.82, 0.52], p2: [0, 1.82, 0.25], r: 0.025, color: '#52525b' });

    J.elbowL = [-0.23, 1.06, 0.06];
    J.elbowR = [0.23, 1.06, 0.06];

    const pushAngle = lerp(0.85, -1.15, p); // de peito até extensão total embaixo
    const foreLen = 0.27;
    const wy = 1.06 + Math.sin(pushAngle) * foreLen;
    const wz = 0.06 + Math.cos(pushAngle) * foreLen;
    const cordSpread = n.includes('corda') ? lerp(0.08, 0.24, p) : 0.16;

    J.wristL = [-cordSpread, wy, wz];
    J.wristR = [cordSpread, wy, wz];

    equipment.push({ type: 'cable', p1: [0, 1.82, 0.25], p2: [0, wy + 0.06, wz] });
    equipment.push({ type: 'cable', p1: [0, wy + 0.06, wz], p2: J.wristL });
    equipment.push({ type: 'cable', p1: [0, wy + 0.06, wz], p2: J.wristR });
    forceVector = { from: [0, 1.15, 0.22], to: [0, 0.75, 0.22] };
  }

  // =========================================================================
  // 21. ROSCA BÍCEPS (DIRETA / ALTERNADA / MARTELO) E POLIA ALTA
  // =========================================================================
  else if (pattern === 'bicep_curl') {
    J.elbowL = [-0.24, 1.05, 0.05];
    J.elbowR = [0.24, 1.05, 0.05];

    const isAlternating = n.includes('alternada') || n.includes('cruzada');
    const pL = isAlternating ? p : p;
    const pR = isAlternating ? 1 - p : p;
    const curlAngleL = lerp(-1.35, 1.05, pL);
    const curlAngleR = lerp(-1.35, 1.05, pR);
    const foreLen = 0.27;

    J.wristL = [
      n.includes('cruzada') ? lerp(-0.22, 0.06, pL) : -0.22,
      1.05 + Math.sin(curlAngleL) * foreLen,
      0.05 + Math.cos(curlAngleL) * foreLen
    ];
    J.wristR = [
      n.includes('cruzada') ? lerp(0.22, -0.06, pR) : 0.22,
      1.05 + Math.sin(curlAngleR) * foreLen,
      0.05 + Math.cos(curlAngleR) * foreLen
    ];

    addHandWeights(J.wristL, J.wristR, isDumbbell ? 'dumbbell' : 'barbell');
    forceVector = { from: [0, 0.82, 0.22], to: [0, 1.32, 0.18] };
  }
  else if (pattern === 'high_cable_curl') {
    // Rosca na polia alta (duplo bíceps no Cross Over)
    equipment.push({ type: 'post', p1: [-0.66, 0, 0], p2: [-0.66, 1.75, 0], r: 0.03 });
    equipment.push({ type: 'post', p1: [0.66, 0, 0], p2: [0.66, 1.75, 0], r: 0.03 });

    J.elbowL = [-0.42, 1.36, 0.02];
    J.elbowR = [0.42, 1.36, 0.02];
    const curlAng = lerp(0.25, 2.25, p);
    const fLen = 0.25;
    J.wristL = [-0.42 + Math.sin(curlAng - 0.6) * fLen, 1.36 + Math.sin(curlAng) * fLen * 0.7, 0.04];
    J.wristR = [0.42 - Math.sin(curlAng - 0.6) * fLen, 1.36 + Math.sin(curlAng) * fLen * 0.7, 0.04];

    equipment.push({ type: 'cable', p1: [-0.64, 1.56, 0], p2: J.wristL });
    equipment.push({ type: 'cable', p1: [0.64, 1.56, 0], p2: J.wristR });
    equipment.push({ type: 'sphere', center: J.wristL, r: 0.035, color: '#10b981' });
    equipment.push({ type: 'sphere', center: J.wristR, r: 0.035, color: '#10b981' });
  }

  // =========================================================================
  // 22. ROSCA SCOTT / CONCENTRADA / SPIDER
  // =========================================================================
  else if (pattern === 'preacher_curl') {
    // Banco Scott 3D com apoio inclinado de braços
    equipment.push({ type: 'bench', p1: [0, 0.85, 0.30], p2: [0, 1.12, 0.12], width: 0.34 });
    equipment.push({ type: 'post', p1: [0, 0, 0.22], p2: [0, 0.98, 0.22], r: 0.035 });

    J.head = [0, 1.44, 0.02];
    J.neck = [0, 1.30, 0];
    J.chest = [0, 1.14, 0.04];
    J.shoulderL = [-0.20, 1.24, 0.02];
    J.shoulderR = [0.20, 1.24, 0.02];

    J.elbowL = [-0.18, 0.96, 0.24];
    J.elbowR = [0.18, 0.96, 0.24];

    const curlAngle = lerp(-0.55, 1.25, p);
    const foreLen = 0.26;
    const wy = 0.96 + Math.sin(curlAngle) * foreLen;
    const wz = 0.24 + Math.cos(curlAngle) * foreLen;

    J.wristL = [-0.18, wy, wz];
    J.wristR = [0.18, wy, wz];

    addHandWeights(J.wristL, J.wristR, isDumbbell ? 'dumbbell' : 'barbell');
  }

  // =========================================================================
  // 23. FLEXÃO / EXTENSÃO DE PUNHO E ANTEBRAÇO
  // =========================================================================
  else if (pattern === 'wrist_curl') {
    addBench(0.45, -0.20, 0.25, 0);
    J.head = [0, 1.22, 0.08];
    J.neck = [0, 1.08, 0.04];
    J.chest = [0, 0.92, 0.06];
    J.back = [0, 0.94, -0.04];
    J.waist = [0, 0.72, -0.02];
    J.pelvis = [0, 0.50, -0.04];
    J.shoulderL = [-0.20, 1.04, 0.04];
    J.shoulderR = [0.20, 1.04, 0.04];

    J.hipL = [-0.13, 0.50, -0.04];
    J.hipR = [0.13, 0.50, -0.04];
    J.kneeL = [-0.15, 0.50, 0.32];
    J.kneeR = [0.15, 0.50, 0.32];
    J.ankleL = [-0.15, 0.06, 0.32];
    J.ankleR = [0.15, 0.06, 0.32];
    J.footL = [-0.15, 0.02, 0.44];
    J.footR = [0.15, 0.02, 0.44];

    // Antebraços apoiados sobre as coxas
    J.elbowL = [-0.16, 0.62, 0.12];
    J.elbowR = [0.16, 0.62, 0.12];
    const wristLift = lerp(-0.06, 0.12, p);
    J.wristL = [-0.15, 0.58 + wristLift, 0.38];
    J.wristR = [0.15, 0.58 + wristLift, 0.38];

    addHandWeights(J.wristL, J.wristR, isDumbbell ? 'dumbbell' : 'barbell');
  }

  // =========================================================================
  // 24. CAMINHADA DO FAZENDEIRO (FARMER'S WALK)
  // =========================================================================
  else if (pattern === 'farmers_walk') {
    const stride = Math.sin(p * Math.PI * 2) * 0.18;
    J.kneeL = [-0.13, 0.48, stride];
    J.ankleL = [-0.13, 0.06, stride * 1.3];
    J.footL = [-0.13, 0.02, stride * 1.3 + 0.12];
    J.kneeR = [0.13, 0.48, -stride];
    J.ankleR = [0.13, 0.06, -stride * 1.3];
    J.footR = [0.13, 0.02, -stride * 1.3 + 0.12];

    J.wristL = [-0.27, 0.78, 0];
    J.wristR = [0.27, 0.78, 0];
    equipment.push({ type: 'kettlebell', center: [-0.28, 0.70, 0], r: 0.08 });
    equipment.push({ type: 'kettlebell', center: [0.28, 0.70, 0], r: 0.08 });
  }

  // =========================================================================
  // 25. AGACHAMENTO (LIVRE / FRONTAL / SUMÔ / GOBLET / HACK)
  // =========================================================================
  else if (pattern === 'squat') {
    // Gaiola de Agachamento 3D
    equipment.push({ type: 'post', p1: [-0.46, 0, -0.25], p2: [-0.46, 1.75, -0.25], r: 0.03 });
    equipment.push({ type: 'post', p1: [0.46, 0, -0.25], p2: [0.46, 1.75, -0.25], r: 0.03 });

    const depth = 1 - p; // p=0 agachado no fundo, p=1 em pé contraído
    const drop = depth * 0.42;
    const isSumo = n.includes('sumô');
    const stanceX = isSumo ? 0.25 : 0.15;

    J.pelvis = [0, 0.86 - drop, -depth * 0.18];
    J.waist = [0, 1.00 - drop * 0.92, -depth * 0.10];
    J.chest = [0, 1.22 - drop * 0.85, depth * 0.04];
    J.back = [0, 1.22 - drop * 0.85, -0.06 - depth * 0.04];
    J.neck = [0, 1.40 - drop * 0.82, depth * 0.08];
    J.head = [0, 1.56 - drop * 0.82, depth * 0.10];

    J.shoulderL = [-0.21, 1.36 - drop * 0.82, depth * 0.06];
    J.shoulderR = [0.21, 1.36 - drop * 0.82, depth * 0.06];

    J.hipL = [-0.13, J.pelvis[1], J.pelvis[2]];
    J.hipR = [0.13, J.pelvis[1], J.pelvis[2]];
    J.kneeL = [-(stanceX + depth * 0.06), 0.46 - drop * 0.18, 0.04 + depth * 0.22];
    J.kneeR = [stanceX + depth * 0.06, 0.46 - drop * 0.18, 0.04 + depth * 0.22];
    J.ankleL = [-stanceX, 0.06, 0];
    J.ankleR = [stanceX, 0.06, 0];
    J.footL = [-stanceX, 0.02, 0.14];
    J.footR = [stanceX, 0.02, 0.14];

    if (n.includes('arranco') || n.includes('overhead')) {
      // Agachamento de arranco (barra sustentada acima da cabeça com braços abertos)
      J.elbowL = [-0.34, J.shoulderL[1] + 0.22, J.shoulderL[2]];
      J.elbowR = [0.34, J.shoulderR[1] + 0.22, J.shoulderR[2]];
      J.wristL = [-0.40, J.shoulderL[1] + 0.44, J.shoulderL[2]];
      J.wristR = [0.40, J.shoulderR[1] + 0.44, J.shoulderR[2]];
      addHandWeights(J.wristL, J.wristR, 'barbell');
    } else if (n.includes('frontal') || n.includes('wall ball')) {
      // Agachamento frontal (barra ou bola na frente dos ombros com cotovelos altos)
      J.elbowL = [-0.22, J.shoulderL[1] + 0.02, J.shoulderL[2] + 0.24];
      J.elbowR = [0.22, J.shoulderR[1] + 0.02, J.shoulderR[2] + 0.24];
      J.wristL = [-0.20, J.shoulderL[1] + 0.04, J.shoulderL[2] + 0.10];
      J.wristR = [0.20, J.shoulderR[1] + 0.04, J.shoulderR[2] + 0.10];
      addHandWeights(J.wristL, J.wristR, n.includes('wall ball') ? 'kettlebell' : 'barbell');
    } else if (isKettlebell || isSumo) {
      J.elbowL = [-0.18, J.chest[1] - 0.12, J.chest[2] + 0.14];
      J.elbowR = [0.18, J.chest[1] - 0.12, J.chest[2] + 0.14];
      J.wristL = [-0.06, J.chest[1] - 0.04, J.chest[2] + 0.18];
      J.wristR = [0.06, J.chest[1] - 0.04, J.chest[2] + 0.18];
      addHandWeights(J.wristL, J.wristR, 'kettlebell');
    } else if (n.includes('peso corporal') || n.includes('sustentado') || n.includes('sissy') || n.includes('salto')) {
      // Agachamento livre sem barra (braços à frente para equilíbrio)
      J.elbowL = [-0.20, J.shoulderL[1] - 0.10, J.shoulderL[2] + 0.18];
      J.elbowR = [0.20, J.shoulderR[1] - 0.10, J.shoulderR[2] + 0.18];
      J.wristL = [-0.16, J.shoulderL[1] - 0.06, J.shoulderL[2] + 0.36];
      J.wristR = [0.16, J.shoulderR[1] - 0.06, J.shoulderR[2] + 0.36];
    } else {
      // Barra olímpica apoiada no trapézio
      J.elbowL = [-0.30, J.shoulderL[1] - 0.18, J.shoulderL[2] - 0.06];
      J.elbowR = [0.30, J.shoulderR[1] - 0.18, J.shoulderR[2] - 0.06];
      J.wristL = [-0.32, J.shoulderL[1] + 0.02, J.shoulderL[2] - 0.02];
      J.wristR = [0.32, J.shoulderR[1] + 0.02, J.shoulderR[2] - 0.02];
      addHandWeights(J.wristL, J.wristR, 'barbell');
    }
    forceVector = { from: [0, J.pelvis[1], 0], to: [0, 1.48, 0] };
  }

  // =========================================================================
  // 25B. STEP-UP NA CAIXA E PISTOL SQUAT UNILATERAL
  // =========================================================================
  else if (pattern === 'step_up') {
    equipment.push({ type: 'box', center: [0, 0.16, 0.28], size: [0.46, 0.32, 0.32] });
    const rise = lerp(0, 0.32, p);

    J.pelvis = [0, 0.84 + rise, lerp(-0.08, 0.22, p)];
    J.waist = [0, 0.98 + rise, J.pelvis[2] + 0.02];
    J.chest = [0, 1.20 + rise, J.pelvis[2] + 0.04];
    J.back = [0, 1.20 + rise, J.pelvis[2] - 0.05];
    J.neck = [0, 1.38 + rise, J.pelvis[2] + 0.03];
    J.head = [0, 1.54 + rise, J.pelvis[2] + 0.05];
    J.shoulderL = [-0.21, 1.34 + rise, J.pelvis[2]];
    J.shoulderR = [0.21, 1.34 + rise, J.pelvis[2]];
    J.elbowL = [-0.24, 1.04 + rise, J.pelvis[2]];
    J.elbowR = [0.24, 1.04 + rise, J.pelvis[2]];
    J.wristL = [-0.24, 0.80 + rise, J.pelvis[2] + 0.04];
    J.wristR = [0.24, 0.80 + rise, J.pelvis[2] + 0.04];

    // Perna esquerda inteira apoiada em cima da caixa
    J.hipL = [-0.12, J.pelvis[1], J.pelvis[2]];
    J.kneeL = [-0.12, lerp(0.56, 0.78, p), 0.30];
    J.ankleL = [-0.12, 0.36, 0.26];
    J.footL = [-0.12, 0.32, 0.38];

    // Perna direita subindo do chão até a caixa
    J.hipR = [0.12, J.pelvis[1], J.pelvis[2]];
    J.kneeR = [0.12, lerp(0.46, 0.78, p), lerp(-0.10, 0.26, p)];
    J.ankleR = [0.12, lerp(0.06, 0.36, p), lerp(-0.14, 0.24, p)];
    J.footR = [0.12, lerp(0.02, 0.32, p), lerp(-0.02, 0.36, p)];
    addHandWeights(J.wristL, J.wristR, 'dumbbell');
  }
  else if (pattern === 'pistol_squat') {
    const depth = 1 - p;
    const drop = depth * 0.44;
    J.pelvis = [0, 0.86 - drop, -depth * 0.14];
    J.waist = [0, 1.00 - drop * 0.9, -depth * 0.06];
    J.chest = [0, 1.22 - drop * 0.85, 0.06];
    J.back = [0, 1.22 - drop * 0.85, -0.04];
    J.neck = [0, 1.40 - drop * 0.82, 0.08];
    J.head = [0, 1.56 - drop * 0.82, 0.10];

    J.shoulderL = [-0.21, 1.36 - drop * 0.82, 0.06];
    J.shoulderR = [0.21, 1.36 - drop * 0.82, 0.06];
    J.elbowL = [-0.20, 1.24 - drop * 0.8, 0.26];
    J.elbowR = [0.20, 1.24 - drop * 0.8, 0.26];
    J.wristL = [-0.16, 1.20 - drop * 0.8, 0.46];
    J.wristR = [0.16, 1.20 - drop * 0.8, 0.46];

    // Perna esquerda agachando no solo
    J.hipL = [-0.11, J.pelvis[1], J.pelvis[2]];
    J.kneeL = [-0.11, 0.46 - drop * 0.2, 0.08 + depth * 0.18];
    J.ankleL = [-0.11, 0.06, 0];
    J.footL = [-0.11, 0.02, 0.14];

    // Perna direita esticada à frente no ar
    J.hipR = [0.11, J.pelvis[1], J.pelvis[2]];
    const freeLegY = J.pelvis[1] + 0.04;
    J.kneeR = [0.11, freeLegY, 0.26];
    J.ankleR = [0.11, freeLegY + 0.02, 0.56];
    J.footR = [0.11, freeLegY + 0.10, 0.62];
  }

  // =========================================================================
  // 26. AFUNDO / PASSADA / AGACHAMENTO BÚLGARO
  // =========================================================================
  // 26. AFUNDO / PASSADA / AGACHAMENTO BÚLGARO / STEP-UP
  // =========================================================================
  else if (pattern === 'lunge') {
    const isBulgarian = n.includes('búlgaro');
    if (isBulgarian) {
      equipment.push({ type: 'box', center: [0, 0.22, -0.52], size: [0.40, 0.44, 0.28] });
    }

    const depth = 1 - p;
    const drop = depth * 0.34;

    J.pelvis = [0, 0.86 - drop, 0];
    J.waist = [0, 1.00 - drop, 0.02];
    J.chest = [0, 1.22 - drop, 0.05];
    J.back = [0, 1.22 - drop, -0.05];
    J.neck = [0, 1.40 - drop, 0.04];
    J.head = [0, 1.56 - drop, 0.06];

    J.shoulderL = [-0.21, 1.36 - drop, 0.02];
    J.shoulderR = [0.21, 1.36 - drop, 0.02];
    J.elbowL = [-0.24, 1.06 - drop, 0.02];
    J.elbowR = [0.24, 1.06 - drop, 0.02];
    J.wristL = [-0.24, 0.80 - drop, 0.04];
    J.wristR = [0.24, 0.80 - drop, 0.04];

    // Perna da frente (Esquerda) e Perna de trás (Direita)
    J.hipL = [-0.11, 0.86 - drop, 0.04];
    J.kneeL = [-0.11, 0.48 - drop * 0.15, 0.34 + depth * 0.06];
    J.ankleL = [-0.11, 0.06, 0.34];
    J.footL = [-0.11, 0.02, 0.46];

    J.hipR = [0.11, 0.86 - drop, -0.04];
    J.kneeR = [0.11, 0.46 - drop * 0.90, -0.24];
    const rearFootY = isBulgarian ? 0.46 : 0.06;
    J.ankleR = [0.11, rearFootY, -0.50];
    J.footR = [0.11, rearFootY - 0.04, -0.44];

    addHandWeights(J.wristL, J.wristR, 'dumbbell');
  }

  // =========================================================================
  // 27. LEG PRESS 45° / HACK SQUAT
  // =========================================================================
  else if (pattern === 'leg_press') {
    // Trilho 45° e Encosto do Leg Press
    equipment.push({ type: 'bench', p1: [0, 0.25, -0.15], p2: [0, 0.65, -0.55], width: 0.36 });
    equipment.push({ type: 'bar', p1: [-0.24, 0.30, -0.05], p2: [-0.24, 1.35, 0.72], r: 0.02, color: '#52525b' });
    equipment.push({ type: 'bar', p1: [0.24, 0.30, -0.05], p2: [0.24, 1.35, 0.72], r: 0.02, color: '#52525b' });

    J.head = [0, 0.76, -0.52];
    J.neck = [0, 0.66, -0.42];
    J.chest = [0, 0.54, -0.28];
    J.back = [0, 0.48, -0.34];
    J.waist = [0, 0.40, -0.16];
    J.pelvis = [0, 0.30, -0.06];

    J.shoulderL = [-0.20, 0.60, -0.34];
    J.shoulderR = [0.20, 0.60, -0.34];
    J.elbowL = [-0.24, 0.42, -0.20];
    J.elbowR = [0.24, 0.42, -0.20];
    J.wristL = [-0.22, 0.32, -0.04];
    J.wristR = [0.22, 0.32, -0.04];

    J.hipL = [-0.12, 0.30, -0.06];
    J.hipR = [0.12, 0.30, -0.06];

    const sledDist = lerp(0.22, 0.62, p);
    const sledY = 0.56 + sledDist * 0.65;
    const sledZ = 0.06 + sledDist * 0.65;

    J.kneeL = [-0.14, lerp(0.68, 0.62, p), lerp(-0.08, 0.18, p)];
    J.kneeR = [0.14, lerp(0.68, 0.62, p), lerp(-0.08, 0.18, p)];
    J.ankleL = [-0.14, sledY, sledZ];
    J.ankleR = [0.14, sledY, sledZ];
    J.footL = [-0.14, sledY + 0.08, sledZ - 0.06];
    J.footR = [0.14, sledY + 0.08, sledZ - 0.06];

    // Plataforma do Leg Press + Anilhas
    equipment.push({
      type: 'bench',
      p1: [0, sledY - 0.08, sledZ + 0.06],
      p2: [0, sledY + 0.16, sledZ - 0.14],
      width: 0.44
    });
    equipment.push({ type: 'plate', center: [-0.28, sledY + 0.10, sledZ], r: 0.14 });
    equipment.push({ type: 'plate', center: [0.28, sledY + 0.10, sledZ], r: 0.14 });
  }

  // =========================================================================
  // 28. CADEIRA EXTENSORA (ISOLAMENTO DE QUADRÍCEPS)
  // =========================================================================
  else if (pattern === 'leg_extension') {
    equipment.push({ type: 'bench', p1: [0, 0.52, -0.20], p2: [0, 0.52, 0.18], width: 0.34 });
    equipment.push({ type: 'bench', p1: [0, 0.52, -0.20], p2: [0, 1.15, -0.26], width: 0.34 });
    equipment.push({ type: 'post', p1: [0, 0, -0.05], p2: [0, 0.52, -0.05], r: 0.035 });

    J.head = [0, 1.32, -0.18];
    J.neck = [0, 1.18, -0.16];
    J.chest = [0, 1.00, -0.10];
    J.back = [0, 1.00, -0.20];
    J.waist = [0, 0.78, -0.12];
    J.pelvis = [0, 0.58, -0.08];

    J.shoulderL = [-0.20, 1.12, -0.14];
    J.shoulderR = [0.20, 1.12, -0.14];
    J.elbowL = [-0.24, 0.82, -0.10];
    J.elbowR = [0.24, 0.82, -0.10];
    J.wristL = [-0.22, 0.56, 0.04];
    J.wristR = [0.22, 0.56, 0.04];

    J.hipL = [-0.13, 0.58, -0.08];
    J.hipR = [0.13, 0.58, -0.08];
    J.kneeL = [-0.14, 0.58, 0.24];
    J.kneeR = [0.14, 0.58, 0.24];

    const extAngle = lerp(-1.42, -0.05, p); // de 90° sentado até perna esticada horizontal
    const shinLen = 0.38;
    const ay = 0.58 + Math.sin(extAngle) * shinLen;
    const az = 0.24 + Math.cos(extAngle) * shinLen;

    J.ankleL = [-0.14, ay, az];
    J.ankleR = [0.14, ay, az];
    J.footL = [-0.14, ay + 0.08, az + 0.06];
    J.footR = [0.14, ay + 0.08, az + 0.06];

    // Rolo estofado nas canelas
    equipment.push({ type: 'bar', p1: [-0.24, ay + 0.03, az], p2: [0.24, ay + 0.03, az], r: 0.035, color: '#10b981' });
  }

  // =========================================================================
  // 29. MESA FLEXORA / CADEIRA FLEXORA / NORDIC CURL (POSTERIOR DE COXA)
  // =========================================================================
  else if (pattern === 'leg_curl') {
    addBench(0.46, -0.45, 0.38, 0);
    // Deitado de bruços na mesa flexora
    J.head = [0, 0.58, 0.44];
    J.neck = [0, 0.56, 0.32];
    J.chest = [0, 0.52, 0.16];
    J.back = [0, 0.60, 0.16];
    J.waist = [0, 0.54, 0];
    J.pelvis = [0, 0.54, -0.14];

    J.shoulderL = [-0.20, 0.56, 0.26];
    J.shoulderR = [0.20, 0.56, 0.26];
    J.elbowL = [-0.22, 0.42, 0.40];
    J.elbowR = [0.22, 0.42, 0.40];
    J.wristL = [-0.18, 0.38, 0.52];
    J.wristR = [0.18, 0.38, 0.52];

    J.hipL = [-0.12, 0.54, -0.14];
    J.hipR = [0.12, 0.54, -0.14];
    J.kneeL = [-0.13, 0.50, -0.44];
    J.kneeR = [0.13, 0.50, -0.44];

    const curlAngle = lerp(-0.15, 1.65, p); // esticado atrás até dobrado próximo ao glúteo
    const shinLen = 0.36;
    const ay = 0.50 + Math.sin(curlAngle) * shinLen;
    const az = -0.44 - Math.cos(curlAngle) * shinLen;

    J.ankleL = [-0.13, ay, az];
    J.ankleR = [0.13, ay, az];
    J.footL = [-0.13, ay - 0.06, az - 0.06];
    J.footR = [0.13, ay - 0.06, az - 0.06];

    equipment.push({ type: 'bar', p1: [-0.24, ay, az], p2: [0.24, ay, az], r: 0.035, color: '#10b981' });
  }

  // =========================================================================
  // 29B. CADEIRA FLEXORA SENTADO, FLEXORA EM PÉ E NORDIC CURL
  // =========================================================================
  else if (pattern === 'seated_leg_curl') {
    equipment.push({ type: 'bench', p1: [0, 0.52, -0.20], p2: [0, 0.52, 0.18], width: 0.34 });
    equipment.push({ type: 'bench', p1: [0, 0.52, -0.20], p2: [0, 1.15, -0.26], width: 0.34 });
    equipment.push({ type: 'post', p1: [0, 0, -0.05], p2: [0, 0.52, -0.05], r: 0.035 });

    J.head = [0, 1.32, -0.18];
    J.neck = [0, 1.18, -0.16];
    J.chest = [0, 1.00, -0.10];
    J.back = [0, 1.00, -0.20];
    J.waist = [0, 0.78, -0.12];
    J.pelvis = [0, 0.58, -0.08];
    J.shoulderL = [-0.20, 1.12, -0.14];
    J.shoulderR = [0.20, 1.12, -0.14];
    J.elbowL = [-0.24, 0.82, -0.10];
    J.elbowR = [0.24, 0.82, -0.10];
    J.wristL = [-0.22, 0.64, 0.14];
    J.wristR = [0.22, 0.64, 0.14];

    J.hipL = [-0.13, 0.58, -0.08];
    J.hipR = [0.13, 0.58, -0.08];
    J.kneeL = [-0.14, 0.58, 0.24];
    J.kneeR = [0.14, 0.58, 0.24];

    // Trava sobre as coxas
    equipment.push({ type: 'bar', p1: [-0.24, 0.66, 0.16], p2: [0.24, 0.66, 0.16], r: 0.03, color: '#3f3f46' });

    // Começa estendido à frente (p=0) e flexiona para baixo/trás do banco (p=1)
    const flexAng = lerp(-0.10, -1.62, p);
    const shinLen = 0.38;
    const ay = 0.58 + Math.sin(flexAng) * shinLen;
    const az = 0.24 + Math.cos(flexAng) * shinLen;
    J.ankleL = [-0.14, ay, az];
    J.ankleR = [0.14, ay, az];
    J.footL = [-0.14, ay + 0.06, az + 0.08];
    J.footR = [0.14, ay + 0.06, az + 0.08];
    equipment.push({ type: 'bar', p1: [-0.24, ay, az - 0.03], p2: [0.24, ay, az - 0.03], r: 0.035, color: '#10b981' });
  }
  else if (pattern === 'standing_leg_curl') {
    equipment.push({ type: 'post', p1: [0, 0, 0.36], p2: [0, 1.35, 0.36], r: 0.035 });
    J.elbowL = [-0.20, 1.12, 0.22];
    J.elbowR = [0.20, 1.12, 0.22];
    J.wristL = [-0.16, 1.18, 0.34];
    J.wristR = [0.16, 1.18, 0.34];

    const curlAng = lerp(-1.52, -0.05, p);
    const shinL = 0.38;
    const ay = 0.46 + Math.sin(curlAng) * shinL;
    const az = 0.03 - Math.cos(curlAng) * shinL;
    J.ankleR = [0.13, ay, az];
    J.footR = [0.13, ay - 0.06, az - 0.04];
    equipment.push({ type: 'sphere', center: J.ankleR, r: 0.045, color: '#10b981' });
  }
  else if (pattern === 'nordic_curl') {
    // Ajoelhado com tornozelos presos atrás, inclinando o corpo à frente
    equipment.push({ type: 'bar', p1: [-0.26, 0.14, -0.44], p2: [0.26, 0.14, -0.44], r: 0.035, color: '#10b981' });
    J.ankleL = [-0.13, 0.08, -0.42];
    J.ankleR = [0.13, 0.08, -0.42];
    J.footL = [-0.13, 0.02, -0.48];
    J.footR = [0.13, 0.02, -0.48];
    J.kneeL = [-0.13, 0.08, -0.04];
    J.kneeR = [0.13, 0.08, -0.04];

    const leanAng = lerp(1.05, 0.12, p); // Desce até quase o solo e sobe contraindo posteriores
    const bodyPoint = (dist) => [0, 0.08 + Math.cos(leanAng) * dist, -0.04 + Math.sin(leanAng) * dist];
    J.pelvis = bodyPoint(0.38);
    J.hipL = [-0.12, J.pelvis[1], J.pelvis[2]];
    J.hipR = [0.12, J.pelvis[1], J.pelvis[2]];
    J.waist = bodyPoint(0.54);
    J.chest = bodyPoint(0.76);
    J.back = [0, J.chest[1] + 0.04, J.chest[2] - 0.05];
    J.neck = bodyPoint(0.92);
    J.head = bodyPoint(1.06);
    J.shoulderL = [-0.20, J.chest[1] + 0.06, J.chest[2]];
    J.shoulderR = [0.20, J.chest[1] + 0.06, J.chest[2]];
    J.elbowL = [-0.24, J.chest[1] - 0.06, J.chest[2] + 0.12];
    J.elbowR = [0.24, J.chest[1] - 0.06, J.chest[2] + 0.12];
    J.wristL = [-0.14, J.chest[1] - 0.04, J.chest[2] + 0.22];
    J.wristR = [0.14, J.chest[1] - 0.04, J.chest[2] + 0.22];
  }

  // =========================================================================
  // 30. STIFF / LEVANTAMENTO TERRA ROMENO (RDL) / GOOD MORNING / SWING
  // =========================================================================
  else if (pattern === 'hip_hinge') {
    const hinge = 1 - p; // p=0 tronco inclinado alongando posterior, p=1 em pé contraído
    const hipBack = hinge * 0.22;
    const torsoAngle = hinge * 1.18; // ~68 graus de inclinação com coluna reta

    J.pelvis = [0, 0.85, -hipBack];
    const spineLen = 0.52;
    const sy = 0.85 + Math.cos(torsoAngle) * spineLen;
    const sz = -hipBack + Math.sin(torsoAngle) * spineLen;

    J.waist = [0, lerp(0.85, sy, 0.35), lerp(-hipBack, sz, 0.35)];
    J.chest = [0, lerp(0.85, sy, 0.72), lerp(-hipBack, sz, 0.72) + 0.04];
    J.back = [0, lerp(0.85, sy, 0.72) + 0.04, lerp(-hipBack, sz, 0.72) - 0.05];
    J.neck = [0, sy, sz];
    J.head = [0, sy + Math.cos(torsoAngle) * 0.16, sz + Math.sin(torsoAngle) * 0.16];

    J.shoulderL = [-0.21, sy - 0.03, sz];
    J.shoulderR = [0.21, sy - 0.03, sz];

    J.hipL = [-0.12, 0.85, -hipBack];
    J.hipR = [0.12, 0.85, -hipBack];
    J.kneeL = [-0.13, 0.46, -hipBack * 0.25];
    J.kneeR = [0.13, 0.46, -hipBack * 0.25];
    J.ankleL = [-0.13, 0.06, 0];
    J.ankleR = [0.13, 0.06, 0];
    J.footL = [-0.13, 0.02, 0.12];
    J.footR = [0.13, 0.02, 0.12];

    // Barra ou halteres descendo rente às canelas
    const handY = lerp(0.36, 0.80, p);
    const handZ = lerp(0.08, 0.12, p);
    J.elbowL = [-0.22, lerp(sy - 0.03, handY, 0.5), lerp(sz, handZ, 0.5)];
    J.elbowR = [0.22, lerp(sy - 0.03, handY, 0.5), lerp(sz, handZ, 0.5)];
    J.wristL = [-0.22, handY, handZ];
    J.wristR = [0.22, handY, handZ];

    addHandWeights(J.wristL, J.wristR);
  }

  // =========================================================================
  // 31. LEVANTAMENTO TERRA (DEADLIFT)
  // =========================================================================
  else if (pattern === 'deadlift') {
    const down = 1 - p; // p=0 barra no chão, p=1 travado em pé
    const pelvisY = lerp(0.86, 0.58, down);
    const pelvisZ = lerp(0, -0.22, down);
    const shoulderY = lerp(1.36, 0.90, down);
    const shoulderZ = lerp(0, 0.18, down);

    J.pelvis = [0, pelvisY, pelvisZ];
    J.waist = [0, lerp(pelvisY, shoulderY, 0.35), lerp(pelvisZ, shoulderZ, 0.35)];
    J.chest = [0, lerp(pelvisY, shoulderY, 0.72), lerp(pelvisZ, shoulderZ, 0.72) + 0.04];
    J.back = [0, lerp(pelvisY, shoulderY, 0.72) + 0.04, lerp(pelvisZ, shoulderZ, 0.72) - 0.05];
    J.neck = [0, shoulderY + 0.04, shoulderZ + 0.04];
    J.head = [0, shoulderY + 0.18, shoulderZ + 0.10];

    J.shoulderL = [-0.21, shoulderY, shoulderZ];
    J.shoulderR = [0.21, shoulderY, shoulderZ];

    const barY = lerp(0.24, 0.80, p);
    J.elbowL = [-0.22, lerp(shoulderY, barY, 0.5), 0.10];
    J.elbowR = [0.22, lerp(shoulderY, barY, 0.5), 0.10];
    J.wristL = [-0.22, barY, 0.08];
    J.wristR = [0.22, barY, 0.08];

    J.hipL = [-0.13, pelvisY, pelvisZ];
    J.hipR = [0.13, pelvisY, pelvisZ];
    J.kneeL = [-0.14, 0.45, lerp(0.02, 0.14, down)];
    J.kneeR = [0.14, 0.45, lerp(0.02, 0.14, down)];
    J.ankleL = [-0.14, 0.06, 0];
    J.ankleR = [0.14, 0.06, 0];
    J.footL = [-0.14, 0.02, 0.14];
    J.footR = [0.14, 0.02, 0.14];

    addHandWeights(J.wristL, J.wristR, 'barbell');
    forceVector = { from: [0, barY, 0.08], to: [0, barY + 0.35, 0.08] };
  }

  // =========================================================================
  // 32. ELEVAÇÃO PÉLVICA / HIP THRUST / PONTE DE GLÚTEOS
  // =========================================================================
  else if (pattern === 'hip_thrust') {
    // Banco transversal para apoiar as escápulas
    equipment.push({ type: 'box', center: [0, 0.22, -0.38], size: [0.56, 0.44, 0.28] });

    const pelvisH = lerp(0.18, 0.48, p); // Quadril sobe até alinhar com joelhos e ombros
    J.head = [0, 0.62, -0.44];
    J.neck = [0, 0.54, -0.34];
    J.shoulderL = [-0.20, 0.50, -0.28];
    J.shoulderR = [0.20, 0.50, -0.28];
    J.chest = [0, lerp(0.50, pelvisH, 0.45) + 0.05, -0.14];
    J.back = [0, lerp(0.50, pelvisH, 0.45) - 0.04, -0.14];
    J.waist = [0, lerp(0.50, pelvisH, 0.78), 0.02];
    J.pelvis = [0, pelvisH, 0.14];

    J.hipL = [-0.13, pelvisH, 0.14];
    J.hipR = [0.13, pelvisH, 0.14];
    J.kneeL = [-0.15, 0.48, 0.46];
    J.kneeR = [0.15, 0.48, 0.46];
    J.ankleL = [-0.15, 0.06, 0.46];
    J.ankleR = [0.15, 0.06, 0.46];
    J.footL = [-0.15, 0.02, 0.58];
    J.footR = [0.15, 0.02, 0.58];

    // Mãos segurando a barra sobre o quadril
    J.elbowL = [-0.26, 0.46, -0.06];
    J.elbowR = [0.26, 0.46, -0.06];
    J.wristL = [-0.22, pelvisH + 0.09, 0.12];
    J.wristR = [0.22, pelvisH + 0.09, 0.12];

    if (!n.includes('ponte')) {
      addHandWeights(J.wristL, J.wristR, 'barbell');
    }
    forceVector = { from: [0, pelvisH, 0.14], to: [0, pelvisH + 0.28, 0.14] };
  }

  // =========================================================================
  // 33. COICE DE GLÚTEO NA POLIA / CANELEIRA
  // =========================================================================
  else if (pattern === 'glute_kickback') {
    equipment.push({ type: 'post', p1: [0, 0, 0.52], p2: [0, 1.55, 0.52], r: 0.035 });

    J.head = [0, 1.44, 0.24];
    J.neck = [0, 1.32, 0.18];
    J.chest = [0, 1.16, 0.12];
    J.back = [0, 1.18, 0.02];
    J.waist = [0, 0.98, 0.02];
    J.pelvis = [0, 0.86, -0.04];

    J.shoulderL = [-0.20, 1.26, 0.14];
    J.shoulderR = [0.20, 1.26, 0.14];
    J.elbowL = [-0.20, 1.14, 0.34];
    J.elbowR = [0.20, 1.14, 0.34];
    J.wristL = [-0.14, 1.20, 0.50];
    J.wristR = [0.14, 1.20, 0.50];

    // Perna direita chuta para trás estendendo o quadril
    const kickAngle = lerp(0.15, -0.95, p);
    const legLen = 0.76;
    const ry = 0.86 - Math.cos(kickAngle) * legLen;
    const rz = -0.04 + Math.sin(kickAngle) * legLen;

    J.kneeR = [0.13, lerp(0.86, ry, 0.5), lerp(-0.04, rz, 0.5)];
    J.ankleR = [0.13, ry, rz];
    J.footR = [0.13, ry - 0.03, rz + 0.10];

    equipment.push({ type: 'cable', p1: [0, 0.12, 0.50], p2: J.ankleR });
  }

  // =========================================================================
  // 34. ABDUÇÃO DE QUADRIL (MÁQUINA / MINIBAND)
  // =========================================================================
  else if (pattern === 'hip_abduction') {
    const spread = lerp(0.12, 0.36, p);
    J.kneeL = [-spread, 0.46, 0.05];
    J.kneeR = [spread, 0.46, 0.05];
    J.ankleL = [-spread * 1.15, 0.08, 0];
    J.ankleR = [spread * 1.15, 0.08, 0];
    J.footL = [-spread * 1.15, 0.03, 0.12];
    J.footR = [spread * 1.15, 0.03, 0.12];

    // Miniband elástica verde neon nos joelhos
    equipment.push({ type: 'bar', p1: J.kneeL, p2: J.kneeR, r: 0.015, color: '#10b981' });
  }

  // =========================================================================
  // 35. PANTURRILHA E TIBIAL (EM PÉ NO DEGRAU)
  // =========================================================================
  else if (pattern === 'calf_raise') {
    equipment.push({ type: 'box', center: [0, 0.05, 0.08], size: [0.46, 0.10, 0.24] });
    const rise = lerp(0, 0.16, p);
    Object.keys(J).forEach((k) => {
      if (k !== 'footL' && k !== 'footR') {
        J[k] = [J[k][0], J[k][1] + rise + 0.06, J[k][2]];
      }
    });
    J.footL = [-0.13, 0.10, 0.14];
    J.footR = [0.13, 0.10, 0.14];
    addHandWeights(J.wristL, J.wristR, 'dumbbell');
    forceVector = { from: [0, 0.25, -0.05], to: [0, 0.58, -0.05] };
  }
  else if (pattern === 'seated_calf_raise') {
    // Panturrilha sentada (foco no sóleo)
    addBench(0.46, -0.22, 0.16, 0);
    equipment.push({ type: 'box', center: [0, 0.04, 0.36], size: [0.42, 0.08, 0.18] });
    const heelLift = lerp(0, 0.12, p);

    J.head = [0, 1.24, -0.04];
    J.neck = [0, 1.10, -0.04];
    J.chest = [0, 0.94, 0];
    J.back = [0, 0.94, -0.08];
    J.waist = [0, 0.72, -0.04];
    J.pelvis = [0, 0.50, -0.04];
    J.shoulderL = [-0.20, 1.06, -0.02];
    J.shoulderR = [0.20, 1.06, -0.02];

    J.hipL = [-0.13, 0.50, -0.04];
    J.hipR = [0.13, 0.50, -0.04];
    J.kneeL = [-0.14, 0.50 + heelLift, 0.30];
    J.kneeR = [0.14, 0.50 + heelLift, 0.30];
    J.ankleL = [-0.14, 0.10 + heelLift, 0.28];
    J.ankleR = [0.14, 0.10 + heelLift, 0.28];
    J.footL = [-0.14, 0.08, 0.38];
    J.footR = [0.14, 0.08, 0.38];

    J.elbowL = [-0.22, 0.80, 0.08];
    J.elbowR = [0.22, 0.80, 0.08];
    J.wristL = [-0.15, 0.58 + heelLift, 0.28];
    J.wristR = [0.15, 0.58 + heelLift, 0.28];
    equipment.push({ type: 'bar', p1: [-0.26, 0.56 + heelLift, 0.28], p2: [0.26, 0.56 + heelLift, 0.28], r: 0.035, color: '#10b981' });
  }
  else if (pattern === 'tibialis_raise') {
    // Elevação de ponta dos pés (Tibial anterior - calcanhar fixo no chão e ponta do pé sobe)
    const toeUp = lerp(0.02, 0.16, p);
    J.ankleL = [-0.13, 0.06, 0.04];
    J.ankleR = [0.13, 0.06, 0.04];
    J.footL = [-0.13, toeUp, 0.20];
    J.footR = [0.13, toeUp, 0.20];
    forceVector = { from: [0, 0.04, 0.20], to: [0, 0.28, 0.20] };
  }

  // =========================================================================
  // 36. ABDOMINAL CRUNCH / ELEVAÇÃO DE PERNAS NO SOLO / POLIA / RUSSIAN TWIST / PALLOF
  // =========================================================================
  else if (pattern === 'crunch_abs') {
    // Colchonete 3D no solo
    equipment.push({ type: 'bench', p1: [0, 0.02, -0.55], p2: [0, 0.02, 0.55], width: 0.42 });

    const crunchAngle = lerp(0.15, 0.92, p);
    J.pelvis = [0, 0.10, 0.06];
    J.waist = [0, 0.12 + Math.sin(crunchAngle) * 0.16, -0.10];
    J.chest = [0, 0.14 + Math.sin(crunchAngle) * 0.34, -0.10 - Math.cos(crunchAngle) * 0.22];
    J.back = [0, J.chest[1] - 0.06, J.chest[2] - 0.04];
    J.neck = [0, J.chest[1] + Math.sin(crunchAngle) * 0.14, J.chest[2] - Math.cos(crunchAngle) * 0.10];
    J.head = [0, J.neck[1] + 0.10, J.neck[2] - 0.04];

    J.shoulderL = [-0.20, J.chest[1], J.chest[2]];
    J.shoulderR = [0.20, J.chest[1], J.chest[2]];
    J.elbowL = [-0.26, J.head[1] + 0.02, J.head[2] + 0.08];
    J.elbowR = [0.26, J.head[1] + 0.02, J.head[2] + 0.08];
    J.wristL = [-0.08, J.head[1], J.head[2]];
    J.wristR = [0.08, J.head[1], J.head[2]];

    J.hipL = [-0.12, 0.10, 0.06];
    J.hipR = [0.12, 0.10, 0.06];
    J.kneeL = [-0.14, 0.42, 0.30];
    J.kneeR = [0.14, 0.42, 0.30];
    J.ankleL = [-0.14, 0.06, 0.52];
    J.ankleR = [0.14, 0.06, 0.52];
    J.footL = [-0.14, 0.03, 0.62];
    J.footR = [0.14, 0.03, 0.62];
  }
  else if (pattern === 'lying_leg_raise') {
    // Elevação de pernas deitado no solo / Abdominal reverso / Canivete V-Up
    equipment.push({ type: 'bench', p1: [0, 0.02, -0.60], p2: [0, 0.02, 0.60], width: 0.42 });
    const isVup = n.includes('canivete') || n.includes('v-up');
    const torsoLift = isVup ? p * 0.28 : 0.04;

    J.head = [0, 0.14 + torsoLift * 1.3, -0.46 + torsoLift * 0.4];
    J.neck = [0, 0.12 + torsoLift, -0.34 + torsoLift * 0.3];
    J.chest = [0, 0.12 + torsoLift * 0.6, -0.18];
    J.back = [0, 0.06, -0.18];
    J.waist = [0, 0.10, -0.02];
    J.pelvis = [0, 0.10 + p * 0.05, 0.12];

    J.shoulderL = [-0.20, J.chest[1], -0.22];
    J.shoulderR = [0.20, J.chest[1], -0.22];
    J.elbowL = [-0.22, isVup ? 0.34 * p + 0.10 : 0.08, isVup ? 0.02 : -0.05];
    J.elbowR = [0.22, isVup ? 0.34 * p + 0.10 : 0.08, isVup ? 0.02 : -0.05];
    J.wristL = [-0.18, isVup ? 0.55 * p + 0.08 : 0.06, 0.14];
    J.wristR = [0.18, isVup ? 0.55 * p + 0.08 : 0.06, 0.14];

    const legAng = lerp(0.12, 1.52, p); // Pernas sobem do chão até 90°
    const thighL = 0.36;
    const fullL = 0.68;
    J.hipL = [-0.11, J.pelvis[1], 0.12];
    J.hipR = [0.11, J.pelvis[1], 0.12];
    J.kneeL = [-0.11, J.pelvis[1] + Math.sin(legAng) * thighL, 0.12 + Math.cos(legAng) * thighL];
    J.kneeR = [0.11, J.pelvis[1] + Math.sin(legAng) * thighL, 0.12 + Math.cos(legAng) * thighL];
    J.ankleL = [-0.11, J.pelvis[1] + Math.sin(legAng) * fullL, 0.12 + Math.cos(legAng) * fullL];
    J.ankleR = [0.11, J.pelvis[1] + Math.sin(legAng) * fullL, 0.12 + Math.cos(legAng) * fullL];
    J.footL = [-0.11, J.ankleL[1] + 0.04, J.ankleL[2] + 0.08];
    J.footR = [0.11, J.ankleR[1] + 0.04, J.ankleR[2] + 0.08];
  }
  else if (pattern === 'cable_crunch') {
    // Crunch abdominal ajoelhado na polia alta
    equipment.push({ type: 'post', p1: [0, 0, 0.52], p2: [0, 1.75, 0.52], r: 0.035 });
    J.kneeL = [-0.13, 0.06, 0.08];
    J.kneeR = [0.13, 0.06, 0.08];
    J.ankleL = [-0.13, 0.06, -0.26];
    J.ankleR = [0.13, 0.06, -0.26];
    J.footL = [-0.13, 0.12, -0.32];
    J.footR = [0.13, 0.12, -0.32];

    J.pelvis = [0, 0.44, -0.04];
    J.hipL = [-0.12, 0.44, -0.04];
    J.hipR = [0.12, 0.44, -0.04];

    const flex = lerp(0.18, 1.18, p);
    J.waist = [0, 0.44 + Math.cos(flex * 0.6) * 0.18, -0.04 + Math.sin(flex * 0.6) * 0.14];
    J.chest = [0, J.waist[1] + Math.cos(flex) * 0.24, J.waist[2] + Math.sin(flex) * 0.24];
    J.back = [0, J.chest[1] + 0.05, J.chest[2] - 0.06];
    J.neck = [0, J.chest[1] + Math.cos(flex) * 0.12, J.chest[2] + Math.sin(flex) * 0.12];
    J.head = [0, J.neck[1] + 0.08, J.neck[2] + 0.08];

    J.shoulderL = [-0.20, J.chest[1], J.chest[2]];
    J.shoulderR = [0.20, J.chest[1], J.chest[2]];
    J.elbowL = [-0.18, J.head[1] - 0.16, J.head[2] + 0.10];
    J.elbowR = [0.18, J.head[1] - 0.16, J.head[2] + 0.10];
    J.wristL = [-0.08, J.head[1], J.head[2] + 0.04];
    J.wristR = [0.08, J.head[1], J.head[2] + 0.04];
    equipment.push({ type: 'cable', p1: [0, 1.68, 0.50], p2: [0, J.head[1], J.head[2] + 0.04] });
  }
  else if (pattern === 'russian_twist') {
    // Sentado no solo girando o tronco e peso de um lado para o outro
    equipment.push({ type: 'bench', p1: [0, 0.02, -0.45], p2: [0, 0.02, 0.45], width: 0.42 });
    const twistX = (p - 0.5) * 0.56;
    J.pelvis = [0, 0.10, 0];
    J.waist = [twistX * 0.2, 0.26, -0.08];
    J.chest = [twistX * 0.45, 0.46, -0.18];
    J.back = [twistX * 0.4, 0.44, -0.26];
    J.neck = [twistX * 0.5, 0.62, -0.24];
    J.head = [twistX * 0.5, 0.76, -0.26];

    J.shoulderL = [-0.20 + twistX * 0.45, 0.56, -0.20];
    J.shoulderR = [0.20 + twistX * 0.45, 0.56, -0.20];
    J.elbowL = [-0.18 + twistX * 0.8, 0.36, -0.04];
    J.elbowR = [0.18 + twistX * 0.8, 0.36, -0.04];
    J.wristL = [-0.06 + twistX, 0.34, 0.12];
    J.wristR = [0.06 + twistX, 0.34, 0.12];

    J.hipL = [-0.12, 0.10, 0];
    J.hipR = [0.12, 0.10, 0];
    J.kneeL = [-0.13, 0.36, 0.28];
    J.kneeR = [0.13, 0.36, 0.28];
    J.ankleL = [-0.13, 0.22, 0.52];
    J.ankleR = [0.13, 0.22, 0.52];
    J.footL = [-0.13, 0.28, 0.58];
    J.footR = [0.13, 0.28, 0.58];
    equipment.push({ type: 'plate', center: [twistX, 0.34, 0.14], r: 0.085 });
  }
  else if (pattern === 'pallof_press') {
    // Em pé lateralmente para a polia empurrando o cabo à frente do esterno
    equipment.push({ type: 'post', p1: [-0.62, 0, 0], p2: [-0.62, 1.65, 0], r: 0.035 });
    const extZ = lerp(0.12, 0.46, p);
    J.elbowL = [-0.22, 1.06, lerp(0.02, 0.24, p)];
    J.elbowR = [0.22, 1.06, lerp(0.02, 0.24, p)];
    J.wristL = [-0.03, 1.14, extZ];
    J.wristR = [0.03, 1.14, extZ];
    equipment.push({ type: 'cable', p1: [-0.60, 1.14, 0], p2: [0, 1.14, extZ] });
    equipment.push({ type: 'sphere', center: [0, 1.14, extZ], r: 0.04, color: '#10b981' });
  }

  // =========================================================================
  // 37. ELEVAÇÃO DE PERNAS / JOELHOS SUSPENSO NA BARRA E L-SIT
  // =========================================================================
  else if (pattern === 'hanging_abs') {
    const barY = 1.88;
    equipment.push({ type: 'post', p1: [-0.48, 0, 0], p2: [-0.48, barY + 0.05, 0], r: 0.03 });
    equipment.push({ type: 'post', p1: [0.48, 0, 0], p2: [0.48, barY + 0.05, 0], r: 0.03 });
    equipment.push({ type: 'bar', p1: [-0.50, barY, 0], p2: [0.50, barY, 0], r: 0.02, color: '#e4e4e7' });

    J.wristL = [-0.24, barY, 0];
    J.wristR = [0.24, barY, 0];
    J.elbowL = [-0.23, 1.66, 0];
    J.elbowR = [0.23, 1.66, 0];
    J.shoulderL = [-0.21, 1.46, 0];
    J.shoulderR = [0.21, 1.46, 0];
    J.head = [0, 1.56, 0.02];
    J.neck = [0, 1.44, 0];
    J.chest = [0, 1.26, 0.04];
    J.back = [0, 1.26, -0.05];
    J.waist = [0, 1.04, 0.02 * p];
    J.pelvis = [0, 0.90 + p * 0.08, p * 0.08];

    J.hipL = [-0.12, J.pelvis[1], J.pelvis[2]];
    J.hipR = [0.12, J.pelvis[1], J.pelvis[2]];

    const legAngle = lerp(0.08, 1.68, p); // de vertical para baixo até 95° acima da cintura
    const thighLen = 0.38;
    const fullLeg = 0.72;

    J.kneeL = [-0.12, J.pelvis[1] - Math.cos(legAngle) * thighLen, J.pelvis[2] + Math.sin(legAngle) * thighLen];
    J.kneeR = [0.12, J.pelvis[1] - Math.cos(legAngle) * thighLen, J.pelvis[2] + Math.sin(legAngle) * thighLen];
    J.ankleL = [-0.12, J.pelvis[1] - Math.cos(legAngle) * fullLeg, J.pelvis[2] + Math.sin(legAngle) * fullLeg];
    J.ankleR = [0.12, J.pelvis[1] - Math.cos(legAngle) * fullLeg, J.pelvis[2] + Math.sin(legAngle) * fullLeg];
    J.footL = [-0.12, J.ankleL[1] + 0.06, J.ankleL[2] + 0.06];
    J.footR = [0.12, J.ankleR[1] + 0.06, J.ankleR[2] + 0.06];
  }
  else if (pattern === 'l_sit') {
    // L-Sit apoiado em paralelas baixas (parallettes) com pernas retas a 90°
    equipment.push({ type: 'bar', p1: [-0.24, 0.14, -0.15], p2: [-0.24, 0.14, 0.15], r: 0.02, color: '#10b981' });
    equipment.push({ type: 'bar', p1: [0.24, 0.14, -0.15], p2: [0.24, 0.14, 0.15], r: 0.02, color: '#10b981' });

    const lift = lerp(0.02, 0.10, p);
    J.wristL = [-0.24, 0.14, 0];
    J.wristR = [0.24, 0.14, 0];
    J.elbowL = [-0.24, 0.38, -0.02];
    J.elbowR = [0.24, 0.38, -0.02];
    J.shoulderL = [-0.21, 0.64 + lift * 0.3, -0.04];
    J.shoulderR = [0.21, 0.64 + lift * 0.3, -0.04];

    J.head = [0, 0.84 + lift * 0.3, -0.02];
    J.neck = [0, 0.70 + lift * 0.3, -0.04];
    J.chest = [0, 0.54 + lift * 0.3, 0];
    J.back = [0, 0.54 + lift * 0.3, -0.08];
    J.waist = [0, 0.38 + lift * 0.3, -0.04];
    J.pelvis = [0, 0.26 + lift * 0.3, -0.04];

    J.hipL = [-0.11, J.pelvis[1], -0.04];
    J.hipR = [0.11, J.pelvis[1], -0.04];
    J.kneeL = [-0.11, J.pelvis[1] + 0.02, 0.28];
    J.kneeR = [0.11, J.pelvis[1] + 0.02, 0.28];
    J.ankleL = [-0.11, J.pelvis[1] + 0.04, 0.60];
    J.ankleR = [0.11, J.pelvis[1] + 0.04, 0.60];
    J.footL = [-0.11, J.pelvis[1] + 0.12, 0.64];
    J.footR = [0.11, J.pelvis[1] + 0.12, 0.64];
  }

  // =========================================================================
  // 38. PRANCHA ISOMÉTRICA / PRANCHA LATERAL / MOUNTAIN CLIMBER / DEAD BUG
  // =========================================================================
  else if (pattern === 'plank_core') {
    const isWheel = n.includes('wheel') || n.includes('roda');
    const reachZ = isWheel ? lerp(0.36, 0.68, p) : 0.38;

    J.head = [0, 0.42, 0.48];
    J.neck = [0, 0.38, 0.36];
    J.chest = [0, 0.32, 0.22];
    J.back = [0, 0.40, 0.22];
    J.waist = [0, 0.30, 0];
    J.pelvis = [0, 0.28, -0.18];

    J.shoulderL = [-0.20, 0.36, 0.28];
    J.shoulderR = [0.20, 0.36, 0.28];
    J.elbowL = [-0.20, 0.06, 0.28];
    J.elbowR = [0.20, 0.06, 0.28];
    J.wristL = [-0.16, 0.04, reachZ + 0.14];
    J.wristR = [0.16, 0.04, reachZ + 0.14];

    J.hipL = [-0.11, 0.28, -0.18];
    J.hipR = [0.11, 0.28, -0.18];
    J.kneeL = [-0.11, 0.18, -0.40];
    J.kneeR = [0.11, 0.18, -0.40];
    J.ankleL = [-0.11, 0.08, -0.62];
    J.ankleR = [0.11, 0.08, -0.62];
    J.footL = [-0.11, 0.02, -0.64];
    J.footR = [0.11, 0.02, -0.64];

    if (isWheel) {
      equipment.push({ type: 'plate', center: [0, 0.09, reachZ + 0.14], r: 0.09 });
    }
  }
  else if (pattern === 'side_plank') {
    // Prancha lateral apoiada em um único antebraço
    const hipPulse = lerp(0.24, 0.32, p);
    J.head = [0, 0.56, 0.46];
    J.neck = [0, 0.50, 0.34];
    J.chest = [0.04, 0.44, 0.20];
    J.back = [-0.04, 0.44, 0.20];
    J.waist = [0, hipPulse + 0.08, 0.02];
    J.pelvis = [0, hipPulse, -0.14];

    J.shoulderR = [0, 0.32, 0.30];
    J.elbowR = [0, 0.06, 0.30];
    J.wristR = [0.16, 0.04, 0.30];

    J.shoulderL = [0, 0.64, 0.30];
    J.elbowL = [0, 0.88, 0.30];
    J.wristL = [0, 1.10, 0.30];

    J.hipR = [0, hipPulse - 0.06, -0.14];
    J.hipL = [0, hipPulse + 0.06, -0.14];
    J.kneeR = [0, 0.14, -0.38];
    J.kneeL = [0, 0.22, -0.38];
    J.ankleR = [0, 0.05, -0.60];
    J.ankleL = [0, 0.12, -0.60];
    J.footR = [0.08, 0.05, -0.62];
    J.footL = [0.08, 0.12, -0.62];
  }
  else if (pattern === 'mountain_climber') {
    // Prancha alta puxando joelhos alternadamente em direção ao peito
    J.head = [0, 0.62, 0.52];
    J.neck = [0, 0.56, 0.40];
    J.chest = [0, 0.48, 0.24];
    J.back = [0, 0.56, 0.24];
    J.waist = [0, 0.42, 0.04];
    J.pelvis = [0, 0.38, -0.14];

    J.shoulderL = [-0.20, 0.52, 0.34];
    J.shoulderR = [0.20, 0.52, 0.34];
    J.elbowL = [-0.20, 0.28, 0.36];
    J.elbowR = [0.20, 0.28, 0.36];
    J.wristL = [-0.20, 0.04, 0.38];
    J.wristR = [0.20, 0.04, 0.38];

    J.hipL = [-0.11, 0.38, -0.14];
    J.hipR = [0.11, 0.38, -0.14];

    const driveL = p;
    const driveR = 1 - p;
    J.kneeL = [-0.11, lerp(0.22, 0.32, driveL), lerp(-0.38, 0.14, driveL)];
    J.ankleL = [-0.11, lerp(0.08, 0.18, driveL), lerp(-0.62, -0.18, driveL)];
    J.footL = [-0.11, lerp(0.02, 0.12, driveL), lerp(-0.64, -0.16, driveL)];

    J.kneeR = [0.11, lerp(0.22, 0.32, driveR), lerp(-0.38, 0.14, driveR)];
    J.ankleR = [0.11, lerp(0.08, 0.18, driveR), lerp(-0.62, -0.18, driveR)];
    J.footR = [0.11, lerp(0.02, 0.12, driveR), lerp(-0.64, -0.16, driveR)];
  }
  else if (pattern === 'dead_bug') {
    // Deitado de costas no solo estendendo braço e perna opostos
    equipment.push({ type: 'bench', p1: [0, 0.02, -0.60], p2: [0, 0.02, 0.60], width: 0.42 });
    J.head = [0, 0.12, -0.44];
    J.neck = [0, 0.10, -0.32];
    J.chest = [0, 0.12, -0.16];
    J.back = [0, 0.06, -0.16];
    J.waist = [0, 0.10, 0];
    J.pelvis = [0, 0.10, 0.14];

    J.shoulderL = [-0.20, 0.12, -0.22];
    J.shoulderR = [0.20, 0.12, -0.22];
    // Braço direito estende para trás enquanto perna esquerda estende para frente
    J.elbowL = [-0.20, 0.36, -0.22];
    J.wristL = [-0.20, 0.58, -0.22];

    const reach = p;
    J.elbowR = [0.20, lerp(0.36, 0.16, reach), lerp(-0.22, -0.44, reach)];
    J.wristR = [0.20, lerp(0.58, 0.14, reach), lerp(-0.22, -0.66, reach)];

    J.hipL = [-0.11, 0.10, 0.14];
    J.hipR = [0.11, 0.10, 0.14];
    J.kneeL = [-0.11, lerp(0.42, 0.18, reach), lerp(0.14, 0.44, reach)];
    J.ankleL = [-0.11, lerp(0.42, 0.14, reach), lerp(0.44, 0.72, reach)];
    J.footL = [-0.11, J.ankleL[1] + 0.08, J.ankleL[2]];

    J.kneeR = [0.11, 0.42, 0.14];
    J.ankleR = [0.11, 0.42, 0.44];
    J.footR = [0.11, 0.50, 0.44];
  }

  // =========================================================================
  // 39. EXTENSÃO LOMBAR NO BANCO ROMANO / SUPERMAN NO SOLO / 4 APOIOS (BIRD DOG)
  // =========================================================================
  else if (pattern === 'back_extension') {
    equipment.push({ type: 'bench', p1: [0, 0.12, -0.45], p2: [0, 0.72, 0.02], width: 0.32 });
    equipment.push({ type: 'post', p1: [0, 0, -0.05], p2: [0, 0.72, -0.05], r: 0.035 });

    J.ankleL = [-0.12, 0.18, -0.42];
    J.ankleR = [0.12, 0.18, -0.42];
    J.footL = [-0.12, 0.12, -0.48];
    J.footR = [0.12, 0.12, -0.48];
    J.kneeL = [-0.12, 0.45, -0.20];
    J.kneeR = [0.12, 0.45, -0.20];
    J.pelvis = [0, 0.74, 0.04];
    J.hipL = [-0.12, 0.74, 0.04];
    J.hipR = [0.12, 0.74, 0.04];

    const extAngle = lerp(-0.65, 0.68, p); // de inclinado para baixo até alinhado em 45°
    const tLen = 0.50;
    const ty = 0.74 + Math.sin(extAngle) * tLen;
    const tz = 0.04 + Math.cos(extAngle) * tLen;

    J.waist = [0, lerp(0.74, ty, 0.35), lerp(0.04, tz, 0.35)];
    J.chest = [0, lerp(0.74, ty, 0.75) - 0.03, lerp(0.04, tz, 0.75) + 0.03];
    J.back = [0, lerp(0.74, ty, 0.75) + 0.04, lerp(0.04, tz, 0.75) - 0.03];
    J.neck = [0, ty, tz];
    J.head = [0, ty + Math.sin(extAngle) * 0.14, tz + Math.cos(extAngle) * 0.14];

    J.shoulderL = [-0.20, ty - 0.02, tz];
    J.shoulderR = [0.20, ty - 0.02, tz];
    J.elbowL = [-0.24, J.chest[1], J.chest[2] + 0.06];
    J.elbowR = [0.24, J.chest[1], J.chest[2] + 0.06];
    J.wristL = [-0.06, J.chest[1], J.chest[2] + 0.08];
    J.wristR = [0.06, J.chest[1], J.chest[2] + 0.08];
  }
  else if (pattern === 'superman_floor') {
    // Superman deitado de bruços no colchonete elevando braços e pernas
    equipment.push({ type: 'bench', p1: [0, 0.02, -0.60], p2: [0, 0.02, 0.60], width: 0.42 });
    const lift = lerp(0.02, 0.22, p);

    J.pelvis = [0, 0.08, -0.06];
    J.waist = [0, 0.09 + lift * 0.25, 0.08];
    J.chest = [0, 0.10 + lift * 0.65, 0.24];
    J.back = [0, J.chest[1] + 0.06, 0.24];
    J.neck = [0, 0.12 + lift * 0.85, 0.36];
    J.head = [0, 0.16 + lift, 0.48];

    J.shoulderL = [-0.20, J.chest[1] + 0.02, 0.28];
    J.shoulderR = [0.20, J.chest[1] + 0.02, 0.28];
    J.elbowL = [-0.22, 0.10 + lift * 1.1, 0.50];
    J.elbowR = [0.22, 0.10 + lift * 1.1, 0.50];
    J.wristL = [-0.20, 0.12 + lift * 1.35, 0.72];
    J.wristR = [0.20, 0.12 + lift * 1.35, 0.72];

    J.hipL = [-0.11, 0.08, -0.08];
    J.hipR = [0.11, 0.08, -0.08];
    J.kneeL = [-0.12, 0.08 + lift * 0.65, -0.36];
    J.kneeR = [0.12, 0.08 + lift * 0.65, -0.36];
    J.ankleL = [-0.12, 0.08 + lift * 1.15, -0.64];
    J.ankleR = [0.12, 0.08 + lift * 1.15, -0.64];
    J.footL = [-0.12, J.ankleL[1] - 0.04, -0.72];
    J.footR = [0.12, J.ankleR[1] - 0.04, -0.72];
  }
  else if (pattern === 'quadruped_core') {
    // 4 Apoios no solo (Bird dog / Cat-cow / Rotação torácica)
    equipment.push({ type: 'bench', p1: [0, 0.02, -0.55], p2: [0, 0.02, 0.55], width: 0.42 });
    const isCatCow = n.includes('cat-cow');
    const arch = isCatCow ? (p - 0.5) * 0.18 : 0;

    J.pelvis = [0, 0.44, -0.18];
    J.waist = [0, 0.46 + arch, 0];
    J.chest = [0, 0.46 + arch * 0.6, 0.18];
    J.back = [0, 0.52 + arch, 0.10];
    J.neck = [0, 0.48 - arch * 0.4, 0.30];
    J.head = [0, 0.52 - arch * 0.8, 0.42];

    J.shoulderL = [-0.18, 0.46, 0.24];
    J.shoulderR = [0.18, 0.46, 0.24];
    J.elbowL = [-0.18, 0.24, 0.24];
    J.wristL = [-0.18, 0.04, 0.24];

    J.hipR = [0.11, 0.44, -0.18];
    J.kneeR = [0.11, 0.06, -0.18];
    J.ankleR = [0.11, 0.06, -0.44];
    J.footR = [0.11, 0.02, -0.48];

    if (isCatCow) {
      J.elbowR = [0.18, 0.24, 0.24];
      J.wristR = [0.18, 0.04, 0.24];
      J.hipL = [-0.11, 0.44, -0.18];
      J.kneeL = [-0.11, 0.06, -0.18];
      J.ankleL = [-0.11, 0.06, -0.44];
      J.footL = [-0.11, 0.02, -0.48];
    } else {
      // Bird Dog: estende braço direito à frente e perna esquerda atrás
      J.elbowR = [0.18, lerp(0.24, 0.48, p), lerp(0.24, 0.46, p)];
      J.wristR = [0.18, lerp(0.04, 0.50, p), lerp(0.24, 0.68, p)];
      J.hipL = [-0.11, 0.44, -0.18];
      J.kneeL = [-0.11, lerp(0.06, 0.44, p), lerp(-0.18, -0.46, p)];
      J.ankleL = [-0.11, lerp(0.06, 0.46, p), lerp(-0.44, -0.76, p)];
      J.footL = [-0.11, J.ankleL[1] - 0.06, J.ankleL[2]];
    }
  }

  // =========================================================================
  // 40. LEVANTAMENTOS OLÍMPICOS (SNATCH / CLEAN & JERK)
  // =========================================================================
  else if (pattern === 'olympic_lift') {
    const drop = (1 - p) * 0.35;
    J.pelvis = [0, 0.86 - drop, -drop * 0.3];
    J.waist = [0, 1.00 - drop * 0.9, -drop * 0.15];
    J.chest = [0, 1.22 - drop * 0.8, 0.04];
    J.back = [0, 1.22 - drop * 0.8, -0.06];
    J.neck = [0, 1.40 - drop * 0.75, 0.02];
    J.head = [0, 1.56 - drop * 0.75, 0.04];

    J.shoulderL = [-0.21, 1.36 - drop * 0.75, 0];
    J.shoulderR = [0.21, 1.36 - drop * 0.75, 0];

    const isCleanOnly = n.includes('clean') && !n.includes('jerk');
    const topBarY = isCleanOnly ? 1.38 : 1.88;
    const barY = lerp(0.45, topBarY, p);
    const gripX = n.includes('arranco') || n.includes('snatch') ? 0.38 : 0.26;
    J.wristL = [-gripX, barY, 0.08];
    J.wristR = [gripX, barY, 0.08];
    J.elbowL = [-(gripX + 0.04), isCleanOnly ? lerp(0.75, 1.34, p) : lerp(0.75, 1.62, p), isCleanOnly ? lerp(0.06, 0.24, p) : 0.06];
    J.elbowR = [gripX + 0.04, isCleanOnly ? lerp(0.75, 1.34, p) : lerp(0.75, 1.62, p), isCleanOnly ? lerp(0.06, 0.24, p) : 0.06];

    J.hipL = [-0.13, J.pelvis[1], J.pelvis[2]];
    J.hipR = [0.13, J.pelvis[1], J.pelvis[2]];
    J.kneeL = [-0.15, 0.46 - drop * 0.15, 0.08];
    J.kneeR = [0.15, 0.46 - drop * 0.15, 0.08];

    addHandWeights(J.wristL, J.wristR, 'barbell');
    forceVector = { from: [0, 0.45, 0.08], to: [0, topBarY, 0.08] };
  }

  // =========================================================================
  // 41. TRENÓ (SLED / PROWLER PUSH)
  // =========================================================================
  else if (pattern === 'sled_push') {
    const sledZ = 0.44;
    equipment.push({ type: 'bar', p1: [-0.26, 0.03, sledZ - 0.15], p2: [-0.26, 0.03, sledZ + 0.35], r: 0.025, color: '#10b981' });
    equipment.push({ type: 'bar', p1: [0.26, 0.03, sledZ - 0.15], p2: [0.26, 0.03, sledZ + 0.35], r: 0.025, color: '#10b981' });
    equipment.push({ type: 'post', p1: [-0.22, 0.03, sledZ], p2: [-0.22, 0.98, sledZ], r: 0.025 });
    equipment.push({ type: 'post', p1: [0.22, 0.03, sledZ], p2: [0.22, 0.98, sledZ], r: 0.025 });
    equipment.push({ type: 'plate', center: [0, 0.18, sledZ + 0.14], r: 0.14 });

    J.head = [0, 1.18, 0.24];
    J.neck = [0, 1.08, 0.14];
    J.chest = [0, 0.96, 0.02];
    J.back = [0, 1.02, -0.06];
    J.waist = [0, 0.82, -0.14];
    J.pelvis = [0, 0.70, -0.26];

    J.shoulderL = [-0.20, 1.04, 0.08];
    J.shoulderR = [0.20, 1.04, 0.08];
    J.elbowL = [-0.22, 0.96, 0.26];
    J.elbowR = [0.22, 0.96, 0.26];
    J.wristL = [-0.22, 0.92, sledZ];
    J.wristR = [0.22, 0.92, sledZ];

    const stride = Math.sin(p * Math.PI * 2) * 0.22;
    J.hipL = [-0.12, 0.70, -0.26];
    J.hipR = [0.12, 0.70, -0.26];
    J.kneeL = [-0.13, 0.42, -0.22 + stride];
    J.ankleL = [-0.13, 0.06, -0.38 + stride];
    J.footL = [-0.13, 0.02, -0.28 + stride];
    J.kneeR = [0.13, 0.42, -0.22 - stride];
    J.ankleR = [0.13, 0.06, -0.38 - stride];
    J.footR = [0.13, 0.02, -0.28 - stride];
  }

  // =========================================================================
  // 42. PARADA DE MÃOS / FLEXÃO EM PINO (HANDSTAND)
  // =========================================================================
  else if (pattern === 'handstand') {
    const pushH = lerp(0, 0.22, p);
    J.wristL = [-0.22, 0.03, 0];
    J.wristR = [0.22, 0.03, 0];
    J.elbowL = [-0.26, 0.22 + pushH * 0.4, 0.04];
    J.elbowR = [0.26, 0.22 + pushH * 0.4, 0.04];
    J.shoulderL = [-0.20, 0.42 + pushH, 0];
    J.shoulderR = [0.20, 0.42 + pushH, 0];
    J.head = [0, 0.28 + pushH, 0.04];
    J.neck = [0, 0.40 + pushH, 0];
    J.chest = [0, 0.58 + pushH, 0.04];
    J.back = [0, 0.58 + pushH, -0.05];
    J.waist = [0, 0.80 + pushH, 0];
    J.pelvis = [0, 0.96 + pushH, 0];
    J.hipL = [-0.11, 0.96 + pushH, 0];
    J.hipR = [0.11, 0.96 + pushH, 0];
    J.kneeL = [-0.11, 1.32 + pushH, 0];
    J.kneeR = [0.11, 1.32 + pushH, 0];
    J.ankleL = [-0.11, 1.66 + pushH, 0];
    J.ankleR = [0.11, 1.66 + pushH, 0];
    J.footL = [-0.11, 1.74 + pushH, 0.06];
    J.footR = [0.11, 1.74 + pushH, 0.06];
  }

  // =========================================================================
  // 43. CARDIO / CORRIDA / POLICHINELO / SALTO
  // =========================================================================
  else if (pattern === 'running_cardio') {
    const bounce = Math.abs(Math.sin(p * Math.PI * 2)) * 0.10;
    const swing = Math.sin(p * Math.PI * 2) * 0.26;

    Object.keys(J).forEach((k) => {
      J[k] = [J[k][0], J[k][1] + bounce, J[k][2]];
    });

    J.kneeL = [-0.13, 0.50 + bounce, swing];
    J.ankleL = [-0.13, 0.10 + bounce, swing * 1.1];
    J.footL = [-0.13, 0.05 + bounce, swing * 1.1 + 0.12];

    J.kneeR = [0.13, 0.50 + bounce, -swing];
    J.ankleR = [0.13, 0.10 + bounce, -swing * 1.1];
    J.footR = [0.13, 0.05 + bounce, -swing * 1.1 + 0.12];

    J.elbowL = [-0.25, 1.08 + bounce, -swing * 0.6];
    J.wristL = [-0.22, 1.14 + bounce, -swing * 0.6 + 0.18];
    J.elbowR = [0.25, 1.08 + bounce, swing * 0.6];
    J.wristR = [0.22, 1.14 + bounce, swing * 0.6 + 0.18];
  }

  // =========================================================================
  // 44. BICICLETA ERGOMÉTRICA / SPINNING / CICLISMO, POLICHINELO, CORDA, BOX JUMP E BURPEE
  // =========================================================================
  else if (pattern === 'cycling_bike') {
    // Bike ergométrica 3D com selim, guidão, quadro e pedais giratórios
    equipment.push({ type: 'post', p1: [0, 0.05, -0.18], p2: [0, 0.72, -0.22], r: 0.03 });
    equipment.push({ type: 'post', p1: [0, 0.05, 0.34], p2: [0, 1.08, 0.38], r: 0.03 });
    equipment.push({ type: 'bar', p1: [0, 0.36, -0.20], p2: [0, 0.36, 0.36], r: 0.025, color: '#3f3f46' });
    equipment.push({ type: 'bar', p1: [-0.22, 1.08, 0.38], p2: [0.22, 1.08, 0.38], r: 0.02, color: '#10b981' });
    equipment.push({ type: 'plate', center: [0, 0.36, 0.36], r: 0.18 });

    J.pelvis = [0, 0.76, -0.20];
    J.waist = [0, 0.92, -0.10];
    J.chest = [0, 1.12, 0.04];
    J.back = [0, 1.14, -0.06];
    J.neck = [0, 1.28, 0.12];
    J.head = [0, 1.42, 0.18];
    J.shoulderL = [-0.20, 1.22, 0.08];
    J.shoulderR = [0.20, 1.22, 0.08];
    J.elbowL = [-0.22, 1.12, 0.24];
    J.elbowR = [0.22, 1.12, 0.24];
    J.wristL = [-0.20, 1.08, 0.38];
    J.wristR = [0.20, 1.08, 0.38];

    const pedalAng = p * Math.PI * 2;
    const crankR = 0.14;
    const pedLY = 0.36 + Math.sin(pedalAng) * crankR;
    const pedLZ = 0.08 + Math.cos(pedalAng) * crankR;
    const pedRY = 0.36 - Math.sin(pedalAng) * crankR;
    const pedRZ = 0.08 - Math.cos(pedalAng) * crankR;

    J.hipL = [-0.12, 0.76, -0.20];
    J.hipR = [0.12, 0.76, -0.20];
    J.kneeL = [-0.13, (0.76 + pedLY) * 0.5 + 0.14, (pedLZ - 0.20) * 0.5 + 0.22];
    J.kneeR = [0.13, (0.76 + pedRY) * 0.5 + 0.14, (pedRZ - 0.20) * 0.5 + 0.22];
    J.ankleL = [-0.13, pedLY, pedLZ];
    J.ankleR = [0.13, pedRY, pedRZ];
    J.footL = [-0.13, pedLY - 0.02, pedLZ + 0.10];
    J.footR = [0.13, pedRY - 0.02, pedRZ + 0.10];
  }
  else if (pattern === 'jumping_jack') {
    // Polichinelo abrindo pernas e subindo braços acima da cabeça
    const jumpY = p * 0.12;
    const legOut = lerp(0.10, 0.32, p);
    Object.keys(J).forEach((k) => {
      J[k] = [J[k][0], J[k][1] + jumpY, J[k][2]];
    });
    J.kneeL = [-legOut * 0.65, 0.46 + jumpY, 0];
    J.kneeR = [legOut * 0.65, 0.46 + jumpY, 0];
    J.ankleL = [-legOut, 0.06 + jumpY, 0];
    J.ankleR = [legOut, 0.06 + jumpY, 0];
    J.footL = [-legOut, 0.02 + jumpY, 0.10];
    J.footR = [legOut, 0.02 + jumpY, 0.10];

    const armAng = lerp(0.15, 2.85, p);
    J.elbowL = [-0.21 - Math.sin(armAng) * 0.26, 1.36 + jumpY - Math.cos(armAng) * 0.26, 0];
    J.elbowR = [0.21 + Math.sin(armAng) * 0.26, 1.36 + jumpY - Math.cos(armAng) * 0.26, 0];
    J.wristL = [-0.21 - Math.sin(armAng) * 0.50, 1.36 + jumpY - Math.cos(armAng) * 0.50, 0];
    J.wristR = [0.21 + Math.sin(armAng) * 0.50, 1.36 + jumpY - Math.cos(armAng) * 0.50, 0];
  }
  else if (pattern === 'jump_rope') {
    // Pular corda com arco de corda girando
    const hop = p * 0.14;
    Object.keys(J).forEach((k) => {
      J[k] = [J[k][0], J[k][1] + hop, J[k][2]];
    });
    J.elbowL = [-0.26, 1.04 + hop, 0.02];
    J.elbowR = [0.26, 1.04 + hop, 0.02];
    J.wristL = [-0.34, 0.96 + hop, 0.08];
    J.wristR = [0.34, 0.96 + hop, 0.08];

    const ropeY = p > 0.5 ? 1.82 : 0.02;
    const ropeZ = (p - 0.5) * 0.35;
    equipment.push({ type: 'cable', p1: J.wristL, p2: [-0.18, ropeY, ropeZ] });
    equipment.push({ type: 'cable', p1: [-0.18, ropeY, ropeZ], p2: [0.18, ropeY, ropeZ] });
    equipment.push({ type: 'cable', p1: [0.18, ropeY, ropeZ], p2: J.wristR });
  }
  else if (pattern === 'box_jump') {
    // Salto em caixa pliométrica / Salto vertical
    const hasBox = n.includes('caixa');
    if (hasBox) {
      equipment.push({ type: 'box', center: [0, 0.20, 0.26], size: [0.48, 0.40, 0.36] });
    }
    const jumpH = p * 0.42;
    const jumpZ = hasBox ? lerp(-0.18, 0.24, p) : 0;
    Object.keys(J).forEach((k) => {
      J[k] = [J[k][0], J[k][1] + jumpH, J[k][2] + jumpZ];
    });
    const armSwing = lerp(-0.35, 2.4, p);
    J.elbowL = [-0.22, 1.36 + jumpH - Math.cos(armSwing) * 0.24, jumpZ + Math.sin(armSwing) * 0.24];
    J.elbowR = [0.22, 1.36 + jumpH - Math.cos(armSwing) * 0.24, jumpZ + Math.sin(armSwing) * 0.24];
    J.wristL = [-0.20, 1.36 + jumpH - Math.cos(armSwing) * 0.46, jumpZ + Math.sin(armSwing) * 0.46];
    J.wristR = [0.20, 1.36 + jumpH - Math.cos(armSwing) * 0.46, jumpZ + Math.sin(armSwing) * 0.46];
  }
  else if (pattern === 'burpee') {
    // Burpee completo: Prancha no solo (p=0) -> Salto vertical com mãos acima da cabeça (p=1)
    const stand = p;
    const jump = Math.max(0, (p - 0.65) * 0.7);
    J.pelvis = [0, lerp(0.26, 0.86 + jump, stand), lerp(-0.14, 0, stand)];
    J.waist = [0, lerp(0.30, 1.00 + jump, stand), lerp(0.04, 0, stand)];
    J.chest = [0, lerp(0.34, 1.22 + jump, stand), lerp(0.24, 0.04, stand)];
    J.back = [0, lerp(0.42, 1.22 + jump, stand), lerp(0.24, -0.05, stand)];
    J.neck = [0, lerp(0.40, 1.40 + jump, stand), lerp(0.38, 0.02, stand)];
    J.head = [0, lerp(0.46, 1.56 + jump, stand), lerp(0.50, 0.04, stand)];

    J.shoulderL = [-0.21, lerp(0.36, 1.36 + jump, stand), lerp(0.30, 0, stand)];
    J.shoulderR = [0.21, lerp(0.36, 1.36 + jump, stand), lerp(0.30, 0, stand)];
    J.elbowL = [-0.22, lerp(0.18, 1.62 + jump, stand), lerp(0.32, 0.02, stand)];
    J.elbowR = [0.22, lerp(0.18, 1.62 + jump, stand), lerp(0.32, 0.02, stand)];
    J.wristL = [-0.18, lerp(0.04, 1.86 + jump, stand), lerp(0.36, 0.04, stand)];
    J.wristR = [0.18, lerp(0.04, 1.86 + jump, stand), lerp(0.36, 0.04, stand)];

    J.hipL = [-0.12, J.pelvis[1], J.pelvis[2]];
    J.hipR = [0.12, J.pelvis[1], J.pelvis[2]];
    J.kneeL = [-0.13, lerp(0.16, 0.46 + jump, stand), lerp(-0.38, 0.02, stand)];
    J.kneeR = [0.13, lerp(0.16, 0.46 + jump, stand), lerp(-0.38, 0.02, stand)];
    J.ankleL = [-0.13, lerp(0.06, 0.06 + jump, stand), lerp(-0.62, 0, stand)];
    J.ankleR = [0.13, lerp(0.06, 0.06 + jump, stand), lerp(-0.62, 0, stand)];
    J.footL = [-0.13, lerp(0.02, 0.02 + jump, stand), lerp(-0.64, 0.12, stand)];
    J.footR = [0.13, lerp(0.02, 0.02 + jump, stand), lerp(-0.64, 0.12, stand)];
  }

  return { joints: J, equipment, forceVector };
}

// ============================================================================
// COMPONENTE INTERATIVO DE SIMULAÇÃO BIOMECÂNICA 3D / 4D EM 60 FPS
// ============================================================================
function ExerciseVisualDemo({ exercise, compact = false }) {
  const [viewMode, setViewMode] = useState('split'); // 'split' | '3d' | 'anatomy'
  const [cameraAngle, setCameraAngle] = useState({ yaw: 0.62, pitch: 0.22 }); // Perspectiva 3D 45° inicial
  const [autoRotate, setAutoRotate] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [telemetry, setTelemetry] = useState({
    phaseLabel: 'FASE CONCÊNTRICA (FORÇA)',
    emgPercent: 85
  });

  const canvasRef = useRef(null);
  const dragRef = useRef({ active: false, lastX: 0, lastY: 0 });
  const animStateRef = useRef({ time: 0, yaw: 0.62, pitch: 0.22 });

  const resolved = useMemo(() => {
    if (exercise?.primaryZones && exercise?.animationType) {
      return {
        pattern: exercise.animationType,
        primaryZones: exercise.primaryZones,
        secondaryZones: exercise.secondaryZones || [],
        cue: exercise.biomechanicalCue || 'CONTROLE EXCÊNTRICO • AMPLITUDE SEGURA'
      };
    }
    return resolveExerciseBiomechanics(
      exercise?.name || '',
      exercise?.subCategory || '',
      exercise?.category || 'Peito',
      exercise?.primaryMuscles || [],
      exercise?.secondaryMuscles || [],
      exercise?.equipment || ''
    );
  }, [exercise]);

  // Sincroniza ângulo de câmera com a referência do loop 60fps
  useEffect(() => {
    animStateRef.current.yaw = cameraAngle.yaw;
    animStateRef.current.pitch = cameraAngle.pitch;
  }, [cameraAngle]);

  // Loop de Renderização 3D / 4D no HTML5 Canvas (60 FPS)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let lastTimestamp = performance.now();
    let frameCounter = 0;

    const renderLoop = (now) => {
      const dt = Math.min(0.05, (now - lastTimestamp) / 1000);
      lastTimestamp = now;

      if (!isPaused) {
        animStateRef.current.time += dt * speedMultiplier * 1.65;
      }
      if (autoRotate) {
        animStateRef.current.yaw += dt * 0.55;
      }

      // Dimensionamento responsivo com nitidez Retina (devicePixelRatio)
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = Math.max(240, rect.width);
      const height = Math.max(180, rect.height);
      if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Curva 4D de Contração Biomecânica (Concêntrica -> Pico Isométrico -> Excêntrica Controlada)
      const cycle = animStateRef.current.time % (Math.PI * 2);
      const rawSin = (Math.sin(cycle - Math.PI / 2) + 1) / 2; // 0 -> 1 -> 0
      const phase = Math.pow(rawSin, 0.85); // Sustenta um pouco mais no pico de contração
      const isConcentric = Math.cos(cycle - Math.PI / 2) >= 0;

      frameCounter++;
      if (frameCounter % 8 === 0) {
        const emg = Math.round(35 + phase * 65);
        const phaseLabel =
          phase > 0.86
            ? 'PICO DE CONTRAÇÃO MÁXIMA'
            : isConcentric
            ? 'FASE CONCÊNTRICA (FORÇA)'
            : 'FASE EXCÊNTRICA (CONTROLE)';
        setTelemetry({ phaseLabel, emgPercent: emg });
      }

      // 1. Projeção 3D Perspectiva
      const yaw = animStateRef.current.yaw;
      const pitch = animStateRef.current.pitch;
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);

      const camDist = 3.35;
      const fovScale = Math.min(width, height) * 1.18;
      const centerYOffset = 0.82;

      const project3D = (pt) => {
        const x = pt[0];
        const y = pt[1] - centerYOffset;
        const z = pt[2];

        // Rotação Y (Yaw)
        const rx = x * cosY + z * sinY;
        const rz1 = -x * sinY + z * cosY;

        // Rotação X (Pitch)
        const ry = y * cosP - rz1 * sinP;
        const rz = y * sinP + rz1 * cosP;

        const depth = Math.max(0.5, camDist - rz);
        const persp = fovScale / depth;

        return {
          x: width * 0.5 + rx * persp,
          y: height * 0.55 - ry * persp,
          z: rz,
          scale: persp
        };
      };

      // 2. Desenha Plataforma de Piso 3D com Grade Perspectiva
      ctx.lineWidth = 1;
      for (let g = -0.9; g <= 0.91; g += 0.3) {
        const pA = project3D([g, 0, -0.9]);
        const pB = project3D([g, 0, 0.9]);
        ctx.strokeStyle = Math.abs(g) < 0.05 ? 'rgba(16, 185, 129, 0.35)' : 'rgba(63, 63, 70, 0.45)';
        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(pB.x, pB.y);
        ctx.stroke();

        const pC = project3D([-0.9, 0, g]);
        const pD = project3D([0.9, 0, g]);
        ctx.beginPath();
        ctx.moveTo(pC.x, pC.y);
        ctx.lineTo(pD.x, pD.y);
        ctx.stroke();
      }

      // 3. Calcula Articulação e Equipamento 3D do Exercício
      const scene = compute3DBiomechanicalScene(resolved.pattern, phase, exercise?.name);
      const J = scene.joints;

      // Sombra 3D suave projetada no chão
      const shadowCenter = project3D([J.pelvis[0], 0.01, J.pelvis[2]]);
      const shadowGrad = ctx.createRadialGradient(
        shadowCenter.x,
        shadowCenter.y,
        4,
        shadowCenter.x,
        shadowCenter.y,
        48 * (shadowCenter.scale / 100)
      );
      shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
      shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.ellipse(shadowCenter.x, shadowCenter.y, 44, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      // 4. Monta Lista de Primitivas 3D Volumétricas (Equipamentos + Ossos + 23 Grupos Musculares) para Z-Sort
      const renderQueue = [];

      const getMuscleStyle = (zoneIds = []) => {
        const isPrimary = zoneIds.some((id) => resolved.primaryZones.includes(id));
        const isSecondary = !isPrimary && zoneIds.some((id) => resolved.secondaryZones.includes(id));
        return { isPrimary, isSecondary };
      };

      const pushCapsule3D = (p1, p2, radiusMeters, zoneIds = [], customColor = null) => {
        const proj1 = project3D(p1);
        const proj2 = project3D(p2);
        const avgZ = (proj1.z + proj2.z) * 0.5;
        const avgScale = (proj1.scale + proj2.scale) * 0.5;
        const style = getMuscleStyle(zoneIds);

        renderQueue.push({
          kind: 'capsule',
          z: avgZ,
          proj1,
          proj2,
          rPx: Math.max(2.5, radiusMeters * avgScale),
          isPrimary: style.isPrimary,
          isSecondary: style.isSecondary,
          customColor
        });
      };

      const pushSphere3D = (center, radiusMeters, zoneIds = [], customColor = null) => {
        const proj = project3D(center);
        const style = getMuscleStyle(zoneIds);
        renderQueue.push({
          kind: 'sphere',
          z: proj.z,
          proj,
          rPx: Math.max(3, radiusMeters * proj.scale),
          isPrimary: style.isPrimary,
          isSecondary: style.isSecondary,
          customColor
        });
      };

      // Adiciona Equipamentos 3D na fila
      scene.equipment.forEach((eq) => {
        if (eq.type === 'bench') {
          pushCapsule3D(eq.p1, eq.p2, eq.width * 0.35, [], '#27272a');
        } else if (eq.type === 'post') {
          pushCapsule3D(eq.p1, eq.p2, eq.r || 0.03, [], '#3f3f46');
        } else if (eq.type === 'bar') {
          pushCapsule3D(eq.p1, eq.p2, eq.r || 0.018, [], eq.color || '#d4d4d8');
        } else if (eq.type === 'cable') {
          pushCapsule3D(eq.p1, eq.p2, 0.008, [], '#a1a1aa');
        } else if (eq.type === 'plate') {
          pushSphere3D(eq.center, eq.r || 0.12, [], '#10b981');
        } else if (eq.type === 'dumbbell') {
          const c = eq.center;
          pushCapsule3D([c[0] - 0.07, c[1], c[2]], [c[0] + 0.07, c[1], c[2]], 0.018, [], '#e4e4e7');
          pushSphere3D([c[0] - 0.07, c[1], c[2]], 0.048, [], '#10b981');
          pushSphere3D([c[0] + 0.07, c[1], c[2]], 0.048, [], '#10b981');
        } else if (eq.type === 'kettlebell') {
          pushSphere3D(eq.center, eq.r || 0.085, [], '#10b981');
        } else if (eq.type === 'sphere') {
          pushSphere3D(eq.center, eq.r || 0.04, [], eq.color || '#10b981');
        } else if (eq.type === 'box') {
          const [cx, cy, cz] = eq.center;
          const [sx, sy] = eq.size;
          pushCapsule3D([cx - sx * 0.3, cy, cz], [cx + sx * 0.3, cy, cz], sy * 0.45, [], '#27272a');
        }
      });

      // Adiciona Segmentos Anatômicos 3D do Atleta (com mapeamento exato para as 23 Zonas Musculares)
      // Cabeça e Pescoço
      pushSphere3D(J.head, 0.095, [], '#e4e4e7');
      pushCapsule3D(J.neck, J.head, 0.045, ['upper_traps'], '#71717a');

      // Trapézio e Cintura Escapular
      pushCapsule3D(J.shoulderL, J.neck, 0.052, ['upper_traps']);
      pushCapsule3D(J.shoulderR, J.neck, 0.052, ['upper_traps']);

      // Peitoral Superior, Medial e Inferior (Frente do Tronco)
      const chestL = [J.chest[0] - 0.09, J.chest[1] + 0.02, J.chest[2] + 0.03];
      const chestR = [J.chest[0] + 0.09, J.chest[1] + 0.02, J.chest[2] + 0.03];
      pushSphere3D(chestL, 0.078, ['upper_chest', 'mid_chest', 'lower_chest']);
      pushSphere3D(chestR, 0.078, ['upper_chest', 'mid_chest', 'lower_chest']);

      // Costas: Grande Dorsal e Romboides/Trapézio Médio
      const latL = [J.back[0] - 0.11, J.back[1] - 0.02, J.back[2] - 0.02];
      const latR = [J.back[0] + 0.11, J.back[1] - 0.02, J.back[2] - 0.02];
      pushCapsule3D(J.shoulderL, J.waist, 0.068, ['lats', 'mid_traps']);
      pushCapsule3D(J.shoulderR, J.waist, 0.068, ['lats', 'mid_traps']);
      pushSphere3D(latL, 0.072, ['lats', 'mid_traps']);
      pushSphere3D(latR, 0.072, ['lats', 'mid_traps']);

      // Abdômen, Oblíquos e Lombar
      pushCapsule3D(J.chest, J.waist, 0.088, ['upper_abs', 'obliques']);
      pushCapsule3D(J.waist, J.pelvis, 0.085, ['lower_abs', 'obliques']);
      pushCapsule3D(J.back, [J.pelvis[0], J.pelvis[1] + 0.05, J.pelvis[2] - 0.05], 0.068, ['lower_back']);

      // Deltoides (Ombros 3D)
      pushSphere3D(J.shoulderL, 0.068, ['front_delts', 'side_delts', 'rear_delts']);
      pushSphere3D(J.shoulderR, 0.068, ['front_delts', 'side_delts', 'rear_delts']);

      // Braços (Bíceps e Tríceps)
      pushCapsule3D(J.shoulderL, J.elbowL, 0.052, ['biceps', 'triceps']);
      pushCapsule3D(J.shoulderR, J.elbowR, 0.052, ['biceps', 'triceps']);

      // Antebraços e Mãos
      pushCapsule3D(J.elbowL, J.wristL, 0.042, ['forearms']);
      pushCapsule3D(J.elbowR, J.wristR, 0.042, ['forearms']);
      pushSphere3D(J.wristL, 0.036, ['forearms'], '#e4e4e7');
      pushSphere3D(J.wristR, 0.036, ['forearms'], '#e4e4e7');

      // Glúteos (Máximo e Médio)
      const gluteL = [J.hipL[0], J.hipL[1] - 0.02, J.hipL[2] - 0.05];
      const gluteR = [J.hipR[0], J.hipR[1] - 0.02, J.hipR[2] - 0.05];
      pushSphere3D(gluteL, 0.082, ['glutes_max', 'glutes_med']);
      pushSphere3D(gluteR, 0.082, ['glutes_max', 'glutes_med']);

      // Coxas: Quadríceps, Isquiotibiais (Posterior) e Adutores
      pushCapsule3D(J.hipL, J.kneeL, 0.072, ['quads', 'hamstrings', 'adductors']);
      pushCapsule3D(J.hipR, J.kneeR, 0.072, ['quads', 'hamstrings', 'adductors']);
      pushSphere3D(J.kneeL, 0.050, [], '#71717a');
      pushSphere3D(J.kneeR, 0.050, [], '#71717a');

      // Canelas: Panturrilhas e Tibial Anterior
      pushCapsule3D(J.kneeL, J.ankleL, 0.052, ['calves', 'tibialis']);
      pushCapsule3D(J.kneeR, J.ankleR, 0.052, ['calves', 'tibialis']);

      // Pés
      pushCapsule3D(J.ankleL, J.footL, 0.040, [], '#d4d4d8');
      pushCapsule3D(J.ankleR, J.footR, 0.040, [], '#d4d4d8');

      // 5. Ordenação de Profundidade (Z-Buffer Painter's Algorithm)
      renderQueue.sort((a, b) => a.z - b.z);

      // 6. Desenha cada primitiva 3D com sombreamento volumétrico e pulso 4D de contração
      const pulseBoost = 0.55 + phase * 0.45;

      renderQueue.forEach((item) => {
        let baseColor = item.customColor || '#52525b';
        let highlightColor = '#a1a1aa';
        let glowBlur = 0;
        let glowColor = 'transparent';

        if (item.isPrimary) {
          baseColor = phase > 0.65 ? '#059669' : '#10b981';
          highlightColor = '#6ee7b7';
          glowBlur = 12 * pulseBoost;
          glowColor = 'rgba(16, 185, 129, 0.85)';
        } else if (item.isSecondary) {
          baseColor = '#ca8a04';
          highlightColor = '#fde047';
          glowBlur = 6 * pulseBoost;
          glowColor = 'rgba(234, 179, 8, 0.55)';
        }

        ctx.save();
        if (glowBlur > 0) {
          ctx.shadowBlur = glowBlur;
          ctx.shadowColor = glowColor;
        }

        if (item.kind === 'capsule') {
          const { proj1, proj2, rPx } = item;
          ctx.lineCap = 'round';
          // Corpo volumétrico
          ctx.strokeStyle = baseColor;
          ctx.lineWidth = rPx * 2;
          ctx.beginPath();
          ctx.moveTo(proj1.x, proj1.y);
          ctx.lineTo(proj2.x, proj2.y);
          ctx.stroke();

          // Brilho especular 3D no centro do músculo/cilindro
          ctx.shadowBlur = 0;
          ctx.strokeStyle = highlightColor;
          ctx.globalAlpha = item.isPrimary ? 0.65 : 0.25;
          ctx.lineWidth = Math.max(1.5, rPx * 0.65);
          ctx.beginPath();
          ctx.moveTo(proj1.x - rPx * 0.2, proj1.y - rPx * 0.2);
          ctx.lineTo(proj2.x - rPx * 0.2, proj2.y - rPx * 0.2);
          ctx.stroke();
        } else if (item.kind === 'sphere') {
          const { proj, rPx } = item;
          const grad = ctx.createRadialGradient(
            proj.x - rPx * 0.3,
            proj.y - rPx * 0.3,
            rPx * 0.1,
            proj.x,
            proj.y,
            rPx
          );
          grad.addColorStop(0, highlightColor);
          grad.addColorStop(0.55, baseColor);
          grad.addColorStop(1, '#18181b');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, rPx, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // 7. Desenha Vetor 3D de Direção de Força (Seta Biomecânica Neon)
      if (scene.forceVector) {
        const vf = project3D(scene.forceVector.from);
        const vt = project3D(scene.forceVector.to);
        ctx.save();
        ctx.strokeStyle = '#84cc16';
        ctx.fillStyle = '#84cc16';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(vf.x, vf.y);
        ctx.lineTo(vt.x, vt.y);
        ctx.stroke();
        ctx.setLineDash([]);

        const ang = Math.atan2(vt.y - vf.y, vt.x - vf.x);
        ctx.beginPath();
        ctx.moveTo(vt.x, vt.y);
        ctx.lineTo(vt.x - 9 * Math.cos(ang - 0.45), vt.y - 9 * Math.sin(ang - 0.45));
        ctx.lineTo(vt.x - 9 * Math.cos(ang + 0.45), vt.y - 9 * Math.sin(ang + 0.45));
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [resolved, exercise?.name, isPaused, speedMultiplier, autoRotate]);

  // Handlers de rotação 3D com Mouse e Touch
  const handlePointerDown = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragRef.current = { active: true, lastX: clientX, lastY: clientY };
    setAutoRotate(false);
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current.active) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const dx = clientX - dragRef.current.lastX;
    const dy = clientY - dragRef.current.lastY;
    dragRef.current.lastX = clientX;
    dragRef.current.lastY = clientY;

    setCameraAngle((prev) => ({
      yaw: prev.yaw + dx * 0.012,
      pitch: Math.max(-0.35, Math.min(0.85, prev.pitch + dy * 0.008))
    }));
  };

  const handlePointerUp = () => {
    dragRef.current.active = false;
  };

  const primaryZoneNames = resolved.primaryZones.map((z) => MUSCLE_ZONE_LABELS[z]).filter(Boolean);
  const secondaryZoneNames = resolved.secondaryZones.map((z) => MUSCLE_ZONE_LABELS[z]).filter(Boolean);

  return (
    <div className="relative rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden select-none">
      {/* Barra Superior: Modo de Visualização + Telemetria 4D */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-zinc-900/95 border-b border-zinc-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-extrabold text-emerald-400 tracking-wide">
            SIMULADOR 3D/4D INTERATIVO
          </span>
          <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
            EMG: {telemetry.emgPercent}%
          </span>
        </div>

        <div className="flex items-center gap-1 bg-zinc-950 p-0.5 rounded-lg border border-zinc-800">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setViewMode('split');
            }}
            className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition ${
              viewMode === 'split'
                ? 'bg-emerald-500 text-zinc-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            3D + Anatomia
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setViewMode('3d');
            }}
            className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition ${
              viewMode === '3d'
                ? 'bg-emerald-500 text-zinc-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Câmera 3D
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setViewMode('anatomy');
            }}
            className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition ${
              viewMode === 'anatomy'
                ? 'bg-emerald-500 text-zinc-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Mapa 2D
          </button>
        </div>
      </div>

      {/* Área Principal: Canvas 3D/4D + Mapa Anatômico */}
      <div
        className={`relative z-10 grid ${
          viewMode === 'split'
            ? 'grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800/80'
            : 'grid-cols-1'
        } items-center`}
      >
        {/* PAINEL 1: MOTOR 3D/4D INTERATIVO COM ROTAÇÃO 360° */}
        {(viewMode === 'split' || viewMode === '3d') && (
          <div className={`relative flex flex-col justify-between ${compact ? 'h-56' : 'h-72'} bg-zinc-950`}>
            {/* HUD 4D Superior (Fase Biomecânica + Dica) */}
            <div className="absolute top-2 inset-x-2.5 z-20 flex items-center justify-between pointer-events-none">
              <span className="px-2 py-0.5 rounded-md bg-zinc-900/90 border border-emerald-500/40 text-[10px] font-extrabold text-emerald-300 shadow">
                {telemetry.phaseLabel}
              </span>
              <span className="text-[10px] text-zinc-400 bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800">
                Arraste p/ girar 360°
              </span>
            </div>

            {/* Canvas 3D */}
            <canvas
              ref={canvasRef}
              onMouseDown={handlePointerDown}
              onMouseMove={handlePointerMove}
              onMouseUp={handlePointerUp}
              onMouseLeave={handlePointerUp}
              onTouchStart={handlePointerDown}
              onTouchMove={handlePointerMove}
              onTouchEnd={handlePointerUp}
              className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
            />

            {/* Controles Interativos de Câmera 3D e Velocidade 4D */}
            <div className="absolute bottom-2 inset-x-2 z-20 flex flex-wrap items-center justify-between gap-1 bg-zinc-900/90 backdrop-blur-md border border-zinc-800/90 rounded-xl px-2 py-1 text-[10px]">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAutoRotate(false);
                    setCameraAngle({ yaw: 0.65, pitch: 0.22 });
                  }}
                  className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-zinc-300 font-bold transition"
                  title="Vista 3D em Perspectiva"
                >
                  3D
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAutoRotate(false);
                    setCameraAngle({ yaw: 1.57, pitch: 0.12 });
                  }}
                  className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-zinc-300 font-bold transition"
                  title="Vista de Perfil / Lateral"
                >
                  Lateral
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAutoRotate(false);
                    setCameraAngle({ yaw: 0, pitch: 0.15 });
                  }}
                  className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-zinc-300 font-bold transition"
                  title="Vista Frontal"
                >
                  Frente
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAutoRotate(false);
                    setCameraAngle({ yaw: 3.14, pitch: 0.18 });
                  }}
                  className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-zinc-300 font-bold transition"
                  title="Vista Posterior (Costas)"
                >
                  Costas
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAutoRotate((prev) => !prev);
                  }}
                  className={`px-1.5 py-0.5 rounded font-bold transition ${
                    autoRotate
                      ? 'bg-emerald-500 text-zinc-950'
                      : 'bg-zinc-800 text-emerald-400 hover:bg-zinc-700'
                  }`}
                  title="Giro Automático 360°"
                >
                  360°
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSpeedMultiplier((s) => (s === 1 ? 0.45 : 1));
                  }}
                  className={`px-1.5 py-0.5 rounded font-bold transition ${
                    speedMultiplier < 1
                      ? 'bg-lime-500 text-zinc-950'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                  title="Alternar Câmera Lenta (0.5x)"
                >
                  {speedMultiplier < 1 ? '0.5x' : '1x'}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPaused((p) => !p);
                  }}
                  className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-emerald-400 font-bold"
                  title={isPaused ? 'Retomar Movimento' : 'Pausar Movimento'}
                >
                  {isPaused ? '▶' : '⏸'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PAINEL 2: MAPA ANATÔMICO DE 23 ZONAS MUSCULARES (MOSTRA EXATAMENTE ONDE PEGA) */}
        {(viewMode === 'split' || viewMode === 'anatomy') && (
          <div className={`flex flex-col items-center justify-center ${compact ? 'h-56' : 'h-72'} p-2 bg-zinc-950/60`}>
            <AnatomicalBodyMapSVG
              primaryZones={resolved.primaryZones}
              secondaryZones={resolved.secondaryZones}
            />
          </div>
        )}
      </div>

      {/* Rodapé Detalhado: Lista Exata de Músculos Principais e Secundários Ativados */}
      <div className="relative z-10 px-3.5 py-2.5 bg-zinc-900/95 border-t border-zinc-800/90 space-y-1.5 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">
              Pega Principal:
            </span>
            {primaryZoneNames.map((mName) => (
              <span
                key={mName}
                className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-extrabold text-[11px]"
              >
                ● {mName}
              </span>
            ))}
          </div>
          <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 font-semibold text-[11px]">
            {exercise?.equipment}
          </span>
        </div>

        {secondaryZoneNames.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-zinc-500">
              Auxiliares (Sinergistas):
            </span>
            {secondaryZoneNames.map((sName) => (
              <span
                key={sName}
                className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold text-[10px]"
              >
                ○ {sName}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// GERADORES DE ESTRUTURA DE DADOS INICIAL E TREINO DE EXEMPLO
// ============================================================================
const generateId = () => `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

const createEmptySchedule = () => {
  const schedule = {};
  DAYS_OF_WEEK.forEach((day) => {
    schedule[day.id] = {
      categories: [], // máx 3 categorias por dia
      exercisesByCategory: {} // { 'Peito': [ { id, name, sets, reps, weight, rest, notes, completed } ] }
    };
  });
  return schedule;
};

const createSampleSchedule = () => {
  const schedule = createEmptySchedule();

  // Segunda-feira: Peito e Ombro e Tríceps (3 categorias)
  schedule.segunda = {
    categories: ['Peito', 'Ombro', 'Tríceps'],
    exercisesByCategory: {
      Peito: [
        { id: generateId(), name: 'Supino Reto com Halteres', sets: 4, reps: '10-12', weight: 32, rest: 60, notes: 'Cadência controlada na descida', completed: true },
        { id: generateId(), name: 'Supino Inclinado na Máquina', sets: 4, reps: '10', weight: 60, rest: 60, notes: 'Foco na porção superior do peitoral', completed: true },
        { id: generateId(), name: 'Crucifixo no Crossover', sets: 3, reps: '12-15', weight: 20, rest: 45, notes: 'Pico de contração de 2s', completed: false }
      ],
      Ombro: [
        { id: generateId(), name: 'Desenvolvimento com Halteres', sets: 4, reps: '10', weight: 22, rest: 60, notes: 'Costas bem apoiadas no banco', completed: false },
        { id: generateId(), name: 'Elevação Lateral com Halteres', sets: 4, reps: '12-15', weight: 12, rest: 45, notes: 'Sem impulso do tronco', completed: false }
      ],
      Tríceps: [
        { id: generateId(), name: 'Tríceps Corda na Polia', sets: 4, reps: '12', weight: 25, rest: 45, notes: 'Abrir bem a corda no final', completed: false },
        { id: generateId(), name: 'Tríceps Testa com Barra W', sets: 3, reps: '10-12', weight: 24, rest: 60, notes: 'Cotovelos fechados', completed: false }
      ]
    }
  };

  // Terça-feira: Costa e Bíceps
  schedule.terca = {
    categories: ['Costa', 'Bíceps'],
    exercisesByCategory: {
      Costa: [
        { id: generateId(), name: 'Puxada Frontal Aberta (Pulley)', sets: 4, reps: '10-12', weight: 65, rest: 60, notes: 'Estufar o peito e puxar até o queixo', completed: false },
        { id: generateId(), name: 'Remada Curvada Pronada', sets: 4, reps: '8-10', weight: 60, rest: 75, notes: 'Coluna neutra o tempo todo', completed: false },
        { id: generateId(), name: 'Remada Baixa com Triângulo', sets: 3, reps: '12', weight: 55, rest: 60, notes: 'Alongar bem as escápulas', completed: false }
      ],
      Bíceps: [
        { id: generateId(), name: 'Rosca Direta com Barra W', sets: 4, reps: '10', weight: 28, rest: 60, notes: 'Evitar balanço lombar', completed: false },
        { id: generateId(), name: 'Rosca Martelo com Halteres', sets: 3, reps: '12', weight: 16, rest: 45, notes: 'Foco em braquial e antebraço', completed: false }
      ]
    }
  };

  // Quarta-feira: Perna
  schedule.quarta = {
    categories: ['Perna'],
    exercisesByCategory: {
      Perna: [
        { id: generateId(), name: 'Agachamento Livre com Barra', sets: 4, reps: '8-10', weight: 80, rest: 90, notes: 'Amplitude máxima com segurança', completed: false },
        { id: generateId(), name: 'Leg Press 45°', sets: 4, reps: '12', weight: 200, rest: 75, notes: 'Não travar os joelhos no topo', completed: false },
        { id: generateId(), name: 'Cadeira Extensora', sets: 4, reps: '12-15', weight: 65, rest: 60, notes: 'Segurar 1s no topo', completed: false },
        { id: generateId(), name: 'Mesa Flexora', sets: 4, reps: '12', weight: 50, rest: 60, notes: 'Quadril firme no banco', completed: false }
      ]
    }
  };

  // Quinta-feira: Peito e Ombro
  schedule.quinta = {
    categories: ['Peito', 'Ombro'],
    exercisesByCategory: {
      Peito: [
        { id: generateId(), name: 'Supino Inclinado com Halteres', sets: 4, reps: '10', weight: 30, rest: 60, notes: 'Descer até a linha do peitoral', completed: false },
        { id: generateId(), name: 'Peck Deck (Voador)', sets: 4, reps: '12', weight: 55, rest: 45, notes: 'Movimento amplo e controlado', completed: false }
      ],
      Ombro: [
        { id: generateId(), name: 'Elevação Lateral na Polia', sets: 4, reps: '12', weight: 10, rest: 45, notes: 'Tensão constante no deltoide', completed: false },
        { id: generateId(), name: 'Crucifixo Inverso para Posterior', sets: 4, reps: '15', weight: 45, rest: 45, notes: 'Foco em deltoide posterior', completed: false }
      ]
    }
  };

  // Sexta-feira: Costa, Bíceps e Tríceps
  schedule.sexta = {
    categories: ['Costa', 'Bíceps', 'Tríceps'],
    exercisesByCategory: {
      Costa: [
        { id: generateId(), name: 'Pulldown na Polia com Corda', sets: 4, reps: '12-15', weight: 35, rest: 45, notes: 'Ativação dos dorsais', completed: false },
        { id: generateId(), name: 'Remada Unilateral (Serrote)', sets: 4, reps: '10', weight: 32, rest: 60, notes: 'Puxar em direção ao quadril', completed: false }
      ],
      Bíceps: [
        { id: generateId(), name: 'Rosca Scott na Máquina', sets: 4, reps: '10-12', weight: 35, rest: 60, notes: 'Extensão quase completa', completed: false }
      ],
      Tríceps: [
        { id: generateId(), name: 'Tríceps Francês com Halter', sets: 4, reps: '10-12', weight: 26, rest: 60, notes: 'Alongar bem a cabeça longa', completed: false }
      ]
    }
  };

  // Sábado: Perna
  schedule.sabado = {
    categories: ['Perna'],
    exercisesByCategory: {
      Perna: [
        { id: generateId(), name: 'Stiff com Barra', sets: 4, reps: '10-12', weight: 70, rest: 75, notes: 'Foco em posteriores e glúteos', completed: false },
        { id: generateId(), name: 'Afundo Búlgaro com Halteres', sets: 3, reps: '10 cada', weight: 18, rest: 60, notes: 'Equilíbrio e profundidade', completed: false },
        { id: generateId(), name: 'Panturrilha Sentado', sets: 4, reps: '15-20', weight: 45, rest: 45, notes: 'Pausa de 2s no pico', completed: false }
      ]
    }
  };

  return schedule;
};

const createNewUserObject = (name, withSample = true) => {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    name: name.trim(),
    createdAt: now,
    updatedAt: now,
    schedule: withSample ? createSampleSchedule() : createEmptySchedule(),
    history: withSample
      ? [
          {
            id: generateId(),
            date: new Date(Date.now() - 86400000 * 2).toISOString(),
            dayId: 'segunda',
            dayLabel: 'Segunda-feira',
            categories: ['Peito', 'Ombro', 'Tríceps'],
            completedCount: 7,
            totalCount: 7,
            totalVolumeKg: 4860,
            notes: 'Treino intenso! Aumentei 2kg no supino reto.'
          }
        ]
      : [],
    weightLogs: withSample
      ? [
          { id: generateId(), exerciseName: 'Supino Reto com Halteres', category: 'Peito', oldWeight: 30, newWeight: 32, date: new Date(Date.now() - 86400000 * 2).toISOString() },
          { id: generateId(), exerciseName: 'Agachamento Livre com Barra', category: 'Perna', oldWeight: 75, newWeight: 80, date: new Date(Date.now() - 86400000 * 5).toISOString() }
        ]
      : []
  };
};

// Retorna o id do dia da semana atual
const getCurrentDayId = () => {
  const dayIndex = new Date().getDay(); // 0 = Domingo, 1 = Segunda...
  const map = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
  return map[dayIndex] || 'segunda';
};

// Emite um bip suave usando Web Audio API quando o descanso termina
const playBeepSound = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {
    // Ignorar caso o navegador bloqueie áudio automático
  }
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
export default function App() {
  // Carregamento inicial do LocalStorage
  const [store, setStore] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.users)) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Erro ao ler LocalStorage:', err);
    }
    return {
      currentUserId: null,
      users: []
    };
  });

  // Persistência imediata no LocalStorage sempre que "store" mudar
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (err) {
      console.error('Erro ao salvar no LocalStorage:', err);
    }
  }, [store]);

  // Navegação principal ('treinos' | 'guia' | 'progresso' | 'gerenciamento' | 'backup')
  const [activeTab, setActiveTab] = useState('treinos');
  const [selectedDayId, setSelectedDayId] = useState(getCurrentDayId());
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // Filtros da nova aba "Guia de Exercícios"
  const [guideCategoryFilter, setGuideCategoryFilter] = useState('Todos');
  const [guideSearchQuery, setGuideSearchQuery] = useState('');
  const [guideDetailModal, setGuideDetailModal] = useState(null); // objeto do EXERCISE_CATALOG
  const [quickAddDayId, setQuickAddDayId] = useState(getCurrentDayId());

  // Estado para tela de login/identificação
  const [newUserName, setNewUserName] = useState('');
  const [loadSampleOnCreate, setLoadSampleOnCreate] = useState(true);

  // Toast de feedback visual (substitui qualquer alert)
  const [toast, setToast] = useState(null);
  const triggerToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
  };
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  // Cronômetro de Descanso Interativo
  const [restTimer, setRestTimer] = useState({
    active: false,
    running: false,
    secondsLeft: 60,
    totalSeconds: 60,
    exerciseName: ''
  });

  useEffect(() => {
    if (!restTimer.active || !restTimer.running) return;
    if (restTimer.secondsLeft <= 0) {
      playBeepSound();
      setRestTimer((prev) => ({ ...prev, running: false }));
      triggerToast(`Descanso finalizado! Hora da próxima série de ${restTimer.exerciseName || 'exercício'}.`, 'success');
      return;
    }
    const interval = setInterval(() => {
      setRestTimer((prev) => ({
        ...prev,
        secondsLeft: Math.max(0, prev.secondsLeft - 1)
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [restTimer.active, restTimer.running, restTimer.secondsLeft, restTimer.exerciseName]);

  const startRestTimer = (seconds, exerciseName) => {
    const validSeconds = Math.max(5, Number(seconds) || 60);
    setRestTimer({
      active: true,
      running: true,
      secondsLeft: validSeconds,
      totalSeconds: validSeconds,
      exerciseName: exerciseName || 'Exercício'
    });
  };

  // Modal de Adicionar/Editar Exercício
  const [exerciseModal, setExerciseModal] = useState({
    open: false,
    mode: 'add', // 'add' | 'edit'
    targetUserId: null,
    dayId: 'segunda',
    category: 'Peito',
    exercise: {
      id: '',
      name: '',
      sets: 4,
      reps: '10-12',
      weight: 20,
      rest: 60,
      notes: ''
    }
  });

  // Modal de Confirmação Customizado (sem confirm() nativo)
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    description: '',
    confirmLabel: 'Confirmar',
    danger: true,
    onConfirm: null
  });

  // Painel de Gerenciamento: Usuário inspecionado
  const [managedUserId, setManagedUserId] = useState(null);
  const [managedDayId, setManagedDayId] = useState('segunda');
  const [renamingUser, setRenamingUser] = useState({ id: null, name: '' });
  const [adminNewUserName, setAdminNewUserName] = useState('');
  const [adminNewUserSample, setAdminNewUserSample] = useState(true);

  // Usuário atual ativo
  const currentUser = useMemo(() => {
    return store.users.find((u) => u.id === store.currentUserId) || null;
  }, [store.users, store.currentUserId]);

  // Lista filtrada do Guia de Exercícios
  const filteredCatalog = useMemo(() => {
    return EXERCISE_CATALOG.filter((item) => {
      const matchesCategory =
        guideCategoryFilter === 'Todos' ||
        item.subCategory === guideCategoryFilter ||
        item.category === guideCategoryFilter;
      const q = guideSearchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.subCategory.toLowerCase().includes(q) ||
        item.purpose.toLowerCase().includes(q) ||
        item.primaryMuscles.some((m) => m.toLowerCase().includes(q)) ||
        item.equipment.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [guideCategoryFilter, guideSearchQuery]);

  // Busca dados da enciclopédia para um exercício qualquer pelo nome ou categoria
  const findGuideExercise = (exerciseName, categoryId) => {
    if (!exerciseName) return null;
    const norm = exerciseName.trim().toLowerCase();
    const exact = EXERCISE_CATALOG.find((item) => item.name.toLowerCase() === norm);
    if (exact) return exact;
    const partial = EXERCISE_CATALOG.find(
      (item) =>
        norm.includes(item.name.toLowerCase()) ||
        item.name.toLowerCase().includes(norm)
    );
    if (partial) return partial;

    // Caso o usuário tenha cadastrado um exercício com nome personalizado, gera a biomecânica exata na hora
    const dynamicBio = resolveExerciseBiomechanics(
      exerciseName,
      categoryId,
      categoryId,
      [categoryId],
      [],
      'Equipamento Livre / Máquina'
    );
    return {
      id: `custom_${norm}`,
      name: exerciseName,
      subCategory: categoryId,
      category: categoryId || 'Peito',
      equipment: 'Equipamento da Academia',
      level: 'Personalizado',
      animationType: dynamicBio.pattern,
      primaryZones: dynamicBio.primaryZones,
      secondaryZones: dynamicBio.secondaryZones,
      biomechanicalCue: dynamicBio.cue,
      defaultSets: 4,
      defaultReps: '10-12',
      defaultWeight: 20,
      defaultRest: 60,
      primaryMuscles: dynamicBio.primaryZones.map((z) => MUSCLE_ZONE_LABELS[z]).filter(Boolean),
      secondaryMuscles: dynamicBio.secondaryZones.map((z) => MUSCLE_ZONE_LABELS[z]).filter(Boolean),
      purpose: `Exercício focado no fortalecimento e hipertrofia de ${dynamicBio.primaryZones
        .map((z) => MUSCLE_ZONE_LABELS[z])
        .filter(Boolean)
        .join(' e ')}.`,
      executionSteps: dynamicBio.steps,
      proTip: dynamicBio.cue
    };
  };

  // Adiciona um exercício do Guia diretamente ao dia escolhido do usuário ativo
  const handleQuickAddFromGuide = (catalogItem, targetDayId) => {
    if (!currentUser || !catalogItem) return;
    const dayObj = currentUser.schedule[targetDayId] || { categories: [], exercisesByCategory: {} };
    const hasCategory = dayObj.categories.includes(catalogItem.category);

    if (!hasCategory && dayObj.categories.length >= 3) {
      const dayLabel = DAYS_OF_WEEK.find((d) => d.id === targetDayId)?.label || targetDayId;
      triggerToast(
        `A ${dayLabel} já possui 3 categorias ativas (${dayObj.categories.join(', ')}). Escolha outro dia ou remova uma categoria!`,
        'warning'
      );
      return;
    }

    updateUserById(currentUser.id, (user) => {
      const currDay = user.schedule[targetDayId] || { categories: [], exercisesByCategory: {} };
      const nextCategories = currDay.categories.includes(catalogItem.category)
        ? currDay.categories
        : [...currDay.categories, catalogItem.category];
      const existingList = currDay.exercisesByCategory?.[catalogItem.category] || [];

      const createdEx = {
        id: generateId(),
        name: catalogItem.name,
        sets: catalogItem.defaultSets || 4,
        reps: catalogItem.defaultReps || '10-12',
        weight: catalogItem.defaultWeight ?? 20,
        rest: catalogItem.defaultRest || 60,
        notes: catalogItem.proTip || '',
        completed: false
      };

      return {
        ...user,
        schedule: {
          ...user.schedule,
          [targetDayId]: {
            ...currDay,
            categories: nextCategories,
            exercisesByCategory: {
              ...currDay.exercisesByCategory,
              [catalogItem.category]: [...existingList, createdEx]
            }
          }
        }
      };
    });

    const dayLabel = DAYS_OF_WEEK.find((d) => d.id === targetDayId)?.label || targetDayId;
    triggerToast(`"${catalogItem.name}" adicionado na ${dayLabel} (${catalogItem.category})!`, 'success');
  };

  // Sincronizar managedUserId quando usuários mudam
  useEffect(() => {
    if (store.users.length > 0 && (!managedUserId || !store.users.some((u) => u.id === managedUserId))) {
      setManagedUserId(store.currentUserId || store.users[0].id);
    }
  }, [store.users, store.currentUserId, managedUserId]);

  // ============================================================================
  // FUNÇÕES DE GERENCIAMENTO DE USUÁRIOS
  // ============================================================================
  const handleCreateOrSelectUser = (e) => {
    if (e) e.preventDefault();
    const trimmed = newUserName.trim();
    if (!trimmed) {
      triggerToast('Por favor, digite seu nome para continuar.', 'error');
      return;
    }

    // Verifica se já existe um usuário com esse exato nome (case-insensitive)
    const existing = store.users.find((u) => u.name.toLowerCase() === trimmed.toLowerCase());
    if (existing) {
      setStore((prev) => ({
        ...prev,
        currentUserId: existing.id
      }));
      setNewUserName('');
      setShowWelcomeModal(false);
      triggerToast(`Bem-vindo de volta, ${existing.name}!`, 'success');
      return;
    }

    const created = createNewUserObject(trimmed, loadSampleOnCreate);
    setStore((prev) => ({
      currentUserId: created.id,
      users: [...prev.users, created]
    }));
    setManagedUserId(created.id);
    setNewUserName('');
    setShowWelcomeModal(false);
    triggerToast(`Perfil "${created.name}" criado com sucesso!`, 'success');
  };

  const handleSelectExistingUser = (userId) => {
    const found = store.users.find((u) => u.id === userId);
    if (!found) return;
    setStore((prev) => ({
      ...prev,
      currentUserId: found.id
    }));
    setShowWelcomeModal(false);
    triggerToast(`Acessando os treinos de ${found.name}.`, 'success');
  };

  const updateUserById = (userId, updaterFn) => {
    setStore((prev) => ({
      ...prev,
      users: prev.users.map((u) => {
        if (u.id !== userId) return u;
        const updated = updaterFn(u);
        return { ...updated, updatedAt: new Date().toISOString() };
      })
    }));
  };

  // ============================================================================
  // FUNÇÕES DE CATEGORIAS DO DIA (REGRA DE 1 A 3 CATEGORIAS POR DIA)
  // ============================================================================
  const toggleDayCategory = (targetUserId, dayId, categoryId) => {
    const targetUser = store.users.find((u) => u.id === targetUserId);
    if (!targetUser) return;

    const dayData = targetUser.schedule[dayId] || { categories: [], exercisesByCategory: {} };
    const exists = dayData.categories.includes(categoryId);

    if (!exists && dayData.categories.length >= 3) {
      triggerToast('Limite atingido: Cada dia pode ter no máximo 3 categorias de treino!', 'warning');
      return;
    }

    updateUserById(targetUserId, (user) => {
      const currentDay = user.schedule[dayId] || { categories: [], exercisesByCategory: {} };
      const nextCategories = exists
        ? currentDay.categories.filter((c) => c !== categoryId)
        : [...currentDay.categories, categoryId];

      const nextExercisesByCat = { ...currentDay.exercisesByCategory };
      if (!exists && !nextExercisesByCat[categoryId]) {
        nextExercisesByCat[categoryId] = [];
      }

      return {
        ...user,
        schedule: {
          ...user.schedule,
          [dayId]: {
            ...currentDay,
            categories: nextCategories,
            exercisesByCategory: nextExercisesByCat
          }
        }
      };
    });

    if (!exists) {
      triggerToast(`Categoria "${categoryId}" adicionada na ${DAYS_OF_WEEK.find((d) => d.id === dayId)?.label}.`, 'success');
    } else {
      triggerToast(`Categoria "${categoryId}" removida da ${DAYS_OF_WEEK.find((d) => d.id === dayId)?.label}.`, 'info');
    }
  };

  // ============================================================================
  // FUNÇÕES DE EXERCÍCIOS (ADICIONAR, EDITAR, EXCLUIR, REORGANIZAR, CONCLUIR)
  // ============================================================================
  const openAddExerciseModal = (targetUserId, dayId, category) => {
    setExerciseModal({
      open: true,
      mode: 'add',
      targetUserId,
      dayId,
      category,
      exercise: {
        id: '',
        name: '',
        sets: 4,
        reps: '10-12',
        weight: 20,
        rest: 60,
        notes: ''
      }
    });
  };

  const openEditExerciseModal = (targetUserId, dayId, category, exercise) => {
    setExerciseModal({
      open: true,
      mode: 'edit',
      targetUserId,
      dayId,
      category,
      exercise: { ...exercise }
    });
  };

  const handleSaveExerciseModal = (e) => {
    e.preventDefault();
    const { mode, targetUserId, dayId, category, exercise } = exerciseModal;
    const trimmedName = exercise.name.trim();
    if (!trimmedName) {
      triggerToast('Informe o nome do exercício.', 'error');
      return;
    }

    updateUserById(targetUserId, (user) => {
      const dayData = user.schedule[dayId] || { categories: [], exercisesByCategory: {} };
      const categories = dayData.categories.includes(category)
        ? dayData.categories
        : dayData.categories.length < 3
        ? [...dayData.categories, category]
        : dayData.categories;

      const list = dayData.exercisesByCategory[category] || [];
      let nextList = [];
      let nextWeightLogs = [...(user.weightLogs || [])];

      if (mode === 'add') {
        const newEx = {
          id: generateId(),
          name: trimmedName,
          sets: Math.max(1, Number(exercise.sets) || 1),
          reps: String(exercise.reps || '10'),
          weight: Number(exercise.weight) || 0,
          rest: Math.max(0, Number(exercise.rest) || 60),
          notes: String(exercise.notes || '').trim(),
          completed: false
        };
        nextList = [...list, newEx];
      } else {
        nextList = list.map((item) => {
          if (item.id !== exercise.id) return item;
          const oldWeight = Number(item.weight) || 0;
          const newWeight = Number(exercise.weight) || 0;
          if (oldWeight !== newWeight && newWeight > 0) {
            nextWeightLogs.unshift({
              id: generateId(),
              exerciseName: trimmedName,
              category,
              oldWeight,
              newWeight,
              date: new Date().toISOString()
            });
          }
          return {
            ...item,
            name: trimmedName,
            sets: Math.max(1, Number(exercise.sets) || 1),
            reps: String(exercise.reps || '10'),
            weight: newWeight,
            rest: Math.max(0, Number(exercise.rest) || 60),
            notes: String(exercise.notes || '').trim()
          };
        });
      }

      return {
        ...user,
        weightLogs: nextWeightLogs.slice(0, 40),
        schedule: {
          ...user.schedule,
          [dayId]: {
            ...dayData,
            categories,
            exercisesByCategory: {
              ...dayData.exercisesByCategory,
              [category]: nextList
            }
          }
        }
      };
    });

    setExerciseModal((prev) => ({ ...prev, open: false }));
    triggerToast(
      mode === 'add' ? `Exercício "${trimmedName}" adicionado!` : `Exercício "${trimmedName}" atualizado!`,
      'success'
    );
  };

  const handleDeleteExercise = (targetUserId, dayId, category, exerciseId, exerciseName) => {
    setConfirmDialog({
      open: true,
      title: 'Excluir Exercício',
      description: `Tem certeza que deseja excluir "${exerciseName}" de ${category}?`,
      confirmLabel: 'Sim, Excluir',
      danger: true,
      onConfirm: () => {
        updateUserById(targetUserId, (user) => {
          const dayData = user.schedule[dayId];
          if (!dayData) return user;
          const list = dayData.exercisesByCategory[category] || [];
          return {
            ...user,
            schedule: {
              ...user.schedule,
              [dayId]: {
                ...dayData,
                exercisesByCategory: {
                  ...dayData.exercisesByCategory,
                  [category]: list.filter((item) => item.id !== exerciseId)
                }
              }
            }
          };
        });
        triggerToast(`Exercício "${exerciseName}" removido.`, 'info');
      }
    });
  };

  const handleMoveExercise = (targetUserId, dayId, category, index, direction) => {
    updateUserById(targetUserId, (user) => {
      const dayData = user.schedule[dayId];
      if (!dayData) return user;
      const list = [...(dayData.exercisesByCategory[category] || [])];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return user;

      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;

      return {
        ...user,
        schedule: {
          ...user.schedule,
          [dayId]: {
            ...dayData,
            exercisesByCategory: {
              ...dayData.exercisesByCategory,
              [category]: list
            }
          }
        }
      };
    });
  };

  const handleToggleExerciseComplete = (targetUserId, dayId, category, exerciseId) => {
    updateUserById(targetUserId, (user) => {
      const dayData = user.schedule[dayId];
      if (!dayData) return user;
      const list = dayData.exercisesByCategory[category] || [];
      return {
        ...user,
        schedule: {
          ...user.schedule,
          [dayId]: {
            ...dayData,
            exercisesByCategory: {
              ...dayData.exercisesByCategory,
              [category]: list.map((item) =>
                item.id === exerciseId ? { ...item, completed: !item.completed } : item
              )
            }
          }
        }
      };
    });
  };

  const handleMarkAllDayCompleted = (targetUserId, dayId, completedValue) => {
    updateUserById(targetUserId, (user) => {
      const dayData = user.schedule[dayId];
      if (!dayData) return user;
      const nextByCat = { ...dayData.exercisesByCategory };
      dayData.categories.forEach((cat) => {
        nextByCat[cat] = (nextByCat[cat] || []).map((ex) => ({
          ...ex,
          completed: completedValue
        }));
      });
      return {
        ...user,
        schedule: {
          ...user.schedule,
          [dayId]: {
            ...dayData,
            exercisesByCategory: nextByCat
          }
        }
      };
    });
    triggerToast(
      completedValue ? 'Todos os exercícios do dia foram marcados como concluídos!' : 'Marcações do dia desmarcadas.',
      'success'
    );
  };

  // ============================================================================
  // CÁLCULO DE MÉTRICAS E BARRAS DE PROGRESSO (DIÁRIA E SEMANAL)
  // ============================================================================
  const calculateUserStats = (user, activeDayId = selectedDayId) => {
    if (!user) {
      return {
        dailyTotal: 0,
        dailyCompleted: 0,
        dailyPercent: 0,
        weeklyTotal: 0,
        weeklyCompleted: 0,
        weeklyPercent: 0,
        activeDaysCount: 0,
        categoryBreakdown: {}
      };
    }

    let dailyTotal = 0;
    let dailyCompleted = 0;
    let weeklyTotal = 0;
    let weeklyCompleted = 0;
    let activeDaysCount = 0;
    const categoryBreakdown = {};
    CATEGORIES.forEach((c) => {
      categoryBreakdown[c.id] = { total: 0, completed: 0 };
    });

    DAYS_OF_WEEK.forEach((day) => {
      const dayObj = user.schedule?.[day.id];
      if (!dayObj || !Array.isArray(dayObj.categories)) return;
      if (dayObj.categories.length > 0) activeDaysCount += 1;

      dayObj.categories.forEach((cat) => {
        const list = dayObj.exercisesByCategory?.[cat] || [];
        list.forEach((ex) => {
          weeklyTotal += 1;
          if (ex.completed) weeklyCompleted += 1;

          if (categoryBreakdown[cat]) {
            categoryBreakdown[cat].total += 1;
            if (ex.completed) categoryBreakdown[cat].completed += 1;
          }

          if (day.id === activeDayId) {
            dailyTotal += 1;
            if (ex.completed) dailyCompleted += 1;
          }
        });
      });
    });

    const dailyPercent = dailyTotal > 0 ? Math.round((dailyCompleted / dailyTotal) * 100) : 0;
    const weeklyPercent = weeklyTotal > 0 ? Math.round((weeklyCompleted / weeklyTotal) * 100) : 0;

    return {
      dailyTotal,
      dailyCompleted,
      dailyPercent,
      weeklyTotal,
      weeklyCompleted,
      weeklyPercent,
      activeDaysCount,
      categoryBreakdown
    };
  };

  const userStats = useMemo(
    () => calculateUserStats(currentUser, selectedDayId),
    [currentUser, selectedDayId]
  );

  // ============================================================================
  // HISTÓRICO E RESET DE SEMANA
  // ============================================================================
  const handleSaveDayWorkoutToHistory = (dayIdToSave = selectedDayId) => {
    if (!currentUser) return;
    const dayObj = currentUser.schedule[dayIdToSave];
    const dayLabel = DAYS_OF_WEEK.find((d) => d.id === dayIdToSave)?.label || dayIdToSave;

    if (!dayObj || dayObj.categories.length === 0) {
      triggerToast(`Não há categorias configuradas na ${dayLabel} para salvar no histórico.`, 'warning');
      return;
    }

    let totalCount = 0;
    let completedCount = 0;
    let totalVolumeKg = 0;

    dayObj.categories.forEach((cat) => {
      const exercises = dayObj.exercisesByCategory[cat] || [];
      exercises.forEach((ex) => {
        totalCount += 1;
        if (ex.completed) {
          completedCount += 1;
          const parsedReps = parseInt(String(ex.reps).split('-')[0], 10) || 10;
          const sets = Number(ex.sets) || 1;
          const weight = Number(ex.weight) || 0;
          totalVolumeKg += sets * parsedReps * weight;
        }
      });
    });

    if (totalCount === 0) {
      triggerToast(`Adicione exercícios na ${dayLabel} antes de registrar o treino.`, 'warning');
      return;
    }

    const newHistoryEntry = {
      id: generateId(),
      date: new Date().toISOString(),
      dayId: dayIdToSave,
      dayLabel,
      categories: [...dayObj.categories],
      completedCount: completedCount > 0 ? completedCount : totalCount,
      totalCount,
      totalVolumeKg: Math.round(totalVolumeKg),
      notes: completedCount === totalCount
        ? 'Treino 100% concluído!'
        : `Treino registrado (${completedCount}/${totalCount} exercícios marcados).`
    };

    updateUserById(currentUser.id, (user) => ({
      ...user,
      history: [newHistoryEntry, ...(user.history || [])]
    }));

    triggerToast(`Treino de ${dayLabel} salvo no Histórico com sucesso!`, 'success');
  };

  const handleResetWeeklyProgress = () => {
    if (!currentUser) return;
    setConfirmDialog({
      open: true,
      title: 'Resetar Marcações da Semana',
      description: 'Isso desmarcará todos os exercícios concluídos de Segunda a Domingo para você iniciar uma nova semana, mantendo todos os seus exercícios, séries e cargas salvos.',
      confirmLabel: 'Resetar Semana',
      danger: false,
      onConfirm: () => {
        updateUserById(currentUser.id, (user) => {
          const nextSchedule = {};
          DAYS_OF_WEEK.forEach((d) => {
            const dayData = user.schedule[d.id] || { categories: [], exercisesByCategory: {} };
            const nextExercises = {};
            Object.keys(dayData.exercisesByCategory || {}).forEach((cat) => {
              nextExercises[cat] = (dayData.exercisesByCategory[cat] || []).map((ex) => ({
                ...ex,
                completed: false
              }));
            });
            nextSchedule[d.id] = {
              ...dayData,
              exercisesByCategory: nextExercises
            };
          });
          return {
            ...user,
            schedule: nextSchedule
          };
        });
        triggerToast('Semana reiniciada! Bom treino nesta nova semana!', 'success');
      }
    });
  };

  // ============================================================================
  // SISTEMA DE BACKUP (EXPORTAÇÃO E IMPORTAÇÃO JSON)
  // ============================================================================
  const fileInputRef = useRef(null);
  const [importMode, setImportMode] = useState('merge'); // 'merge' | 'replace'

  const handleExportBackup = (scope = 'all') => {
    try {
      const payload =
        scope === 'current' && currentUser
          ? {
              app: 'OSTREMBOLONO',
              creator: 'dev.teylonkkjk',
              version: '1.0',
              exportedAt: new Date().toISOString(),
              scope: 'single_user',
              currentUserId: currentUser.id,
              users: [currentUser]
            }
          : {
              app: 'OSTREMBOLONO',
              creator: 'dev.teylonkkjk',
              version: '1.0',
              exportedAt: new Date().toISOString(),
              scope: 'all_users',
              currentUserId: store.currentUserId,
              users: store.users
            };

      const jsonString = JSON.stringify(payload, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const safeName =
        scope === 'current' && currentUser
          ? `ostrembolono_${currentUser.name.toLowerCase().replace(/\s+/g, '_')}.json`
          : `ostrembolono_backup_completo_${new Date().toISOString().slice(0, 10)}.json`;

      const a = document.createElement('a');
      a.href = url;
      a.download = safeName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      triggerToast(`Backup "${safeName}" exportado com sucesso!`, 'success');
    } catch (err) {
      triggerToast('Erro ao gerar o arquivo de backup.', 'error');
    }
  };

  const handleImportBackupFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const importedUsers = Array.isArray(parsed.users)
          ? parsed.users
          : parsed.id && parsed.name && parsed.schedule
          ? [parsed]
          : null;

        if (!importedUsers || importedUsers.length === 0) {
          triggerToast('Arquivo JSON inválido ou sem dados de treinos do OSTREMBOLONO.', 'error');
          return;
        }

        if (importMode === 'replace') {
          setStore({
            currentUserId: importedUsers[0].id,
            users: importedUsers
          });
          setManagedUserId(importedUsers[0].id);
          triggerToast(`Backup restaurado! ${importedUsers.length} usuário(s) carregado(s).`, 'success');
        } else {
          // Mesclar usuários preservando existentes e atualizando/adicionando novos
          setStore((prev) => {
            const mapById = new Map();
            prev.users.forEach((u) => mapById.set(u.id, u));
            importedUsers.forEach((imp) => {
              if (imp && imp.id && imp.name && imp.schedule) {
                mapById.set(imp.id, imp);
              }
            });
            const mergedList = Array.from(mapById.values());
            return {
              currentUserId: prev.currentUserId || mergedList[0]?.id || null,
              users: mergedList
            };
          });
          triggerToast(`Backup mesclado com sucesso! (${importedUsers.length} perfil(is) processado(s)).`, 'success');
        }
      } catch (err) {
        triggerToast('Falha ao ler o JSON. Verifique se o arquivo está correto.', 'error');
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  // ============================================================================
  // TELA DE BOAS-VINDAS / IDENTIFICAÇÃO DO USUÁRIO
  // ============================================================================
  if (!currentUser || showWelcomeModal) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
        {/* Efeitos de luz neon de fundo */}
        <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-96 h-80 bg-emerald-500/10 blur-3xl rounded-full" />
        <div className="pointer-events-none fixed bottom-0 right-10 w-80 h-72 bg-lime-500/10 blur-3xl rounded-full" />

        {/* Notificação Toast */}
        {toast && (
          <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border bg-zinc-900/95 border-emerald-500/40 text-emerald-300 shadow-2xl">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        )}

        <div className="w-full max-w-xl bg-zinc-900/90 border border-zinc-800/90 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative z-10">
          {currentUser && showWelcomeModal && (
            <button
              onClick={() => setShowWelcomeModal(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
              title="Voltar ao aplicativo"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 mb-4">
              <Dumbbell className="w-9 h-9 text-zinc-950 stroke-[2.5]" />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Performance & Hipertrofia
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-lime-500/15 text-lime-300 border border-lime-500/30">
                criado por dev.teylonkkjk
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Bem-vindo ao <span className="text-emerald-400">OSTREMBOLONO!</span>
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base mt-2">
              Digite seu nome para acessar seus treinos.
            </p>
          </div>

          {/* Formulário de Novo Acesso */}
          <form onSubmit={handleCreateOrSelectUser} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Seu Nome ou Apelido
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Ex: Carlos Silva, Mariana, Rodrigo..."
                  className="w-full px-4 py-3.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-white placeholder-zinc-500 transition"
                  autoFocus
                />
              </div>
            </div>

            {/* Opção de carregar treino completo de exemplo */}
            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 cursor-pointer hover:border-zinc-700 transition">
              <input
                type="checkbox"
                checked={loadSampleOnCreate}
                onChange={(e) => setLoadSampleOnCreate(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-zinc-700 text-emerald-500 focus:ring-emerald-500 bg-zinc-900"
              />
              <div className="text-xs sm:text-sm">
                <span className="font-semibold text-zinc-200 block">
                  Iniciar com ficha de treino de exemplo pré-configurada
                </span>
                <span className="text-zinc-400">
                  Cria automaticamente divisões de Segunda a Sábado (Peito, Ombro, Costa, Bíceps, Tríceps e Perna) prontas para editar.
                </span>
              </div>
            </label>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-base shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition transform active:scale-95"
            >
              <span>Entrar no OSTREMBOLONO</span>
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </form>

          {/* Lista de Usuários já cadastrados no navegador */}
          {store.users.length > 0 && (
            <div className="mt-8 pt-6 border-t border-zinc-800/80">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-400" />
                  Perfis Disponíveis ({store.users.length})
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                {store.users.map((u) => {
                  const st = calculateUserStats(u);
                  const isCurrent = currentUser?.id === u.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => handleSelectExistingUser(u.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left transition group ${
                        isCurrent
                          ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                          : 'bg-zinc-950/80 border-zinc-800/90 hover:border-emerald-500/40 text-zinc-200'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-bold text-sm truncate flex items-center gap-1.5">
                          <span>{u.name}</span>
                          {isCurrent && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500 text-zinc-950 font-extrabold">
                              ATIVO
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-zinc-400 mt-0.5">
                          {st.weeklyTotal} exercícios • {st.weeklyPercent}% na semana
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 shrink-0 transition" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Atalho para Importar Backup direto na tela inicial */}
          <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
            <span>Possui um arquivo de backup JSON?</span>
            <label className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Importar Backup</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleImportBackupFile}
                className="hidden"
              />
            </label>
          </div>

          {/* Assinatura na Tela Inicial */}
          <div className="mt-5 pt-4 border-t border-zinc-800/50 text-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                OSTREMBOLONO • <strong className="text-emerald-400">criado por dev.teylonkkjk</strong>
              </span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Dados do dia selecionado para o usuário ativo
  const activeDayObj = currentUser.schedule[selectedDayId] || { categories: [], exercisesByCategory: {} };
  const activeDayMeta = DAYS_OF_WEEK.find((d) => d.id === selectedDayId) || DAYS_OF_WEEK[0];

  // Dados do usuário gerenciado no Painel de Gerenciamento
  const managedUser = store.users.find((u) => u.id === managedUserId) || currentUser;
  const managedDayObj = managedUser?.schedule?.[managedDayId] || { categories: [], exercisesByCategory: {} };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col lg:flex-row selection:bg-emerald-500 selection:text-zinc-950">
      {/* ====================================================================
          TOAST NOTIFICATION
         ==================================================================== */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 max-w-sm flex items-center gap-3 px-4 py-3.5 rounded-2xl border bg-zinc-900/95 backdrop-blur-md border-emerald-500/40 text-zinc-100 shadow-2xl shadow-black/80 animate-fade-in">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xs sm:text-sm font-medium leading-snug">{toast.message}</p>
          <button
            onClick={() => setToast(null)}
            className="text-zinc-500 hover:text-zinc-300 ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ====================================================================
          CRONÔMETRO DE DESCANSO FLUTUANTE INTERATIVO
         ==================================================================== */}
      {restTimer.active && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 z-40 w-80 bg-zinc-900/95 border border-emerald-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Cronômetro de Descanso
              </span>
            </div>
            <button
              onClick={() => setRestTimer((prev) => ({ ...prev, active: false, running: false }))}
              className="text-zinc-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-zinc-400 truncate mb-3">{restTimer.exerciseName}</p>
          <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 mb-3">
            <span className="text-3xl font-extrabold font-mono text-white tracking-wider">
              {String(Math.floor(restTimer.secondsLeft / 60)).padStart(2, '0')}:
              {String(restTimer.secondsLeft % 60).padStart(2, '0')}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() =>
                  setRestTimer((prev) => ({ ...prev, running: !prev.running }))
                }
                className="p-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition"
                title={restTimer.running ? 'Pausar' : 'Retomar'}
              >
                {restTimer.running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={() =>
                  setRestTimer((prev) => ({
                    ...prev,
                    secondsLeft: prev.secondsLeft + 15,
                    totalSeconds: Math.max(prev.totalSeconds, prev.secondsLeft + 15)
                  }))
                }
                className="px-2 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 transition"
              >
                +15s
              </button>
              <button
                onClick={() =>
                  setRestTimer((prev) => ({
                    ...prev,
                    secondsLeft: prev.totalSeconds,
                    running: true
                  }))
                }
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                title="Reiniciar"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-all duration-500"
              style={{
                width: `${
                  restTimer.totalSeconds > 0
                    ? Math.round((restTimer.secondsLeft / restTimer.totalSeconds) * 100)
                    : 0
                }%`
              }}
            />
          </div>
        </div>
      )}

      {/* ====================================================================
          SIDEBAR DESKTOP
         ==================================================================== */}
      <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 bg-zinc-900/70 border-r border-zinc-800/80 backdrop-blur-xl z-30">
        {/* Brand */}
        <div className="p-6 flex items-center gap-3.5 border-b border-zinc-800/80">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <Dumbbell className="w-6 h-6 text-zinc-950 stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white truncate">
                OSTREMBOLONO
              </span>
              <span className="text-xs font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                PRO
              </span>
            </div>
            <p className="text-xs font-semibold text-lime-400 truncate mt-0.5">
              criado por dev.teylonkkjk
            </p>
          </div>
        </div>

        {/* Card do Usuário Ativo */}
        <div className="p-4 border-b border-zinc-800/80">
          <div className="p-3.5 rounded-2xl bg-zinc-950/90 border border-zinc-800/90">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                    Atleta Ativo
                  </p>
                  <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowWelcomeModal(true)}
                className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 border border-zinc-800 transition"
                title="Trocar de Usuário"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Mini Resumo Semanal na Sidebar */}
            <div className="mt-3 pt-3 border-t border-zinc-800/80">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-zinc-400">Progresso Semanal</span>
                <span className="font-bold text-emerald-400">{userStats.weeklyPercent}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${userStats.weeklyPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Links de Navegação */}
        <nav className="flex-1 p-4 space-y-1.5">
          {[
            { id: 'treinos', label: 'Meus Treinos', icon: Dumbbell, badge: `${userStats.dailyPercent}% hoje` },
            { id: 'guia', label: 'Guia de Exercícios', icon: BookOpen, badge: `${EXERCISE_CATALOG.length} exerc.` },
            { id: 'progresso', label: 'Histórico e Progresso', icon: TrendingUp, badge: currentUser.history?.length || 0 },
            { id: 'gerenciamento', label: 'Gerenciar Perfis', icon: Users, badge: `${store.users.length} perfis` },
            { id: 'backup', label: 'Backup (JSON)', icon: FileJson, badge: 'JSON' }
          ].map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-semibold transition ${
                  active
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-lg shadow-emerald-500/5'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${active ? 'text-emerald-400' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    active ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {item.badge}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Rodapé informativo */}
        <div className="p-4 m-4 rounded-2xl bg-zinc-950/90 border border-zinc-800/80 text-xs text-zinc-400 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>Enciclopédia Biomecânica</span>
          </div>
          <p className="leading-relaxed text-xs text-zinc-400">
            Consulte a aba <strong className="text-zinc-200">Guia de Exercícios</strong> para ver ilustrações demonstrativas e a execução correta de cada movimento.
          </p>
          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
            <span className="text-zinc-500 font-bold">OSTREMBOLONO</span>
            <span className="text-emerald-400 font-semibold">criado por dev.teylonkkjk</span>
          </div>
        </div>
      </aside>

      {/* ====================================================================
          CONTEÚDO PRINCIPAL
         ==================================================================== */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen pb-24 lg:pb-10">
        {/* Header Mobile & Topbar */}
        <header className="sticky top-0 z-20 bg-zinc-950/85 backdrop-blur-xl border-b border-zinc-800/80 px-4 sm:px-8 py-4">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
            {/* Identificação Mobile / Título */}
            <div className="flex items-center gap-3">
              <div className="lg:hidden w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-zinc-950 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="lg:hidden text-xs font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    OSTREMBOLONO
                  </span>
                  <h2 className="text-lg sm:text-xl font-extrabold text-white">
                    {activeTab === 'treinos' && 'Gerenciador de Treinos'}
                    {activeTab === 'guia' && 'Guia Completo de Exercícios'}
                    {activeTab === 'progresso' && 'Histórico e Evolução'}
                    {activeTab === 'gerenciamento' && 'Painel de Gerenciamento de Perfis'}
                    {activeTab === 'backup' && 'Backup e Restauração (JSON)'}
                  </h2>
                </div>
                <p className="text-xs text-zinc-400">
                  Atleta: <strong className="text-emerald-400">{currentUser.name}</strong> •{' '}
                  <span className="text-lime-400 font-semibold">criado por dev.teylonkkjk</span>
                </p>
              </div>
            </div>

            {/* Ações rápidas do Topo */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setActiveTab('guia')}
                className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-emerald-400 flex items-center gap-1.5 transition"
                title="Ver enciclopédia de exercícios com imagens demonstrativas"
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Guia de Exercícios</span>
              </button>

              <button
                onClick={() => startRestTimer(60, 'Descanso Avulso')}
                className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 transition"
                title="Abrir cronômetro de 60 segundos"
              >
                <Timer className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Cronômetro</span>
              </button>

              <button
                onClick={() => setShowWelcomeModal(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-bold text-emerald-300 flex items-center gap-1.5 transition"
              >
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Trocar Usuário</span>
              </button>
            </div>
          </div>
        </header>

        {/* Container Central */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 pt-6 space-y-6">
          {/* ================================================================
              BARRAS DE PROGRESSO GLOBAIS (DIÁRIA E SEMANAL)
             ================================================================ */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Barra de Progresso Diária */}
            <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Progresso Diário ({activeDayMeta.label})
                    </h3>
                    <p className="text-xs text-zinc-400">
                      {userStats.dailyCompleted} de {userStats.dailyTotal} exercícios concluídos hoje
                    </p>
                  </div>
                </div>
                <span className="text-2xl font-extrabold text-emerald-400">
                  {userStats.dailyPercent}%
                </span>
              </div>
              <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/90 p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-all duration-500"
                  style={{ width: `${userStats.dailyPercent}%` }}
                />
              </div>
            </div>

            {/* Barra de Progresso Semanal */}
            <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-lime-500/15 border border-lime-500/30 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-lime-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Progresso Semanal Total</h3>
                    <p className="text-xs text-zinc-400">
                      {userStats.weeklyCompleted} de {userStats.weeklyTotal} exercícios na semana ({userStats.activeDaysCount} dias ativos)
                    </p>
                  </div>
                </div>
                <span className="text-2xl font-extrabold text-lime-400">
                  {userStats.weeklyPercent}%
                </span>
              </div>
              <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/90 p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-lime-400 to-emerald-500 transition-all duration-500"
                  style={{ width: `${userStats.weeklyPercent}%` }}
                />
              </div>
            </div>
          </section>

          {/* ================================================================
              ABA 1: MEUS TREINOS (DIAS DA SEMANA, CATEGORIAS E EXERCÍCIOS)
             ================================================================ */}
          {activeTab === 'treinos' && (
            <div className="space-y-6">
              {/* Seletor dos 7 Dias da Semana */}
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3 sm:p-4">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    Selecione o Dia da Semana
                  </span>
                  <button
                    onClick={handleResetWeeklyProgress}
                    className="text-xs text-zinc-400 hover:text-emerald-400 flex items-center gap-1 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Resetar Semana</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {DAYS_OF_WEEK.map((day) => {
                    const dObj = currentUser.schedule[day.id] || { categories: [], exercisesByCategory: {} };
                    const isSelected = selectedDayId === day.id;
                    const dayStats = calculateUserStats(currentUser, day.id);

                    return (
                      <button
                        key={day.id}
                        onClick={() => setSelectedDayId(day.id)}
                        className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                          isSelected
                            ? 'bg-gradient-to-br from-emerald-500/20 to-lime-500/5 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                            : 'bg-zinc-950/70 border-zinc-800/90 hover:border-zinc-700 text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1.5">
                          <span className="text-xs font-extrabold uppercase tracking-wider">
                            {day.short}
                          </span>
                          {dayStats.dailyTotal > 0 && (
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                dayStats.dailyPercent === 100
                                  ? 'bg-emerald-500 text-zinc-950'
                                  : 'bg-zinc-800 text-zinc-300'
                              }`}
                            >
                              {dayStats.dailyCompleted}/{dayStats.dailyTotal}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1 mt-1 min-h-[22px]">
                          {dObj.categories.length > 0 ? (
                            dObj.categories.map((cat) => (
                              <span
                                key={cat}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800/90 text-emerald-300 font-semibold border border-zinc-700/70"
                              >
                                {cat}
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-zinc-500 italic">Descanso</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Gerenciador de Categorias do Dia Selecionado (1 até 3 categorias) */}
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                      <span>Categorias de {activeDayMeta.label}</span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                          activeDayObj.categories.length >= 3
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {activeDayObj.categories.length}/3 selecionadas
                      </span>
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Clique nas categorias para ativar ou remover do treino de {activeDayMeta.label} (máximo de 3 categorias por dia).
                    </p>
                  </div>

                  {/* Ações Rápidas do Dia */}
                  {userStats.dailyTotal > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() =>
                          handleMarkAllDayCompleted(
                            currentUser.id,
                            selectedDayId,
                            userStats.dailyPercent < 100
                          )
                        }
                        className="px-3 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 transition"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>
                          {userStats.dailyPercent < 100 ? 'Marcar Dia Concluído' : 'Desmarcar Dia'}
                        </span>
                      </button>

                      <button
                        onClick={() => handleSaveDayWorkoutToHistory(selectedDayId)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/15 transition"
                      >
                        <Save className="w-4 h-4" />
                        <span>Salvar Treino no Histórico</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Botões das 6 Categorias Musculares */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  {CATEGORIES.map((cat) => {
                    const isSelected = activeDayObj.categories.includes(cat.id);
                    const count = (activeDayObj.exercisesByCategory?.[cat.id] || []).length;
                    const limitReached = !isSelected && activeDayObj.categories.length >= 3;

                    return (
                      <button
                        key={cat.id}
                        onClick={() => toggleDayCategory(currentUser.id, selectedDayId, cat.id)}
                        className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                          isSelected
                            ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                            : limitReached
                            ? 'bg-zinc-950/40 border-zinc-800/50 text-zinc-600 cursor-not-allowed'
                            : 'bg-zinc-950/80 border-zinc-800 hover:border-emerald-500/40 text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-2">
                          <span className="font-extrabold text-sm">{cat.label}</span>
                          <div
                            className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold ${
                              isSelected
                                ? 'bg-emerald-500 text-zinc-950'
                                : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                        <span className="text-xs text-zinc-400">
                          {isSelected ? `${count} exercício(s)` : limitReached ? 'Limite 3/3' : 'Toque p/ ativar'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Lista de Categorias Ativas e Exercícios do Dia */}
              {activeDayObj.categories.length === 0 ? (
                <div className="bg-zinc-900/60 border border-dashed border-zinc-800 rounded-3xl p-10 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                    <Calendar className="w-7 h-7" />
                  </div>
                  <h4 className="text-lg font-extrabold text-white">
                    Dia Livre ou de Descanso ({activeDayMeta.label})
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
                    Nenhuma categoria selecionada para hoje. Clique em até 3 categorias acima (ex: Peito, Ombro, Tríceps) para montar o treino deste dia.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {activeDayObj.categories.map((catId) => {
                    const catMeta = CATEGORIES.find((c) => c.id === catId) || CATEGORIES[0];
                    const exercises = activeDayObj.exercisesByCategory?.[catId] || [];
                    const completedInCat = exercises.filter((e) => e.completed).length;

                    return (
                      <div
                        key={catId}
                        className="bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl"
                      >
                        {/* Cabeçalho da Categoria */}
                        <div className="p-5 bg-zinc-950/60 border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                              <Dumbbell className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-lg font-extrabold text-white">{catMeta.label}</h4>
                                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${catMeta.badge}`}>
                                  {completedInCat}/{exercises.length} concluídos
                                </span>
                              </div>
                              <p className="text-xs text-zinc-400">
                                {activeDayMeta.label} • Marque os exercícios conforme concluir suas séries
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => openAddExerciseModal(currentUser.id, selectedDayId, catId)}
                            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-emerald-500/15 transition"
                          >
                            <Plus className="w-4 h-4 stroke-[2.5]" />
                            <span>Novo Exercício</span>
                          </button>
                        </div>

                        {/* Lista de Exercícios da Categoria */}
                        {exercises.length === 0 ? (
                          <div className="p-8 text-center space-y-3">
                            <p className="text-sm text-zinc-400">
                              Nenhum exercício cadastrado em <strong>{catMeta.label}</strong> na {activeDayMeta.label}.
                            </p>
                            <button
                              onClick={() => openAddExerciseModal(currentUser.id, selectedDayId, catId)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-emerald-400 transition"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Cadastrar Primeiro Exercício de {catMeta.label}</span>
                            </button>
                          </div>
                        ) : (
                          <div className="divide-y divide-zinc-800/70">
                            {exercises.map((ex, idx) => (
                              <div
                                key={ex.id}
                                className={`p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition ${
                                  ex.completed ? 'bg-emerald-950/15' : 'hover:bg-zinc-950/40'
                                }`}
                              >
                                {/* Esquerda: Checkbox + Dados do Exercício */}
                                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                                  <button
                                    onClick={() =>
                                      handleToggleExerciseComplete(currentUser.id, selectedDayId, catId, ex.id)
                                    }
                                    className={`mt-0.5 w-7 h-7 rounded-xl flex items-center justify-center border transition shrink-0 ${
                                      ex.completed
                                        ? 'bg-emerald-500 border-emerald-400 text-zinc-950 shadow-md shadow-emerald-500/20'
                                        : 'bg-zinc-950 border-zinc-700 text-zinc-500 hover:border-emerald-500/60'
                                    }`}
                                    title={ex.completed ? 'Marcar como pendente' : 'Marcar como concluído'}
                                  >
                                    {ex.completed ? (
                                      <Check className="w-4 h-4 stroke-[3]" />
                                    ) : (
                                      <Circle className="w-4 h-4" />
                                    )}
                                  </button>

                                  <div className="min-w-0 flex-1 space-y-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="text-xs font-mono text-zinc-500 font-bold">
                                        #{idx + 1}
                                      </span>
                                      <h5
                                        className={`font-extrabold text-sm sm:text-base ${
                                          ex.completed ? 'line-through text-zinc-400' : 'text-white'
                                        }`}
                                      >
                                        {ex.name}
                                      </h5>
                                    </div>

                                    {/* Badges de Séries, Repetições, Peso e Descanso */}
                                    <div className="flex flex-wrap items-center gap-2 text-xs">
                                      <span className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 font-semibold">
                                        <strong className="text-emerald-400">{ex.sets}</strong> séries
                                      </span>
                                      <span className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 font-semibold">
                                        <strong className="text-emerald-400">{ex.reps}</strong> reps
                                      </span>
                                      <span className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 font-semibold">
                                        Carga: <strong className="text-lime-400">{ex.weight} kg</strong>
                                      </span>
                                      <button
                                        onClick={() => startRestTimer(ex.rest, ex.name)}
                                        className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center gap-1 transition"
                                        title="Clique para iniciar o cronômetro de descanso"
                                      >
                                        <Timer className="w-3.5 h-3.5 text-emerald-400" />
                                        <span>Descanso: {ex.rest}s</span>
                                      </button>
                                    </div>

                                    {ex.notes && (
                                      <p className="text-xs text-zinc-400 bg-zinc-950/60 border border-zinc-800/70 rounded-lg px-3 py-1.5 italic">
                                        Obs: {ex.notes}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {/* Direita: Ações (Como Fazer, Subir, Descer, Editar, Excluir) */}
                                <div className="flex items-center justify-end gap-1.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-800/60">
                                  <button
                                    onClick={() => {
                                      const matched = findGuideExercise(ex.name, catId);
                                      if (matched) setGuideDetailModal(matched);
                                    }}
                                    className="px-2.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1 transition"
                                    title="Ver imagem demonstrativa, para que serve e como executar corretamente"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="hidden sm:inline">Execução</span>
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleMoveExercise(currentUser.id, selectedDayId, catId, idx, 'up')
                                    }
                                    disabled={idx === 0}
                                    className="p-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 disabled:opacity-30 border border-zinc-800 text-zinc-300 transition"
                                    title="Mover para cima"
                                  >
                                    <ArrowUp className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleMoveExercise(currentUser.id, selectedDayId, catId, idx, 'down')
                                    }
                                    disabled={idx === exercises.length - 1}
                                    className="p-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 disabled:opacity-30 border border-zinc-800 text-zinc-300 transition"
                                    title="Mover para baixo"
                                  >
                                    <ArrowDown className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      openEditExerciseModal(currentUser.id, selectedDayId, catId, ex)
                                    }
                                    className="p-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-emerald-400 transition"
                                    title="Editar exercício"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteExercise(currentUser.id, selectedDayId, catId, ex.id, ex.name)
                                    }
                                    className="p-2 rounded-xl bg-zinc-950 hover:bg-red-500/20 border border-zinc-800 hover:border-red-500/40 text-red-400 transition"
                                    title="Excluir exercício"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ================================================================
              NOVA ABA: GUIA COMPLETO DE EXERCÍCIOS (IMAGENS, PARA QUE SERVE E COMO USAR)
             ================================================================ */}
          {activeTab === 'guia' && (
            <div className="space-y-6">
              {/* Cabeçalho e Filtros da Enciclopédia */}
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 sm:p-6 space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      Catálogo Completo de Exercícios • OSTREMBOLONO
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                      Guia de Exercícios ({filteredCatalog.length} de {EXERCISE_CATALOG.length})
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400">
                      Todos os grupos musculares, modalidades e objetivos do catálogo oficial com ilustração biomecânica, anatomia e execução.
                    </p>
                  </div>

                  {/* Seletor rápido de Dia para Adicionar direto na Ficha */}
                  <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-xs font-bold text-zinc-400">
                      Enviar exercícios para:
                    </span>
                    <select
                      value={quickAddDayId}
                      onChange={(e) => setQuickAddDayId(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-emerald-500/40 text-xs font-bold text-emerald-400 outline-none"
                    >
                      {DAYS_OF_WEEK.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Barra de Pesquisa + Botões das 17 Categorias do Catálogo PDF */}
                <div className="space-y-3 pt-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={guideSearchQuery}
                      onChange={(e) => setGuideSearchQuery(e.target.value)}
                      placeholder="Pesquisar entre os 203 exercícios (ex: supino, stiff, hip thrust, snatch, prancha, mobilidade, corrida)..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-emerald-500 text-xs sm:text-sm text-white outline-none"
                    />
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {PDF_SUBCATEGORIES.map((subCat) => {
                      const active = guideCategoryFilter === subCat;
                      const count =
                        subCat === 'Todos'
                          ? EXERCISE_CATALOG.length
                          : EXERCISE_CATALOG.filter((e) => e.subCategory === subCat).length;
                      return (
                        <button
                          key={subCat}
                          onClick={() => setGuideCategoryFilter(subCat)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition flex items-center gap-1.5 ${
                            active
                              ? 'bg-emerald-500 text-zinc-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                              : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                          }`}
                        >
                          <span>{subCat}</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                              active ? 'bg-zinc-950/20 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Grid de Cards de Exercícios com Ilustração, Objetivo e Passo a Passo */}
              {filteredCatalog.length === 0 ? (
                <div className="bg-zinc-900/60 border border-dashed border-zinc-800 rounded-3xl p-10 text-center">
                  <p className="text-sm text-zinc-400">
                    Nenhum exercício encontrado para "{guideSearchQuery}".
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredCatalog.map((item) => {
                    const catMeta = CATEGORIES.find((c) => c.id === item.category) || CATEGORIES[0];
                    const quickDayLabel = DAYS_OF_WEEK.find((d) => d.id === quickAddDayId)?.short || 'Seg';

                    return (
                      <div
                        key={item.id}
                        className="bg-zinc-900/90 border border-zinc-800 hover:border-emerald-500/40 rounded-3xl p-5 flex flex-col justify-between gap-4 shadow-xl transition"
                      >
                        <div className="space-y-4">
                          {/* Cabeçalho do Card */}
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                <span className={`text-xs px-2.5 py-0.5 rounded-full font-extrabold border ${catMeta.badge}`}>
                                  {item.subCategory || item.category}
                                </span>
                                {item.subCategory && item.subCategory !== item.category && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-bold">
                                    Ficha: {item.category}
                                  </span>
                                )}
                                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-400 font-semibold">
                                  {item.level}
                                </span>
                              </div>
                              <h4 className="text-lg font-extrabold text-white">{item.name}</h4>
                            </div>

                            <button
                              onClick={() => setGuideDetailModal(item)}
                              className="p-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-emerald-400 transition shrink-0"
                              title="Expandir guia em tela cheia"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Ilustração Demonstrativa Interativa (Execução + Anatomia) */}
                          <ExerciseVisualDemo exercise={item} compact />

                          {/* Para que serve */}
                          <div className="p-3.5 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 space-y-1.5">
                            <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                              <Target className="w-4 h-4" />
                              <span>Para que serve</span>
                            </div>
                            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                              {item.purpose}
                            </p>
                            {item.secondaryMuscles?.length > 0 && (
                              <p className="text-xs text-zinc-400 pt-1">
                                Sinergistas: <span className="text-zinc-300">{item.secondaryMuscles.join(', ')}</span>
                              </p>
                            )}
                          </div>

                          {/* Forma Correta de Usar (Passo a Passo) */}
                          <div className="p-3.5 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 space-y-2">
                            <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-lime-400">
                              <CheckCircle className="w-4 h-4" />
                              <span>Forma Correta de Executar</span>
                            </div>
                            <ol className="space-y-1.5 text-xs text-zinc-300">
                              {item.executionSteps.map((step, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                                    {idx + 1}
                                  </span>
                                  <span className="leading-relaxed">{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>

                          {/* Dica de Ouro / Postura */}
                          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-xs text-amber-200/90">
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-amber-300">Dica de Postura: </strong>
                              <span>{item.proTip}</span>
                            </div>
                          </div>
                        </div>

                        {/* Botão para Adicionar Direto no Treino do Usuário */}
                        <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                          <span className="text-xs text-zinc-400">
                            Sugestão: <strong className="text-zinc-200">{item.defaultSets}x {item.defaultReps}</strong>
                          </span>
                          <button
                            onClick={() => handleQuickAddFromGuide(item, quickAddDayId)}
                            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/15 transition"
                          >
                            <Plus className="w-4 h-4 stroke-[2.5]" />
                            <span>Adicionar na {quickDayLabel}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Quadro Oficial de Orientações de Uso e Segurança do Catálogo PDF */}
              <div className="bg-zinc-900/90 border border-emerald-500/30 rounded-3xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm uppercase tracking-wider">
                  <ShieldAlert className="w-5 h-5" />
                  <span>Orientações de Uso e Segurança do Catálogo</span>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm text-zinc-300">
                  <li className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                    • Aprenda a técnica antes de aumentar a carga. Use amplitude e carga compatíveis com sua capacidade.
                  </li>
                  <li className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                    • Faça aquecimento adequado e aumente o volume gradualmente. Dor aguda ou persistente é sinal para interromper e buscar orientação profissional.
                  </li>
                  <li className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                    • Exercícios como levantamentos olímpicos, movimentos pliométricos intensos e variações avançadas de calistenia exigem progressão e, idealmente, supervisão.
                  </li>
                  <li className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                    • A escolha dos exercícios deve considerar objetivo, experiência, mobilidade, limitações individuais e equipamentos disponíveis.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* ================================================================
              ABA 2: HISTÓRICO DE TREINOS E PROGRESSO POR CATEGORIA
             ================================================================ */}
          {activeTab === 'progresso' && (
            <div className="space-y-6">
              {/* Resumo de Progresso por Categoria Muscular */}
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <div>
                    <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                      <Activity className="w-5 h-5 text-emerald-400" />
                      <span>Desempenho Semanal por Grupo Muscular</span>
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Distribuição de exercícios concluídos em cada uma das 6 categorias obrigatórias
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSaveDayWorkoutToHistory(selectedDayId)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-xs flex items-center gap-1.5 transition"
                    >
                      <Save className="w-4 h-4" />
                      <span>Registrar Treino de Hoje ({activeDayMeta.short})</span>
                    </button>
                    <button
                      onClick={handleResetWeeklyProgress}
                      className="px-3.5 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-semibold text-xs flex items-center gap-1.5 transition"
                    >
                      <RotateCcw className="w-4 h-4 text-emerald-400" />
                      <span>Resetar Marcações</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {CATEGORIES.map((cat) => {
                    const data = userStats.categoryBreakdown[cat.id] || { total: 0, completed: 0 };
                    const pct = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
                    return (
                      <div
                        key={cat.id}
                        className="p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-white text-sm">{cat.label}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${cat.badge}`}>
                            {data.completed}/{data.total} exercícios
                          </span>
                        </div>
                        <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 my-2">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="text-[11px] text-zinc-400 flex justify-between">
                          <span>Taxa de conclusão</span>
                          <strong className="text-emerald-400">{pct}%</strong>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Grid: Histórico de Treinos Realizados + Evolução de Cargas */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Coluna 1 e 2: Histórico de Sessões */}
                <div className="lg:col-span-2 bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                        <History className="w-5 h-5 text-emerald-400" />
                        <span>Histórico de Treinos Salvos</span>
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Registro permanente das suas sessões finalizadas
                      </p>
                    </div>
                  </div>

                  {(!currentUser.history || currentUser.history.length === 0) ? (
                    <div className="p-8 text-center border border-dashed border-zinc-800 rounded-2xl">
                      <p className="text-sm text-zinc-400">
                        Nenhum treino salvo no histórico ainda. Conclua seus exercícios do dia e clique em <strong>"Salvar Treino no Histórico"</strong>!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {currentUser.history.map((entry) => (
                        <div
                          key={entry.id}
                          className="p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-white text-sm">{entry.dayLabel}</span>
                              <span className="text-xs text-zinc-400">
                                • {new Date(entry.date).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {(entry.categories || []).map((c) => (
                                <span
                                  key={c}
                                  className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold"
                                >
                                  {c}
                                </span>
                              ))}
                              <span className="text-xs text-zinc-400 ml-1">
                                {entry.completedCount}/{entry.totalCount} exerc. • Volume est.:{' '}
                                <strong className="text-lime-400">{entry.totalVolumeKg || 0} kg</strong>
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              updateUserById(currentUser.id, (u) => ({
                                ...u,
                                history: (u.history || []).filter((h) => h.id !== entry.id)
                              }));
                              triggerToast('Registro removido do histórico.', 'info');
                            }}
                            className="self-end sm:self-center p-2 rounded-xl bg-zinc-900 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-zinc-800 transition"
                            title="Remover registro"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Coluna 3: Evolução de Carga (PRs) */}
                <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6">
                  <h3 className="text-lg font-extrabold text-white flex items-center gap-2 mb-1">
                    <Award className="w-5 h-5 text-lime-400" />
                    <span>Evolução de Cargas</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mb-4">
                    Atualizações de peso registradas automaticamente ao editar exercícios
                  </p>

                  {(!currentUser.weightLogs || currentUser.weightLogs.length === 0) ? (
                    <div className="p-6 text-center border border-dashed border-zinc-800 rounded-2xl text-xs text-zinc-400">
                      Sempre que você alterar o peso (kg) de um exercício, sua progressão aparecerá aqui.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {currentUser.weightLogs.map((log) => {
                        const diff = log.newWeight - log.oldWeight;
                        return (
                          <div
                            key={log.id}
                            className="p-3.5 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 text-xs"
                          >
                            <div className="flex items-center justify-between font-bold text-white mb-1">
                              <span className="truncate">{log.exerciseName}</span>
                              <span
                                className={`px-1.5 py-0.5 rounded font-extrabold ${
                                  diff >= 0
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'bg-amber-500/20 text-amber-300'
                                }`}
                              >
                                {diff >= 0 ? `+${diff}kg` : `${diff}kg`}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-zinc-400">
                              <span>
                                {log.oldWeight}kg → <strong className="text-lime-400">{log.newWeight}kg</strong>
                              </span>
                              <span>{new Date(log.date).toLocaleDateString('pt-BR')}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              ABA 3: PAINEL DE GERENCIAMENTO GERAL (MULTI-USUÁRIO LOCAL)
             ================================================================ */}
          {activeTab === 'gerenciamento' && (
            <div className="space-y-6">
              {/* Aviso de Gerenciamento Local */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200/90 leading-relaxed">
                  <strong className="text-amber-300 block mb-0.5">
                    Modo de Gerenciamento Local (Sem Servidor / Sem Senha)
                  </strong>
                  Como o OSTREMBOLONO funciona 100% no navegador utilizando <code className="text-amber-300">LocalStorage</code>, este painel permite visualizar, criar, editar e gerenciar os treinos de todos os nomes cadastrados neste dispositivo.
                </div>
              </div>

              {/* Lista de Usuários + Criar Novo Usuário */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Coluna Esquerda: Todos os Usuários Cadastrados */}
                <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-white flex items-center gap-2 mb-1">
                      <Users className="w-5 h-5 text-emerald-400" />
                      <span>Usuários no Navegador ({store.users.length})</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mb-4">
                      Selecione qualquer pessoa para visualizar ou editar seus treinos abaixo.
                    </p>

                    <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                      {store.users.map((u) => {
                        const st = calculateUserStats(u);
                        const isManaged = managedUser?.id === u.id;
                        const isActiveUser = currentUser.id === u.id;

                        return (
                          <div
                            key={u.id}
                            className={`p-3.5 rounded-2xl border transition ${
                              isManaged
                                ? 'bg-emerald-500/15 border-emerald-500 text-white'
                                : 'bg-zinc-950/90 border-zinc-800/90 text-zinc-200 hover:border-zinc-700'
                            }`}
                          >
                            {renamingUser.id === u.id ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={renamingUser.name}
                                  onChange={(e) =>
                                    setRenamingUser((prev) => ({ ...prev, name: e.target.value }))
                                  }
                                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-emerald-500 text-xs text-white outline-none"
                                  autoFocus
                                />
                                <button
                                  onClick={() => {
                                    const clean = renamingUser.name.trim();
                                    if (clean) {
                                      updateUserById(u.id, (usr) => ({ ...usr, name: clean }));
                                      triggerToast('Nome atualizado com sucesso!', 'success');
                                    }
                                    setRenamingUser({ id: null, name: '' });
                                  }}
                                  className="p-1.5 rounded-lg bg-emerald-500 text-zinc-950"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setRenamingUser({ id: null, name: '' })}
                                  className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between gap-2">
                                <button
                                  onClick={() => setManagedUserId(u.id)}
                                  className="text-left min-w-0 flex-1"
                                >
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-sm truncate">{u.name}</span>
                                    {isActiveUser && (
                                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500 text-zinc-950 font-extrabold">
                                        VOCÊ
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-zinc-400 mt-0.5">
                                    {st.activeDaysCount} dias • {st.weeklyTotal} exercícios ({st.weeklyPercent}%)
                                  </div>
                                </button>

                                <div className="flex items-center gap-1 shrink-0">
                                  {!isActiveUser && (
                                    <button
                                      onClick={() => handleSelectExistingUser(u.id)}
                                      className="px-2 py-1 rounded-lg bg-zinc-900 hover:bg-emerald-500 hover:text-zinc-950 text-[11px] font-bold text-emerald-400 border border-zinc-800 transition"
                                      title="Entrar com este usuário"
                                    >
                                      Usar
                                    </button>
                                  )}
                                  <button
                                    onClick={() => setRenamingUser({ id: u.id, name: u.name })}
                                    className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800"
                                    title="Renomear usuário"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  {store.users.length > 1 && (
                                    <button
                                      onClick={() => {
                                        setConfirmDialog({
                                          open: true,
                                          title: 'Excluir Usuário',
                                          description: `Deseja excluir permanentemente o perfil de "${u.name}" e todos os seus treinos deste navegador?`,
                                          confirmLabel: 'Excluir Perfil',
                                          danger: true,
                                          onConfirm: () => {
                                            setStore((prev) => {
                                              const remaining = prev.users.filter((item) => item.id !== u.id);
                                              const nextCurrent =
                                                prev.currentUserId === u.id
                                                  ? remaining[0]?.id || null
                                                  : prev.currentUserId;
                                              return {
                                                currentUserId: nextCurrent,
                                                users: remaining
                                              };
                                            });
                                            triggerToast(`Usuário "${u.name}" removido.`, 'info');
                                          }
                                        });
                                      }}
                                      className="p-1.5 rounded-lg bg-zinc-900 hover:bg-red-500/20 text-red-400 border border-zinc-800"
                                      title="Excluir usuário"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Criar Novo Usuário direto pelo Painel */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const clean = adminNewUserName.trim();
                      if (!clean) {
                        triggerToast('Digite o nome do novo usuário.', 'error');
                        return;
                      }
                      const created = createNewUserObject(clean, adminNewUserSample);
                      setStore((prev) => ({
                        ...prev,
                        users: [...prev.users, created]
                      }));
                      setManagedUserId(created.id);
                      setAdminNewUserName('');
                      triggerToast(`Usuário "${created.name}" adicionado ao navegador!`, 'success');
                    }}
                    className="mt-5 pt-4 border-t border-zinc-800 space-y-2.5"
                  >
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Cadastrar Novo Usuário
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={adminNewUserName}
                        onChange={(e) => setAdminNewUserName(e.target.value)}
                        placeholder="Nome do aluno/atleta..."
                        className="flex-1 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white outline-none focus:border-emerald-500"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-xs flex items-center gap-1 shrink-0 transition"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Criar</span>
                      </button>
                    </div>
                    <label className="flex items-center gap-2 text-[11px] text-zinc-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={adminNewUserSample}
                        onChange={(e) => setAdminNewUserSample(e.target.checked)}
                        className="rounded border-zinc-700 text-emerald-500 bg-zinc-950"
                      />
                      <span>Incluir treinos de exemplo pré-cadastrados</span>
                    </label>
                  </form>
                </div>

                {/* Colunas 2 e 3: Editor Completo de Treinos do Usuário Selecionado */}
                {managedUser && (
                  <div className="lg:col-span-2 bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 sm:p-6 space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-800">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                          Editando Ficha de Treino de:
                        </span>
                        <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                          <span>{managedUser.name}</span>
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setConfirmDialog({
                              open: true,
                              title: 'Restaurar Treino Padrão',
                              description: `Deseja carregar a ficha de treino padrão de exemplo para "${managedUser.name}"? Isso substituirá os exercícios atuais deste usuário.`,
                              confirmLabel: 'Carregar Exemplo',
                              danger: false,
                              onConfirm: () => {
                                updateUserById(managedUser.id, (u) => ({
                                  ...u,
                                  schedule: createSampleSchedule()
                                }));
                                triggerToast(`Ficha de exemplo carregada para ${managedUser.name}!`, 'success');
                              }
                            });
                          }}
                          className="px-3 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 transition"
                        >
                          Carregar Ficha Exemplo
                        </button>

                        <button
                          onClick={() => {
                            setConfirmDialog({
                              open: true,
                              title: 'Limpar Todos os Treinos',
                              description: `Tem certeza que deseja zerar todos os dias de treino de "${managedUser.name}"?`,
                              confirmLabel: 'Zerar Treinos',
                              danger: true,
                              onConfirm: () => {
                                updateUserById(managedUser.id, (u) => ({
                                  ...u,
                                  schedule: createEmptySchedule()
                                }));
                                triggerToast(`Treinos de ${managedUser.name} foram limpos.`, 'info');
                              }
                            });
                          }}
                          className="px-3 py-2 rounded-xl bg-zinc-950 hover:bg-red-500/20 border border-zinc-800 text-xs font-semibold text-red-400 transition"
                        >
                          Limpar Ficha
                        </button>
                      </div>
                    </div>

                    {/* Seletor de Dia dentro do Painel de Gerenciamento */}
                    <div className="flex flex-wrap gap-1.5">
                      {DAYS_OF_WEEK.map((d) => {
                        const active = managedDayId === d.id;
                        const cats = managedUser.schedule?.[d.id]?.categories || [];
                        return (
                          <button
                            key={d.id}
                            onClick={() => setManagedDayId(d.id)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
                              active
                                ? 'bg-emerald-500 text-zinc-950 border-emerald-400'
                                : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                            }`}
                          >
                            {d.short} ({cats.length}/3)
                          </button>
                        );
                      })}
                    </div>

                    {/* Seletor de Categorias do Dia no Painel */}
                    <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/90">
                      <div className="text-xs font-bold text-zinc-300 mb-2.5 flex items-center justify-between">
                        <span>
                          Categorias de {DAYS_OF_WEEK.find((d) => d.id === managedDayId)?.label} (Máx. 3):
                        </span>
                        <span className="text-emerald-400">{managedDayObj.categories.length}/3</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((cat) => {
                          const selected = managedDayObj.categories.includes(cat.id);
                          return (
                            <button
                              key={cat.id}
                              onClick={() => toggleDayCategory(managedUser.id, managedDayId, cat.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                                selected
                                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                              }`}
                            >
                              <span>{cat.label}</span>
                              {selected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Exercícios do Usuário Selecionado */}
                    {managedDayObj.categories.length === 0 ? (
                      <div className="p-6 text-center text-xs text-zinc-400 border border-dashed border-zinc-800 rounded-2xl">
                        Nenhuma categoria atribuída neste dia para {managedUser.name}. Ative uma categoria acima para cadastrar exercícios.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {managedDayObj.categories.map((catId) => {
                          const list = managedDayObj.exercisesByCategory?.[catId] || [];
                          return (
                            <div
                              key={catId}
                              className="p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800 space-y-3"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-extrabold text-sm text-emerald-400">
                                  Categoria: {catId} ({list.length} exercícios)
                                </span>
                                <button
                                  onClick={() => openAddExerciseModal(managedUser.id, managedDayId, catId)}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-1"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Adicionar Exercício</span>
                                </button>
                              </div>

                              {list.length === 0 ? (
                                <p className="text-xs text-zinc-500 italic">
                                  Sem exercícios cadastrados nesta categoria.
                                </p>
                              ) : (
                                <div className="space-y-2">
                                  {list.map((ex) => (
                                    <div
                                      key={ex.id}
                                      className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs"
                                    >
                                      <div>
                                        <span className="font-bold text-white block">{ex.name}</span>
                                        <span className="text-zinc-400">
                                          {ex.sets} séries × {ex.reps} reps • {ex.weight}kg • Descanso: {ex.rest}s
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <button
                                          onClick={() =>
                                            openEditExerciseModal(managedUser.id, managedDayId, catId, ex)
                                          }
                                          className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-emerald-400 font-semibold flex items-center gap-1"
                                        >
                                          <Edit3 className="w-3.5 h-3.5" />
                                          <span>Editar</span>
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleDeleteExercise(managedUser.id, managedDayId, catId, ex.id, ex.name)
                                          }
                                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-500/20 text-red-400"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================
              ABA 4: SISTEMA DE BACKUP (EXPORTAR E IMPORTAR JSON)
             ================================================================ */}
          {activeTab === 'backup' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card Exportar */}
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                    <Download className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-extrabold text-white mb-1">
                    Exportar Backup em JSON
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                    Salve uma cópia de segurança dos seus treinos, séries, cargas e histórico no seu celular ou computador. Ideal para transferir seus treinos para outro navegador ou aparelho.
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => handleExportBackup('current')}
                    className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition"
                  >
                    <Download className="w-4 h-4 stroke-[2.5]" />
                    <span>Exportar Treinos de {currentUser.name} (.json)</span>
                  </button>

                  <button
                    onClick={() => handleExportBackup('all')}
                    className="w-full py-3.5 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-bold text-sm flex items-center justify-center gap-2 transition"
                  >
                    <FileJson className="w-4 h-4 text-emerald-400" />
                    <span>Exportar Todos os Usuários ({store.users.length})</span>
                  </button>
                </div>
              </div>

              {/* Card Importar */}
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-lime-500/15 border border-lime-500/30 flex items-center justify-center text-lime-400 mb-4">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-extrabold text-white mb-1">
                    Importar e Restaurar Backup (.json)
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-4">
                    Selecione um arquivo <code className="text-zinc-200">.json</code> exportado anteriormente pelo OSTREMBOLONO para restaurar seus usuários e treinos instantaneamente.
                  </p>

                  {/* Modo de Importação */}
                  <div className="space-y-2 mb-5">
                    <label className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer">
                      <input
                        type="radio"
                        name="importMode"
                        checked={importMode === 'merge'}
                        onChange={() => setImportMode('merge')}
                        className="text-emerald-500 focus:ring-emerald-500 bg-zinc-900"
                      />
                      <div className="text-xs">
                        <strong className="text-white block">Mesclar com dados atuais (Recomendado)</strong>
                        <span className="text-zinc-400">Mantém os usuários atuais e adiciona/atualiza os do arquivo.</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer">
                      <input
                        type="radio"
                        name="importMode"
                        checked={importMode === 'replace'}
                        onChange={() => setImportMode('replace')}
                        className="text-emerald-500 focus:ring-emerald-500 bg-zinc-900"
                      />
                      <div className="text-xs">
                        <strong className="text-white block">Substituir todos os dados atuais</strong>
                        <span className="text-zinc-400">Apaga a lista atual e carrega apenas o que estiver no backup.</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,application/json"
                    onChange={handleImportBackupFile}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-500 hover:from-lime-300 hover:to-emerald-400 text-zinc-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-lime-500/20 transition"
                  >
                    <Upload className="w-4 h-4 stroke-[2.5]" />
                    <span>Selecionar Arquivo de Backup (.json)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Rodapé Oficial com Assinatura */}
        <footer className="max-w-6xl w-full mx-auto px-4 sm:px-8 mt-12 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="font-extrabold text-zinc-300 tracking-wide">OSTREMBOLONO</span>
            <span>• Sistema de Gerenciamento de Treinos</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-zinc-300 font-semibold">
            criado por <strong className="text-emerald-400">dev.teylonkkjk</strong>
          </div>
        </footer>
      </div>

      {/* ====================================================================
          BARRA DE NAVEGAÇÃO INFERIOR (MOBILE)
         ==================================================================== */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800 px-2 py-2 flex items-center justify-around">
        {[
          { id: 'treinos', label: 'Treinos', icon: Dumbbell },
          { id: 'guia', label: 'Guia', icon: BookOpen },
          { id: 'progresso', label: 'Progresso', icon: TrendingUp },
          { id: 'gerenciamento', label: 'Perfis', icon: Users },
          { id: 'backup', label: 'Backup', icon: FileJson }
        ].map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl transition ${
                active ? 'text-emerald-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ====================================================================
          MODAL DE DETALHES E EXECUÇÃO DO EXERCÍCIO (ABRE TANTO DO GUIA QUANTO DE MEUS TREINOS)
         ==================================================================== */}
      {guideDetailModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl my-8 space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-zinc-800 pb-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                  {guideDetailModal.category} • {guideDetailModal.equipment}
                </span>
                <h3 className="text-xl font-extrabold text-white mt-0.5">
                  {guideDetailModal.name}
                </h3>
              </div>
              <button
                onClick={() => setGuideDetailModal(null)}
                className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Ilustração Grande */}
            <ExerciseVisualDemo exercise={guideDetailModal} />

            {/* Para que serve */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1.5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Target className="w-4 h-4" />
                <span>Para que serve este exercício</span>
              </h4>
              <p className="text-sm text-zinc-200 leading-relaxed">
                {guideDetailModal.purpose}
              </p>
              <div className="text-xs text-zinc-400 pt-1">
                <strong>Músculos Primários:</strong> {guideDetailModal.primaryMuscles.join(', ')}
                {guideDetailModal.secondaryMuscles?.length > 0 && (
                  <> • <strong>Sinergistas:</strong> {guideDetailModal.secondaryMuscles.join(', ')}</>
                )}
              </div>
            </div>

            {/* Passo a Passo da Execução */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2.5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-lime-400 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                <span>Passo a Passo da Forma Correta de Usar</span>
              </h4>
              <ol className="space-y-2 text-xs sm:text-sm text-zinc-300">
                {guideDetailModal.executionSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-zinc-950 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Dica de Postura */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs sm:text-sm text-amber-200">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300">Dica de Ouro: </strong>
                <span>{guideDetailModal.proTip}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800">
              <button
                onClick={() => {
                  handleQuickAddFromGuide(guideDetailModal, selectedDayId);
                  setGuideDetailModal(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Adicionar na {activeDayMeta.label}</span>
              </button>

              <button
                onClick={() => setGuideDetailModal(null)}
                className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs sm:text-sm font-bold text-zinc-200 transition"
              >
                Fechar Guia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL DE ADICIONAR / EDITAR EXERCÍCIO
         ==================================================================== */}
      {exerciseModal.open && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  {exerciseModal.category} • {DAYS_OF_WEEK.find((d) => d.id === exerciseModal.dayId)?.label}
                </span>
                <h3 className="text-lg font-extrabold text-white">
                  {exerciseModal.mode === 'add' ? 'Adicionar Novo Exercício' : 'Editar Exercício'}
                </h3>
              </div>
              <button
                onClick={() => setExerciseModal((prev) => ({ ...prev, open: false }))}
                className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExerciseModal} className="space-y-4">
              {/* Nome do Exercício + Sugestões Rápidas */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Nome do Exercício *
                </label>
                <input
                  type="text"
                  value={exerciseModal.exercise.name}
                  onChange={(e) =>
                    setExerciseModal((prev) => ({
                      ...prev,
                      exercise: { ...prev.exercise, name: e.target.value }
                    }))
                  }
                  placeholder="Ex: Supino Reto com Halteres"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-emerald-500 text-sm text-white outline-none"
                  autoFocus
                />

                {/* Sugestões clicáveis da categoria */}
                {EXERCISE_SUGGESTIONS[exerciseModal.category] && (
                  <div className="mt-2">
                    <span className="text-[11px] text-zinc-400 block mb-1">
                      Sugestões rápidas para {exerciseModal.category}:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {EXERCISE_SUGGESTIONS[exerciseModal.category].map((sug) => (
                        <button
                          type="button"
                          key={sug}
                          onClick={() =>
                            setExerciseModal((prev) => ({
                              ...prev,
                              exercise: { ...prev.exercise, name: sug }
                            }))
                          }
                          className="text-[11px] px-2 py-1 rounded-lg bg-zinc-950 hover:bg-emerald-500/20 border border-zinc-800 hover:border-emerald-500/40 text-zinc-300 hover:text-emerald-300 transition"
                        >
                          + {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Séries, Repetições, Peso e Descanso */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">Séries</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={exerciseModal.exercise.sets}
                    onChange={(e) =>
                      setExerciseModal((prev) => ({
                        ...prev,
                        exercise: { ...prev.exercise, sets: e.target.value }
                      }))
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-emerald-500 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">Repetições</label>
                  <input
                    type="text"
                    value={exerciseModal.exercise.reps}
                    onChange={(e) =>
                      setExerciseModal((prev) => ({
                        ...prev,
                        exercise: { ...prev.exercise, reps: e.target.value }
                      }))
                    }
                    placeholder="10-12"
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-emerald-500 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">Peso (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={exerciseModal.exercise.weight}
                    onChange={(e) =>
                      setExerciseModal((prev) => ({
                        ...prev,
                        exercise: { ...prev.exercise, weight: e.target.value }
                      }))
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-emerald-500 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">Descanso (s)</label>
                  <input
                    type="number"
                    step="5"
                    min="0"
                    value={exerciseModal.exercise.rest}
                    onChange={(e) =>
                      setExerciseModal((prev) => ({
                        ...prev,
                        exercise: { ...prev.exercise, rest: e.target.value }
                      }))
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-emerald-500 text-sm text-white outline-none"
                  />
                </div>
              </div>

              {/* Observações */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">
                  Observações / Técnica (opcional)
                </label>
                <textarea
                  rows={2}
                  value={exerciseModal.exercise.notes}
                  onChange={(e) =>
                    setExerciseModal((prev) => ({
                      ...prev,
                      exercise: { ...prev.exercise, notes: e.target.value }
                    }))
                  }
                  placeholder="Ex: Cadência controlada, falha na última série, drop-set..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-emerald-500 text-sm text-white outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setExerciseModal((prev) => ({ ...prev, open: false }))}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition"
                >
                  {exerciseModal.mode === 'add' ? 'Cadastrar Exercício' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL DE CONFIRMAÇÃO CUSTOMIZADO
         ==================================================================== */}
      {confirmDialog.open && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-extrabold text-white mb-2">{confirmDialog.title}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
              {confirmDialog.description}
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}
                className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (confirmDialog.onConfirm) confirmDialog.onConfirm();
                  setConfirmDialog((prev) => ({ ...prev, open: false }));
                }}
                className={`px-5 py-2.5 rounded-xl font-extrabold text-xs transition ${
                  confirmDialog.danger
                    ? 'bg-red-500 hover:bg-red-400 text-zinc-950'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950'
                }`}
              >
                {confirmDialog.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}