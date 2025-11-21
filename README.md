🔮 Oráculo Místico - SaaS de Numerologia e Astrologia (MVP)

<!-- Ícones de Status do Projeto (Melhora o visual do GitHub) -->

Aplicação Web completa simulando um funil de vendas de infoproduto, com geração de mapas numerológicos personalizados em PDF e captura de leads.

🔗 Links do Projeto

Tipo

URL

🔗 Projeto Online (Vercel)

https://oraculo-mistico-saas.vercel.app

💻 Repositório GitHub

https://github.com/AdamRic95/oraculo-mistico-saas

🖥️ Sobre o Projeto

O Oráculo Místico é um MVP (Produto Mínimo Viável) de um SaaS (Software as a Service) demonstrando as habilidades de um desenvolvedor Full-Stack. O projeto foca em entregar uma experiência imersiva ao usuário enquanto realiza a captação de leads e a entrega de valor imediato através de um relatório gerado em tempo real.

O diferencial deste projeto é a sua arquitetura, que integra Front-end, Lógica de Negócio e Banco de Dados.

🚀 Funcionalidades Principais (Full-Stack Simulado)

Design Imersivo: Interface responsiva com tema "Galáxia" e efeito de "Glassmorphism" (Vidro Escuro) para criar um visual místico e moderno.

Lógica de Numerologia: Algoritmos próprios em JavaScript para calcular: Caminho de Vida, Ano Pessoal e Signo Solar.

Geração de PDF (Legível): Conversão do relatório HTML para arquivo .pdf com html2pdf.js, utilizando ajuste de estilo para garantir legibilidade máxima em impressão (Fundo Branco/Letra Preta).

Captura de Leads (Firebase): Integração Real com o Firestore Database para salvar automaticamente Nome, E-mail e WhatsApp do cliente no momento do checkout.

Validação Robusta: Bloqueio de dados inválidos (datas futuras, e-mails incorretos) com feedback visual.

Simulação de Fluxo de Pagamento: Demonstração do fluxo de UX após pagamento ser aprovado (pronto para receber um link do Stripe/Mercado Pago).

🛠️ Tecnologias Utilizadas

Categoria

Tecnologia

Uso

Front-end / Core

React.js (Vite)

Construção da interface reativa e rotas virtuais.

Estilização

CSS3 (Puro)

Estilização avançada para o tema "Vidro Cósmico".

Banco de Dados

Firebase (Firestore)

Persistência de dados (Leads) na nuvem.

Documentação

html2pdf.js

Geração de arquivos PDF a partir do HTML.

Ícones

Lucide React

Biblioteca de ícones leves.

⚡ Como rodar localmente

Clone o repositório:

git clone [https://github.com/AdamRic95/oraculo-mistico-saas.git](https://github.com/AdamRic95/oraculo-mistico-saas.git)


Instale as dependências:

cd oraculo-mistico-saas
npm install


Configure o Firebase:

Crie um projeto no Firebase Console.

Crie um arquivo src/firebase.js com suas credenciais para que o salvamento de leads funcione.

Inicie o servidor:

npm run dev


Acesse: Abra http://localhost:5173 no seu navegador.

Desenvolvido por Adam Mendes
[\[Link para seu LinkedIn\]](https://www.linkedin.com/in/adamrichardmendes)