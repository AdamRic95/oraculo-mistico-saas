import React, { useState } from 'react';
import { Moon, Star, Lock, ArrowRight, CheckCircle, Download, CreditCard, ScrollText, Play, Pause, AlertCircle, Mail } from 'lucide-react';
import './App.css';
import { getZodiacSign, calculateLifePath, calculatePersonalYear } from './logic';
import html2pdf from 'html2pdf.js';

// Importa o banco de dados
import { db } from './firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; 

export default function App() {
  const [view, setView] = useState('landing');
  const [userData, setUserData] = useState({ name: '', email: '', whatsapp: '', birthdate: '' });
  const [errors, setErrors] = useState({});
  const [results, setResults] = useState(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Loading do salvamento

  // Máscara de Telefone
  const maskPhone = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'whatsapp') {
      setUserData({ ...userData, [name]: maskPhone(value) });
    } else {
      setUserData({ ...userData, [name]: value });
    }
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  // Validação
  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!userData.name.trim() || userData.name.trim().split(' ').length < 2) {
      newErrors.name = "Digite seu nome completo.";
      isValid = false;
    }

    const birthDate = new Date(userData.birthdate);
    const today = new Date();
    if (!userData.birthdate) {
      newErrors.birthdate = "Data obrigatória.";
      isValid = false;
    } else if (birthDate > today) {
      newErrors.birthdate = "Data inválida (futuro).";
      isValid = false;
    } else if (birthDate.getFullYear() < 1900) {
      newErrors.birthdate = "Data inválida (muito antiga).";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email || !emailRegex.test(userData.email)) {
      newErrors.email = "E-mail inválido.";
      isValid = false;
    }

    if (userData.whatsapp.length < 14) {
      newErrors.whatsapp = "WhatsApp inválido.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // --- INTEGRAÇÃO COM FIREBASE (Salvar Lead) ---
  const saveLeadToFirebase = async () => {
    try {
      setIsSaving(true);
      // Tenta salvar na coleção "clientes"
      await addDoc(collection(db, "clientes"), {
        name: userData.name,
        email: userData.email,
        whatsapp: userData.whatsapp,
        birthdate: userData.birthdate,
        status: "iniciou_checkout", // Status inicial
        created_at: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error("Erro ao salvar no Firebase:", error);
      // Mesmo com erro, deixamos prosseguir para não travar o usuário
      return true; 
    } finally {
      setIsSaving(false);
    }
  };

  const handleGoToCheckout = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Salva no banco antes de ir para o pagamento
      await saveLeadToFirebase();
      setView('checkout');
      window.scrollTo(0,0);
    }
  };

  // --- INTEGRAÇÃO COM STRIPE (Simulação de Link) ---
  const handleStripePayment = () => {
    // AQUI VAI O SEU LINK DO STRIPE REAL
    const stripeLink = "https://buy.stripe.com/seulink"; 
    
    // window.location.href = stripeLink; // Descomente isso para ir para o Stripe real
    
    // Por enquanto, simula sucesso:
    handlePaymentSuccess();
  };

  const handlePaymentSuccess = () => {
    setView('processing');
    
    setTimeout(() => {
      try {
        const parts = userData.birthdate.split('-');
        const sign = getZodiacSign(parts[2], parts[1]);
        const lifePath = calculateLifePath(userData.birthdate);
        const personalYear = calculatePersonalYear(userData.birthdate);

        setResults({
          sign,
          lifePath,
          personalYear,
          generationDate: new Date().toLocaleDateString('pt-BR'),
          transactionId: Math.random().toString(36).substr(2, 9).toUpperCase()
        });

        setView('result');
        window.scrollTo(0,0);
      } catch (error) {
        alert("Erro ao calcular. Verifique a data.");
        setView('landing');
      }
    }, 3000);
  };

  const handleSendEmail = () => {
    setIsGeneratingPdf(true);
    setTimeout(() => {
      setIsGeneratingPdf(false);
      setEmailSent(true);
    }, 2000);
  };

  const generatePDF = () => {
    const element = document.getElementById('pdf-content');
    element.classList.add('pdf-mode');

    const opt = {
      margin:       [10, 10, 10, 10],
      filename:     `Mapa_Astral_${userData.name.replace(/\s+/g, '_')}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      element.classList.remove('pdf-mode');
    });
  };

  return (
    <div className="app-container">
      
      {/* TELA 1: LANDING */}
      {view === 'landing' && (
        <>
          <header className="header">
            <Moon color="#fbbf24" size={28} fill="#fbbf24" />
            <span className="logo-text">Oráculo Místico</span>
          </header>

          <section className="hero-section">
            <span className="tagline">✨ Descubra o que os astros dizem</span>
            <h1 className="main-title">
              Sua Jornada Cabalística <br />
              <span className="highlight">Revelada Agora</span>
            </h1>
            <p className="description">
              Receba um dossiê completo em PDF com a análise do seu Caminho de Vida, Ano Pessoal e Signo Solar.
            </p>
            
            <button onClick={() => document.getElementById('form').scrollIntoView({behavior: 'smooth'})} className="btn-primary">
              Quero Minha Leitura <ArrowRight size={20} />
            </button>
            <p style={{marginTop: '20px', color: '#d8b4fe', fontSize: '0.9rem'}}>
              OFERTA ESPECIAL: <strong style={{color: '#fbbf24'}}>R$ 37,97</strong>
            </p>
          </section>

          <section id="form" className="form-card">
            <div style={{textAlign: 'center', marginBottom: '30px'}}>
              <h3 style={{fontSize: '2rem', color: 'white', marginBottom: '10px'}}>Inicie Sua Consulta</h3>
              <p style={{color: '#a5b4fc'}}>Preencha seus dados para gerar seu mapa.</p>
            </div>

            <form onSubmit={handleGoToCheckout}>
              <div className="form-group">
                <label>Nome Completo</label>
                <input type="text" name="name" value={userData.name} onChange={handleInputChange} placeholder="Ex: Maria Silva" className={errors.name ? 'input-error' : ''} />
                {errors.name && <span className="error-msg"><AlertCircle size={14}/> {errors.name}</span>}
              </div>
              <div className="form-group">
                <label>Data de Nascimento</label>
                <input type="date" name="birthdate" value={userData.birthdate} onChange={handleInputChange} className={errors.birthdate ? 'input-error' : ''} />
                {errors.birthdate && <span className="error-msg"><AlertCircle size={14}/> {errors.birthdate}</span>}
              </div>
              <div className="form-group">
                <label>E-mail</label>
                <input type="email" name="email" value={userData.email} onChange={handleInputChange} placeholder="seu@email.com" className={errors.email ? 'input-error' : ''} />
                {errors.email && <span className="error-msg"><AlertCircle size={14}/> {errors.email}</span>}
              </div>
              <div className="form-group">
                <label>WhatsApp</label>
                <input type="tel" name="whatsapp" value={userData.whatsapp} onChange={handleInputChange} placeholder="(00) 00000-0000" maxLength={15} className={errors.whatsapp ? 'input-error' : ''} />
                {errors.whatsapp && <span className="error-msg"><AlertCircle size={14}/> {errors.whatsapp}</span>}
              </div>
              
              <button type="submit" className="btn-primary" style={{width: '100%'}} disabled={isSaving}>
                {isSaving ? 'Salvando dados...' : <>Ir para Pagamento Seguro <Lock size={18} /></>}
              </button>
              
              <p style={{textAlign: 'center', marginTop: '20px', fontSize: '0.8rem', color: '#94a3b8', display: 'flex', justifyContent: 'center', gap: '5px', alignItems:'center'}}>
                <CheckCircle size={14} color="#10b981" /> AMBIENTE CRIPTOGRAFADO
              </p>
            </form>
          </section>
        </>
      )}

      {/* TELA 2: CHECKOUT */}
      {view === 'checkout' && (
        <div className="checkout-card">
          <div className="checkout-header">
            <h3 style={{margin:0, display:'flex', alignItems:'center', gap:'10px', color:'white'}}>
              <CreditCard size={24} color="#fbbf24"/> RESUMO DO PEDIDO
            </h3>
            <button onClick={() => setView('landing')} style={{background:'none', border:'none', color:'#d8b4fe', cursor:'pointer', fontWeight:'bold', fontSize:'0.9rem'}}>VOLTAR</button>
          </div>
          <div className="price-tag">
            <h3>Consulta Cabalístico-Astral (PDF)</h3>
            <p>R$ 37,97</p>
          </div>
          <p style={{marginBottom: '20px', fontWeight: 'bold', color: '#e2e8f0', textAlign:'center'}}>ESCOLHA A FORMA DE PAGAMENTO:</p>
          
          {/* Botão do Stripe */}
          <button onClick={handleStripePayment} className="btn-pix">
            Pagar Agora (Stripe Checkout)
          </button>
          
          <p style={{textAlign: 'center', fontSize: '0.8rem', color: '#64748b', marginTop: '25px'}}>
            Ambiente Seguro. Suas informações estão protegidas.
          </p>
        </div>
      )}

      {/* TELA 3: PROCESSANDO */}
      {view === 'processing' && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2 style={{fontSize: '2.5rem', color: 'white', fontFamily: 'serif', marginBottom:'10px'}}>Consultando os Astros...</h2>
          <p style={{color: '#d8b4fe', fontSize:'1.2rem'}}>Calculando numerologia para {userData.name}...</p>
        </div>
      )}

      {/* TELA 4: RESULTADO FINAL */}
      {view === 'result' && results && (
        <div className="app-container" style={{justifyContent: 'flex-start', paddingTop: '40px'}}>
          
          <div id="pdf-content" className="result-paper">
            <div style={{textAlign: 'center'}}>
              <div style={{display:'flex', justifyContent:'center'}}>
               <Moon size={60} color="#fbbf24" fill="#fbbf24" style={{marginBottom: '15px', filter: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.5))'}} />
              </div>
              <h1 style={{margin: 0}}>ORÁCULO MÍSTICO</h1>
              <p style={{letterSpacing: '4px', fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '40px'}}>Dossiê Cabalístico Pessoal</p>
            </div>

            <div className="client-info">
              <h2 style={{margin: '0 0 20px 0', color: '#fff'}}>{userData.name}</h2>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', fontSize: '0.95rem', color:'#e2e8f0'}}>
                <div><strong style={{color:'#a5b4fc'}}>Nascimento:</strong><br/>{new Date(userData.birthdate + 'T12:00:00').toLocaleDateString('pt-BR')}</div>
                <div><strong style={{color:'#a5b4fc'}}>Signo:</strong><br/>{results.sign.name}</div>
                <div><strong style={{color:'#a5b4fc'}}>Caminho:</strong><br/>{results.lifePath}</div>
              </div>
              <p style={{fontSize: '0.7rem', color: '#64748b', marginTop: '15px'}}>ID Transação: {results.transactionId}</p>
            </div>

            <div className="result-section">
              <h3><span className="badge-number">1</span> Seu Caminho de Vida: {results.lifePath}</h3>
              <p>O Caminho de Vida {results.lifePath} revela sua missão principal. Você veio a este mundo com talentos específicos que precisam ser desenvolvidos. Sua jornada é marcada pela busca de aprendizado e evolução constante nestas áreas.</p>
            </div>

            <div className="result-section">
              <h3><span className="badge-number">2</span> Sua Essência Solar: {results.sign.name}</h3>
              <p>Como nativo de {results.sign.name}, sua energia vital é irradiada com força única. Isso define como você brilha no mundo e como as pessoas percebem sua presença imediata.</p>
            </div>

            <div className="result-section">
              <h3><span className="badge-number">3</span> Ano Pessoal: {results.personalYear}</h3>
              <p>Você está vibrando na energia do número {results.personalYear}. Este é um ciclo importante que pede foco nos temas regidos por este número. Aproveite este momento para alinhar seus objetivos com esta vibração cósmica.</p>
            </div>

            <div style={{textAlign: 'center', fontSize: '0.8rem', color: '#64748b', marginTop: '50px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '25px'}}>
              © {new Date().getFullYear()} Oráculo Místico • Gerado em {results.generationDate}
            </div>
          </div>
          
          <div style={{width: '90%', maxWidth: '700px', marginBottom: '50px', textAlign: 'center'}}>
            {!emailSent ? (
              <button onClick={handleSendEmail} className="btn-primary" style={{marginTop: '35px', width: '100%', borderRadius: '12px'}} disabled={isGeneratingPdf}>
                  {isGeneratingPdf ? <>Enviando...</> : <><Mail size={20} /> ENVIAR MEU MAPA POR E-MAIL</>}
              </button>
            ) : (
              <div style={{marginTop: '35px', padding: '20px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '12px', border: '1px solid #10b981', color: '#fff'}}>
                <h3 style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}><CheckCircle /> E-mail Enviado com Sucesso!</h3>
                <p style={{fontSize: '0.9rem', marginTop: '5px'}}>Verifique a caixa de entrada de {userData.email}. O link de acesso é único e seguro.</p>
              </div>
            )}
            <button onClick={generatePDF} className="btn-secondary" style={{background: 'transparent', border: '1px solid #a855f7', color: '#d8b4fe', padding: '12px 30px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', marginTop: '15px', fontSize: '0.9rem'}}>
              Baixar cópia local (Backup)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}