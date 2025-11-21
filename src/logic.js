// src/logic.js

// BANCO DE DADOS DE TEXTOS
export const ORACLE_DATA = {
  signs: {
    aries: "Áries: A chama iniciadora. Energia, impulsividade e coragem marcam sua essência.",
    touro: "Touro: A força da terra. Persistência, sensualidade e busca por segurança material.",
    gemeos: "Gêmeos: O mensageiro. Curiosidade intelectual, adaptabilidade e comunicação.",
    cancer: "Câncer: O protetor. Sensibilidade, intuição e forte conexão com as raízes.",
    leao: "Leão: O rei. Criatividade, nobreza de espírito e necessidade de brilhar.",
    virgem: "Virgem: O analista. Perfeccionismo, serviço e atenção aos detalhes práticos.",
    libra: "Libra: O diplomata. Busca por harmonia, beleza e parcerias equilibradas.",
    escorpiao: "Escorpião: O transformador. Intensidade, mistério e poder de regeneração.",
    sagitario: "Sagitário: O explorador. Otimismo, busca pela verdade e expansão de horizontes.",
    capricornio: "Capricórnio: O realizador. Ambição, disciplina e foco no longo prazo.",
    aquario: "Aquário: O visionário. Originalidade, independência e foco no coletivo.",
    peixes: "Peixes: O místico. Compaixão, imaginação fértil e conexão espiritual."
  },
  lifePath: {
    1: "Líder nato. Veio para inovar, liderar e ser independente.",
    2: "O pacificador. Veio para cooperar, amar e trazer harmonia.",
    3: "O comunicador. Veio para se expressar com criatividade e alegria.",
    4: "O construtor. Veio para trabalhar duro e criar bases sólidas.",
    5: "O aventureiro. Veio para experimentar a liberdade e as mudanças.",
    6: "O cuidador. Veio para nutrir a família e servir a comunidade.",
    7: "O sábio. Veio para buscar a verdade espiritual e o autoconhecimento.",
    8: "O executivo. Veio para lidar com poder, dinheiro e autoridade.",
    9: "O humanitário. Veio para finalizar ciclos e ajudar a humanidade."
  }
};

// FUNÇÕES MATEMÁTICAS
const reduceNumber = (num) => {
  while (num > 9) {
    num = num.toString().split('').reduce((acc, val) => acc + parseInt(val), 0);
  }
  return num;
};

export const calculateLifePath = (birthDateString) => {
  if (!birthDateString) return 0;
  const clean = birthDateString.replace(/\D/g, '');
  let sum = 0;
  for (let char of clean) sum += parseInt(char);
  return reduceNumber(sum);
};

export const calculatePersonalYear = (birthDateString) => {
  if (!birthDateString) return 0;
  const parts = birthDateString.split('-');
  const day = parseInt(parts[2]);
  const month = parseInt(parts[1]);
  const currentYear = new Date().getFullYear();
  let sum = day + month + currentYear;
  return reduceNumber(sum);
};

export const getZodiacSign = (day, month) => {
  const d = parseInt(day);
  const m = parseInt(month);
  if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return { name: "Áries", key: "aries" };
  if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return { name: "Touro", key: "touro" };
  if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return { name: "Gêmeos", key: "gemeos" };
  if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return { name: "Câncer", key: "cancer" };
  if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return { name: "Leão", key: "leao" };
  if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return { name: "Virgem", key: "virgem" };
  if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return { name: "Libra", key: "libra" };
  if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return { name: "Escorpião", key: "escorpiao" };
  if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return { name: "Sagitário", key: "sagitario" };
  if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return { name: "Capricórnio", key: "capricornio" };
  if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return { name: "Aquário", key: "aquario" };
  return { name: "Peixes", key: "peixes" };
};