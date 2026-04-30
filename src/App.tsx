/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Link } from 'react-router-dom';
import {
  Triangle,
  Search,
  ChevronDown,
  ChevronRight,
  CreditCard,
  ShieldCheck,
  AlertCircle,
  Instagram,
  Linkedin,
  Facebook,
  MessageCircle,
  CheckCircle2,
  Lock,
  Wallet,
  Scale,
  Briefcase,
  PlusCircle,
  Zap,
  FileText,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import MeusPedidosPage from './pages/MeusPedidosPage';
import DadosUsuarioPage from './pages/DadosUsuarioPage';
import IndicacaoPage from './pages/IndicacaoPage';
import ComissoesPage from './pages/ComissoesPage';
import ContaCorrentePage from './pages/ContaCorrentePage';
import SaquePage from './pages/SaquePage';
import FAQPage from './pages/FAQPage';

// --- Types ---
type CheckoutStage = 'selection' | 'form' | 'confirmation' | 'checkout';

interface FormField {
  label: string;
  type: 'text' | 'date' | 'email' | 'tel' | 'select' | 'textarea';
  placeholder?: string;
  options?: string[];
  optional?: boolean;
  info?: string;
}

interface ServiceItem {
  name: string;
  subtitle?: string;
  price: number;
  tag?: string;
  fields: FormField[];
  urgentNotice?: string;
}

interface Category {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  items: ServiceItem[];
  isExpanded?: boolean;
}

const clientNames = [
  "Kayk D. - Indaiatuba/SP", "Erik E. - Tabatinga/AM", "Luis F. - Rio de Janeiro/RJ",
  "Liliana R. - São Paulo/SP", "CLAUDIO F. - Brotas/SP", "Renato T. - São Paulo/SP",
  "Antonio C. - Itapira/SP", "Raudinei T. - Ribeirão das Neves/MG", "José P. - Rio de Janeiro/...RJ",
  "Waltécio G. - Itapetininga/SP", "Lúcia E. - Taquari/RS", "Carin K. - Guarulhos/SP",
  "Rui A. - São Paulo/SP", "Luiza M. - Cuiabá/MT", "Marta B. - Curitiba/PR",
  "Luiz B. - Recife/PE", "Anezia A. - Nova Lima/MG", "Rozanilde F. - São Luís/MA",
  "AGNO F. - Várzea Grande/MT", "Roselaine J. - Joinville/SC", "THIAGO A. - Curitiba/PR",
  "CARLOS H. - Rio de Janeiro/RJ", "SÉRGIO D. - Rio de Janeiro/RJ", "Josemir C. - Brasília/DF",
  "Edimir L. - Manaus/AM", "Juliana D. - Presidente Prudente/SP", "Sonia C. - Belo Horizonte/MG",
  "ELDER A. - Feira de Santana/BA", "maria D. - Maceió/Alagoas", "UBIRAJARA G. - Cuiabá/MT",
  "Mariano M. - Gaspar/SC", "matheus S. - Itaquaquecetuba/SP", "Junot C. - Curitiba/PR",
  "Sonia S. - Rio de Janeiro/RJ", "Roberto G. - Lauro de Freitas/BA", "LEANA D. - Rio de Janeiro/RJ",
  "Francisca S. - Fortaleza/Ce", "silvio P. - Araçatuba/SP", "Ednelsa R. - Uberaba/MG",
  "euter J. - Linhares/ES", "Nilce A. - São Bernardo do Campo /SP", "André P. - São Gonçalo/RJ",
  "Ricardo P. - Rio de Janeiro/RJ", "Rosângela V. - Campinas/SP", "Maria D. - Santo André/SP",
  "CRISTIANE T. - São José/SC", "DEISE P. - Lapão/BA", "Conceição D. - Brasília/DF",
  "Diego M. - São Paulo/SP", "Ana P. - Belém/PA", "Ana C. - Magé/RJ",
  "Sergio A. - Dourados/MS", "Walquiria D. - Poços de Caldas/MG", "michele D. - Itanhaém/SP",
  "Elizabeth D. - Rio de Janeiro/RJ", "Alexsandra O. - Fortaleza/CE", "IARA A. - Brasilia/Distrito Federal",
  "Américo G. - São Paulo/SP", "siegmar B. - Curitiba/PR", "José N. - Campinas/SP",
  "Maria I. - Teresina/PI", "Vanessa V. - Belém/PA", "Rui D. - São Paulo/SP",
  "MARIA R. - Uruguaiana/RS", "JULIANO W. - Porto Alegre/RS", "Carlos V. - Mirassol/SP",
  "cleusiane M. - Campinas/SP", "Anderson R. - Maceió/AL", "Cezar J. - Rio de Janeiro/RJ",
  "Aref S. - Assis/SP", "LOURIVAL P. - Araguari/MG", "Francisco C. - Campinas/SP",
  "Lourival P. - Araguari/MG", "Emerson M. - Rolim de Moura/RO", "TIAGO B. - Paracatu/MG",
  "Giovana R. - Santana de Parnaíba/SP", "TANIA M. - São José dos Campos/SP", "Ariane P. - São Paulo /Sp",
  "Helem C. - Brasília/DF", "Sergio L. - Santana de Parnaíba/SP", "Isabella M. - Dores do Indaiá/MG",
  "Eliana D. - Tremembé/SP", "Bruna F. - Porto Alegre/RS", "Maurício M. - São Paulo/SP",
  "Inês C. - Brasília/DF", "Edgar E. - Matupá/MT", "Lourival P. - Araguari/MG",
  "Leonardo C. - Criciúma/SC", "Thiago U. - Recife/PE", "Roberta F. - Prado Ferreira/PR",
  "DAISE A. - Cidade Ocidental/GO", "Marina R. - Rio de Janeiro/RJ", "marinea F. - Rio de Janeiro/RJ",
  "nelson C. - São Paulo/SP", "Caroline B. - Santo Ângelo/RS", "Simone R. - Indaiatuba/SP",
  "maria L. - São Paulo/SP", "Fábio E. - Goiânia/GO", "Vanuza C. - Brumadinho/MG",
  "CHRISTOVÃO D. - Brasília/DF"
];

// --- Components ---

const Checkout = ({
  service,
  formValues,
  fetchedData,
  onBack,
  totalPrice,
  quantity
}: {
  service: ServiceItem;
  formValues: Record<string, string>;
  fetchedData: any;
  onBack: () => void;
  totalPrice: number;
  quantity: number;
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);

  const handlePayment = async () => {
    setIsLoadingPayment(true);
    try {
      const response = await axios.post('/api/kiwify/create-payment', {
        service: {
          ...service,
          price: totalPrice, // Send the total price including quantity
          quantity
        },
        customer: {
          name: formValues['Nome completo'] || formValues['NOME COMPLETO'] || 'Cliente',
          email: formValues['EMAIL'] || 'cliente@exemplo.com',
          document: formValues['CPF'] || formValues['CNPJ'] || formValues['CNPJ MEI'] || formValues['CPF/CNPJ'] || '',
          phone: formValues['Telefone / WhatsApp'] || ''
        }
      });

      if (response.data.checkout_url) {
        window.location.href = response.data.checkout_url;
      }
    } catch (error: any) {
      console.error('Erro ao processar pagamento:', error);
      const errorMsg = error.response?.data?.details || error.response?.data?.error || 'Erro ao processar o pagamento. Por favor, tente novamente.';
      alert(errorMsg);
    } finally {
      setIsLoadingPayment(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="rounded-3xl border border-gray-200 bg-white p-6 md:p-10 shadow-2xl shadow-blue-900/5 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Lock className="h-32 w-32" />
      </div>

      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-xs font-black text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest"
      >
        <ChevronRight className="h-4 w-4 rotate-180" />
        Voltar e Corrigir Dados
      </button>

      <div className="mb-10 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Checkout Seguro</h3>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sua solicitação está sendo processada</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Order Info */}
        <div className="space-y-8">
          <div className="rounded-2xl bg-gray-50/80 p-8 border border-gray-100">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Resumo da Solicitação</h4>
            
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Serviço Selecionado</span>
                <span className="text-xs font-black text-blue-900 uppercase">{service.name} {quantity > 1 && `(${quantity}x)`}</span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-200/50 pt-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Documento</span>
                <span className="text-xs font-black text-gray-900 uppercase">
                  {formValues['CPF'] || formValues['CNPJ'] || formValues['CNPJ MEI'] || formValues['CPF/CNPJ']}
                </span>
              </div>
              {fetchedData && !fetchedData.isError && (
                <div className="flex justify-between items-start border-t border-gray-200/50 pt-4">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Nome do Titular</span>
                  <span className="text-xs font-black text-gray-900 text-right max-w-[200px] uppercase">{fetchedData.companyName}</span>
                </div>
              )}
              <div className="flex justify-between items-center border-t-2 border-dashed border-gray-300 pt-6 mt-6">
                <span className="text-sm font-black text-gray-900 uppercase">Valor Total</span>
                <div className="text-right">
                  <span className="block text-3xl font-black text-blue-600 leading-none">
                    R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Taxas inclusas</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl bg-emerald-50 p-5 text-emerald-800 border border-emerald-100">
            <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-200">
              <Lock className="h-3 w-3" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-black uppercase tracking-widest">Ambiente Protegido</p>
              <p className="text-[10px] font-bold leading-relaxed uppercase opacity-80">
                Seus dados pessoais e de pagamento estão protegidos pela Lei Geral de Proteção de Dados (LGPD).
              </p>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-8">
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Selecione o Método de Pagamento</h4>

          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => setPaymentMethod('pix')}
              className={`group flex items-center justify-between rounded-2xl border-2 p-5 transition-all duration-300 ${paymentMethod === 'pix' ? 'border-blue-600 bg-blue-50/50 shadow-xl shadow-blue-900/5 scale-[1.02]' : 'border-gray-100 hover:border-gray-200 grayscale opacity-70'
                }`}
            >
              <div className="flex items-center gap-5">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-all ${paymentMethod === 'pix' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 rotate-0' : 'bg-gray-100 text-gray-400 rotate-[-5deg]'}`}>
                  <Zap className="h-7 w-7" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-black text-gray-900 uppercase tracking-tighter">PIX <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full ml-2">POPULAR</span></p>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Liberação instantânea</p>
                </div>
              </div>
              <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'pix' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                {paymentMethod === 'pix' && <CheckCircle2 className="h-4 w-4" />}
              </div>
            </button>

            <button
              onClick={() => setPaymentMethod('card')}
              className={`group flex items-center justify-between rounded-2xl border-2 p-5 transition-all duration-300 ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50/50 shadow-xl shadow-blue-900/5 scale-[1.02]' : 'border-gray-100 hover:border-gray-200 grayscale opacity-70'
                }`}
            >
              <div className="flex items-center gap-5">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-all ${paymentMethod === 'card' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 rotate-0' : 'bg-gray-100 text-gray-400 rotate-[-5deg]'}`}>
                  <CreditCard className="h-7 w-7" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-black text-gray-900 uppercase tracking-tighter">Cartão de Crédito</p>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Parcelado em até 12x</p>
                </div>
              </div>
              <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                {paymentMethod === 'card' && <CheckCircle2 className="h-4 w-4" />}
              </div>
            </button>
          </div>

          <button
            disabled={isLoadingPayment}
            className={`group relative w-full overflow-hidden rounded-2xl py-6 text-lg font-black text-white shadow-2xl transition-all active:scale-[0.98] ${isLoadingPayment ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-500 shadow-emerald-200 hover:bg-emerald-600 hover:-translate-y-1'
              }`}
            onClick={handlePayment}
          >
            <div className="relative z-10 flex items-center justify-center gap-3">
              {isLoadingPayment ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>PROCESSANDO...</span>
                </>
              ) : (
                <>
                  <span>{paymentMethod === 'pix' ? 'GERAR QR CODE PIX' : 'PAGAR COM CARTÃO'}</span>
                  <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </div>
            {!isLoadingPayment && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />}
          </button>

          <div className="flex items-center justify-center gap-8 opacity-30 grayscale hover:opacity-60 transition-opacity">
            <img src="https://logodownload.org/wp-content/uploads/2014/07/visa-logo-1.png" alt="Visa" className="h-4 object-contain" referrerPolicy="no-referrer" />
            <img src="https://logodownload.org/wp-content/uploads/2014/07/mastercard-logo-7.png" alt="Mastercard" className="h-6 object-contain" referrerPolicy="no-referrer" />
            <img src="https://logodownload.org/wp-content/uploads/2020/10/pix-logo-2.png" alt="Pix" className="h-5 object-contain" referrerPolicy="no-referrer" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};



function HomePage() {

  const [peopleOnline, setPeopleOnline] = useState(55);
  const [remainingServices, setRemainingServices] = useState(35);

  useEffect(() => {
    const interval = setInterval(() => {
      setPeopleOnline(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const next = prev + change;
        return next < 30 ? 30 : next > 80 ? 80 : next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Initial decrease after 5 seconds
    const timeout = setTimeout(() => {
      setRemainingServices(prev => prev - 1);
    }, 5000);

    const interval = setInterval(() => {
      setRemainingServices(prev => {
        if (prev <= 5) return prev;
        // Moderate probability of decrease
        const shouldDecrease = Math.random() > 0.4;
        if (shouldDecrease) {
          const amount = Math.random() > 0.95 ? 2 : 1;
          const next = prev - amount;
          return next < 5 ? 5 : next;
        }
        return prev;
      });
    }, 15000); // Every 15 seconds
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [stage, setStage] = useState<CheckoutStage>('form');
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [fetchedData, setFetchedData] = useState<{ companyName?: string; tradeName?: string } | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [priceUnlocked, setPriceUnlocked] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [formStep, setFormStep] = useState(1);
  const [quantity, setQuantity] = useState(1);

  const categories: Category[] = [
    {
      id: 'passaporte',
      title: 'Emissão de Passaporte',
      icon: <Briefcase className="h-5 w-5" />,
      items: [
        {
          name: 'Nova solicitação de passaporte',
          price: 407.15,
          tag: 'Mais Procurado',
          urgentNotice: 'ATENÇÃO: Devido à alta demanda, as vagas para agendamento de emissão estão limitadas. Garanta seu processo agora.',
          fields: [
            // DADOS PESSOAIS
            { label: 'Nome completo', type: 'text', placeholder: 'Seu nome completo' },
            { label: 'Sexo', type: 'select', options: ['MASCULINO', 'FEMININO'] },
            { label: 'Data de nascimento', type: 'date' },
            { label: 'Filiação 1 (Nome)', type: 'text' },
            { label: 'Filiação 2 (Nome)', type: 'text', optional: true },
            { label: 'Nacionalidade', type: 'text', placeholder: 'BRASILEIRA' },
            { label: 'Raça ou cor', type: 'select', options: ['BRANCA', 'PRETA', 'PARDA', 'AMARELA', 'INDÍGENA', 'NÃO DECLARADA'] },
            { label: 'Estado civil', type: 'select', options: ['SOLTEIRO(A)', 'CASADO(A)', 'DIVORCIADO(A)', 'VIÚVO(A)', 'SEPARADO(A) JUDICIALMENTE', 'UNIÃO ESTÁVEL'] },

            // DOCUMENTOS
            { label: 'CPF', type: 'text', placeholder: '000.000.000-00' },
            { label: 'Identidade (RG)', type: 'text' },
            { label: 'Órgão Emissor', type: 'text' },
            { label: 'Data de Emissão (RG)', type: 'date' },

            // DADOS COMPLEMENTARES
            { label: 'Profissão', type: 'text' },
            { label: 'EMAIL', type: 'email', placeholder: 'seu@email.com' },
            { label: 'Telefone / WhatsApp', type: 'tel', placeholder: '(00) 00000-0000' },
            { label: 'CEP', type: 'text', placeholder: '00000-000' },
            { label: 'Endereço', type: 'text' },
            { label: 'Número', type: 'text' },
            { label: 'Cidade', type: 'text' },
            { label: 'UF', type: 'text' },
          ]
        },
      ]
    },

  ];

  // Auto-select the only service available
  const autoService = categories[0].items[0];
  const autoCategory = categories[0].title;
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(autoService);
  const totalPrice = (selectedService?.price || 0) * quantity;

  useEffect(() => {
    setFetchedData(null);
    setFormValues({});
    setPriceUnlocked(false);
  }, [selectedService]);

  // Ensure service and category are set on mount
  useEffect(() => {
    if (!selectedService) {
      setSelectedService(autoService);
      setSelectedCategory(autoCategory);
    }
  }, []);

  const handleSelectService = (service: ServiceItem, categoryTitle: string) => {
    setSelectedService(service);
    setSelectedCategory(categoryTitle);
    setStage('form');
    setFetchedData(null);
    setPriceUnlocked(false);
  };

  const handleFinalize = () => {
    setStage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToForm = () => {
    setStage('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmData = async (manualValue?: string) => {
    // Always unlock price when this is called (from the button)
    setPriceUnlocked(true);

    const cnpjValue = (typeof manualValue === 'string' ? manualValue : null) || formValues['CNPJ'] || formValues['CNPJ MEI'] || formValues['CPF/CNPJ'];
    const cpfValue = formValues['CPF'];

    // Prioritize CNPJ for the data box
    const valueToProcess = cnpjValue || cpfValue;
    if (!valueToProcess) return;

    const cleanValue = valueToProcess.replace(/\D/g, '');

    if (cleanValue.length === 14) {
      setIsLoadingData(true);
      setFetchedData(null);

      try {
        const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanValue}`);
        if (!response.ok) throw new Error('CNPJ não encontrado');

        const data = await response.json();
        setFetchedData({
          companyName: data.razao_social,
          tradeName: data.nome_fantasia || data.razao_social,
          isError: false
        });
      } catch (error) {
        console.error('Erro ao buscar CNPJ:', error);
        setFetchedData({
          companyName: "CNPJ NÃO ENCONTRADO",
          tradeName: "VERIFIQUE O NÚMERO OU TENTE NOVAMENTE",
          isError: true
        });
      } finally {
        setIsLoadingData(false);
      }
    } else if (cleanValue.length === 11) {
      // For CPF, we just unlock the price and set a mock fetchedData 
      // so the user can proceed to checkout (Gestão de MEI flow)
      setFetchedData({
        companyName: formValues['Nome completo'] || formValues['NOME COMPLETO'] || 'CLIENTE PESSOA FÍSICA',
        tradeName: 'DOCUMENTO CPF VALIDADO',
        isError: false
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
      {/* --- Header & Top Bars --- */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        {/* Main Nav */}
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <div className="flex items-center gap-2">
            <img
              src="/img/Regularize Digital.png"
              alt="Regulariza Digital"
              className="h-[124px] w-auto object-contain"
            />
          </div>
          <nav className="hidden items-center gap-8 text-xs font-bold text-gray-600 md:flex">
            <a href="#" className="hover:text-blue-600">HOME</a>
            <a href="#" className="hover:text-blue-600">PARA EMPRESAS</a>
            <a href="#" className="hover:text-blue-600">ACOMPANHAR SOLICITAÇÕES</a>
            <div className="h-4 w-[1px] bg-gray-300" />
            <Link to="/login" className="hover:text-blue-600">Entrar | Cadastrar</Link>
          </nav>
        </div>
      </header>

      {/* Status Bar */}
      <div className="bg-blue-50 py-1.5 text-center">
        <div className="counter">
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
            <span id="contador" className="text-blue-700">{peopleOnline}</span> Pessoas online.
          </p>
        </div>
      </div>

      {/* Main Title Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-400 py-12 text-center">
        <h1 className="text-4xl font-bold text-white uppercase tracking-tighter">Emissão de Passaporte Nacional</h1>
        <p className="text-blue-100 font-bold mt-2 text-sm uppercase tracking-widest">Inicie sua solicitação de forma rápida e segura</p>
      </div>

      {/* Client Banner */}
      <div className="bg-white border-b border-gray-200 pt-4 pb-2">
        <div className="mx-auto max-w-7xl px-4 md:px-8 mb-3">
          <p className="text-xs font-bold text-gray-700">
            Pedidos realizados hoje: <span className="text-blue-600 ml-1">118.330</span>
          </p>
        </div>
        <div className="relative overflow-hidden bg-gray-50 py-3 border-y border-gray-100">
          <div className="flex animate-marquee whitespace-nowrap">
            <div className="flex gap-12 pr-12">
              {clientNames.map((name, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-gray-600">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  {name}
                </div>
              ))}
            </div>
            <div className="flex gap-12 pr-12">
              {clientNames.map((name, i) => (
                <div key={`dup-${i}`} className="flex items-center gap-2 text-[11px] font-bold text-gray-600">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <main className="mx-auto max-w-7xl px-4 py-10 pb-32 md:px-8 lg:pb-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* Left Column */}
          <div className={stage === 'checkout' ? 'lg:col-span-3' : 'lg:col-span-2'}>
            {/* Step Indicator */}
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                {stage === 'form' ? '1' : '2'}
              </div>
              <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">
                {stage === 'form' ? 'Informações do Cliente' : 'Checkout e Pagamento'}
              </h2>
            </div>

            {/* Form / Checkout */}
            <AnimatePresence mode="wait">
              {stage === 'form' ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
                >
                  <div className="bg-gray-50 border-b border-gray-100 p-6 flex flex-col gap-4">

                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                      {selectedService?.name}
                    </h3>

                    {/* Step Map (Modem Map) */}
                    <div className="flex items-center justify-between mt-2 px-2">
                      {[
                        { step: 1, label: 'Dados pessoais' },
                        { step: 2, label: 'Documentos' },
                        { step: 3, label: 'Dados complementares' },
                        { step: 4, label: 'Revisar dados' }
                      ].map((s, i, arr) => (
                        <React.Fragment key={s.step}>
                          <div className="flex flex-col items-center gap-2 relative">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${formStep === s.step ? 'bg-blue-600 text-white shadow-lg scale-110' : formStep > s.step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                              {formStep > s.step ? <CheckCircle2 className="h-4 w-4" /> : s.step}
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-tighter text-center whitespace-nowrap absolute -bottom-6 ${formStep === s.step ? 'text-blue-600' : 'text-gray-400'}`}>
                              {s.label}
                            </span>
                          </div>
                          {i < arr.length - 1 && (
                            <div className={`flex-1 h-[2px] mx-2 transition-all ${formStep > s.step ? 'bg-green-500' : 'bg-gray-200'}`} />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  <div className="p-8 pt-12">
                    {/* Urgency Banner */}
                    {selectedService?.urgentNotice && formStep === 1 && (
                      <div className="mb-8 flex items-start gap-4 rounded-xl border border-red-100 bg-red-50 p-5 text-red-800 shadow-sm">
                        <AlertCircle className="h-6 w-6 flex-shrink-0 text-red-600" />
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-black uppercase tracking-widest">Aviso Importante</span>
                          <p className="text-sm font-bold leading-relaxed">
                            {selectedService.urgentNotice}
                          </p>
                        </div>
                      </div>
                    )}

                    <AnimatePresence mode="wait">
                      {formStep === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="grid grid-cols-1 gap-6 md:grid-cols-2"
                        >
                          <div className="md:col-span-2 border-l-4 border-blue-600 pl-4 mb-2">
                            <h4 className="text-sm font-black text-blue-900 uppercase">Dados Pessoais</h4>
                            <p className="text-[10px] text-gray-500 font-bold uppercase">(*) Preenchimento Obrigatório</p>
                          </div>

                          {['Nome completo', 'Sexo', 'Data de nascimento', 'Filiação 1 (Nome)', 'Filiação 2 (Nome)', 'Nacionalidade', 'Raça ou cor', 'Estado civil'].map(label => {
                            const field = selectedService?.fields.find(f => f.label === label);
                            if (!field) return null;
                            return (
                              <div key={label} className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">{label} {field.optional && '(opcional)'}</label>
                                {field.type === 'select' ? (
                                  <select
                                    value={formValues[label] || ''}
                                    onChange={(e) => setFormValues(prev => ({ ...prev, [label]: e.target.value }))}
                                    className="rounded-lg border border-gray-200 bg-gray-50 p-3 outline-none focus:border-blue-500 focus:bg-white"
                                  >
                                    <option value="">Selecione...</option>
                                    {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                                  </select>
                                ) : (
                                  <input
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    value={formValues[label] || ''}
                                    onChange={(e) => setFormValues(prev => ({ ...prev, [label]: e.target.value }))}
                                    className="rounded-lg border border-gray-200 bg-gray-50 p-3 outline-none focus:border-blue-500 focus:bg-white"
                                  />
                                )}
                              </div>
                            );
                          })}
                        </motion.div>
                      )}

                      {formStep === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="grid grid-cols-1 gap-6 md:grid-cols-2"
                        >
                          <div className="md:col-span-2 border-l-4 border-blue-600 pl-4 mb-2">
                            <h4 className="text-sm font-black text-blue-900 uppercase">Documentação</h4>
                            <p className="text-[10px] text-gray-500 font-bold uppercase">(*) Preenchimento Obrigatório</p>
                          </div>
                          {['CPF', 'Identidade (RG)', 'Órgão Emissor', 'Data de Emissão (RG)'].map(label => {
                            const field = selectedService?.fields.find(f => f.label === label);
                            if (!field) return null;
                            return (
                              <div key={label} className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
                                <input
                                  type={field.type}
                                  placeholder={field.placeholder}
                                  value={formValues[label] || ''}
                                  onChange={(e) => {
                                    let val = e.target.value;
                                    if (label === 'CPF') {
                                      val = val.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                                    }
                                    setFormValues(prev => ({ ...prev, [label]: val }));
                                  }}
                                  className="rounded-lg border border-gray-200 bg-gray-50 p-3 outline-none focus:border-blue-500 focus:bg-white"
                                />
                              </div>
                            );
                          })}
                        </motion.div>
                      )}

                      {formStep === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="grid grid-cols-1 gap-6 md:grid-cols-2"
                        >
                          <div className="md:col-span-2 border-l-4 border-blue-600 pl-4 mb-2">
                            <h4 className="text-sm font-black text-blue-900 uppercase">Dados Complementares</h4>
                            <p className="text-[10px] text-gray-500 font-bold uppercase">(*) Preenchimento Obrigatório</p>
                          </div>
                          {['Profissão', 'EMAIL', 'Telefone / WhatsApp', 'CEP', 'Endereço', 'Número', 'Cidade', 'UF'].map(label => {
                            const field = selectedService?.fields.find(f => f.label === label);
                            if (!field) return null;
                            return (
                              <div key={label} className={`flex flex-col gap-2 ${label === 'Endereço' ? 'md:col-span-2' : ''}`}>
                                <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
                                <input
                                  type={field.type}
                                  placeholder={field.placeholder}
                                  value={formValues[label] || ''}
                                  onChange={(e) => {
                                    let val = e.target.value;
                                    if (label === 'CEP') {
                                      val = val.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');
                                    } else if (label === 'Telefone / WhatsApp') {
                                      val = val.replace(/\D/g, '').slice(0, 11).replace(/^(\d{2})(\d)/g, '($1) $2').replace(/(\d)(\d{4})$/, '$1-$2');
                                    }
                                    setFormValues(prev => ({ ...prev, [label]: val }));
                                  }}
                                  className="rounded-lg border border-gray-200 bg-gray-50 p-3 outline-none focus:border-blue-500 focus:bg-white"
                                />
                              </div>
                            );
                          })}
                        </motion.div>
                      )}

                      {formStep === 4 && (
                        <motion.div
                          key="step4"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="space-y-6"
                        >
                          <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                            <h4 className="text-sm font-black text-green-900 uppercase">Confira atentamente as informações abaixo:</h4>
                            <p className="text-[10px] text-green-700 font-bold mt-1 uppercase leading-tight">
                              Caso detecte algum erro nos dados a seguir, volte ao campo correspondente para corrigir. Erro em algum desses campos implicará em ATRASO na entrega do seu passaporte.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 gap-4 text-xs">
                            {Object.entries(formValues).map(([key, value]) => (
                              <div key={key} className="flex flex-col border-b border-gray-100 pb-2">
                                <span className="font-bold text-blue-900 uppercase text-[9px] tracking-widest">{key}</span>
                                <span className="text-gray-700 font-black uppercase mt-0.5">{value || '---'}</span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-4 space-y-4">
                            <label className="flex cursor-pointer items-start gap-3">
                              <input
                                type="checkbox"
                                checked={acceptedTerms}
                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-[11px] font-bold leading-relaxed text-gray-500 uppercase tracking-tighter">
                                Declaro que as informações acima estão corretas e que estou ciente de que qualquer erro nos dados implicará em atraso na emissão do meu documento de viagem.
                              </span>
                            </label>

                            <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-4 text-blue-700 border border-blue-100">
                              <Lock className="h-5 w-5 flex-shrink-0" />
                              <p className="text-[10px] font-bold uppercase leading-tight">Seus dados estão protegidos por criptografia SSL de 256 bits conforme as normas da LGPD.</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="mt-12 flex items-center justify-between gap-4">
                      {formStep > 1 ? (
                        <button
                          onClick={() => setFormStep(prev => prev - 1)}
                          className="flex-1 rounded-xl border-2 border-gray-200 py-4 text-xs font-black text-gray-500 hover:bg-gray-50 transition-all uppercase tracking-widest"
                        >
                          Anterior
                        </button>
                      ) : <div className="flex-1" />}

                      {formStep < 4 ? (
                        <button
                          onClick={() => {
                            const currentStepFields = [
                              ['Nome completo', 'Sexo', 'Data de nascimento', 'Filiação 1 (Nome)', 'Nacionalidade', 'Raça ou cor', 'Estado civil'],
                              ['CPF', 'Identidade (RG)', 'Órgão Emissor', 'Data de Emissão (RG)'],
                              ['Profissão', 'EMAIL', 'Telefone / WhatsApp', 'CEP', 'Endereço', 'Número', 'Cidade', 'UF']
                            ][formStep - 1];

                            const isStepValid = currentStepFields.every(label => {
                              const field = selectedService?.fields.find(f => f.label === label);
                              return field?.optional || (formValues[label] && formValues[label].length > 0);
                            });

                            if (isStepValid) {
                              setFormStep(prev => prev + 1);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            } else {
                              alert('Por favor, preencha todos os campos obrigatórios.');
                            }
                          }}
                          className="flex-2 rounded-xl bg-blue-600 py-4 px-8 text-xs font-black text-white shadow-lg hover:bg-blue-700 transition-all uppercase tracking-widest active:scale-95"
                        >
                          Próximo
                        </button>
                      ) : (
                        <button
                          onClick={async () => {
                            if (acceptedTerms) {
                              await handleConfirmData();
                              handleFinalize();
                            } else {
                              alert('Você precisa aceitar a declaração de veracidade dos dados.');
                            }
                          }}
                          className={`flex-2 rounded-xl py-4 px-10 text-xs font-black text-white shadow-lg transition-all uppercase tracking-widest active:scale-95 ${acceptedTerms ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'}`}
                        >
                          Enviar Solicitação
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="p-6 text-center text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 border-t border-gray-100">
                    A REGULARIZA DIGITAL é uma assessoria privada independente de órgãos governamentais.
                  </p>
                </motion.div>
              ) : (
                <Checkout
                  service={selectedService!}
                  formValues={formValues}
                  fetchedData={fetchedData}
                  onBack={handleBackToForm}
                  totalPrice={totalPrice}
                  quantity={quantity}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Right Column (33%) - Sidebar */}
          {stage !== 'checkout' && (
            <div className="lg:col-span-1">
              <div className="sticky top-28 rounded-2xl bg-white p-6 shadow-xl shadow-gray-200/50">
                <h3 className="mb-6 text-xl font-bold text-gray-950 uppercase tracking-tighter">Resumo do Pedido</h3>

                {!selectedService ? (
                  <div className="mb-8 flex flex-col items-center justify-center py-8 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                      <AlertCircle className="h-8 w-8 text-gray-950" />
                    </div>
                    <p className="text-sm font-medium text-gray-500">Selecione um serviço</p>
                  </div>
                ) : (
                  <div className="mb-6">
                    <p className="mb-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Serviço Selecionado</p>

                    {/* Order Items List */}
                    <div className="mb-4 flex flex-col gap-2">
                      {Array.from({ length: quantity }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-black text-white">
                              {i + 1}
                            </div>
                            <span className="text-[11px] font-black text-blue-900 uppercase leading-tight">{selectedService.name}</span>
                          </div>
                          {i > 0 && (
                            <button
                              onClick={() => setQuantity(q => q - 1)}
                              className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-colors text-xs font-black"
                              title="Remover"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Add Another Button */}
                    <button
                      onClick={() => setQuantity(q => Math.min(q + 1, 10))}
                      className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-200 py-3 text-[11px] font-black text-blue-500 hover:border-blue-400 hover:bg-blue-50 transition-all uppercase tracking-widest mb-6"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Adicionar outra emissão
                    </button>

                    <div className="mb-6 flex items-center justify-between border-t border-gray-100 pt-5">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">TOTAL A PAGAR</span>
                      <span className="text-2xl font-black text-blue-600">
                        { (formStep === 4 || stage === 'checkout' || priceUnlocked) ? (
                          `R$ ${totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                        ) : (
                          '---'
                        )}
                      </span>
                    </div>
                  </div>
                )}

                {/* Attention Box - Styled like the reference */}
                <div className="mb-8 flex flex-col border-l-4 border-blue-500 bg-blue-50/30 p-4 rounded-r-lg">
                  <p className="mb-1 text-sm font-black text-gray-900 uppercase tracking-wider">ATENÇÃO:</p>
                  <p className="text-sm leading-relaxed text-gray-700">
                    Devido à alta demanda, hoje a Emissão de Passaportes está limitada.
                  </p>
                  <p className="mt-2 text-sm font-medium text-gray-900 flex items-center gap-1">
                    Restam apenas:
                    <AnimatePresence mode="wait">
                      <motion.b
                        key={remainingServices}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.3 }}
                        className="font-black text-red-600 text-lg"
                      >
                        {remainingServices}
                      </motion.b>
                    </AnimatePresence>
                  </p>
                </div>

                {/* Card Footer Info */}
                <div className="space-y-4 border-t border-gray-100 pt-6">
                  <div className="flex items-center gap-3 text-gray-950">
                    <CreditCard className="h-4 w-4" />
                    <span className="text-xs font-medium">Pague no cartão de crédito em 12 vezes</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-950">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-xs font-medium">Garantia de serviço</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* --- Footer --- */}
      <footer className="mt-20">
        {/* Upper Footer */}
        <div className="bg-[#0a192f] py-16 text-white">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            {/* All Services Grid */}
            <div className="mb-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5 border-b border-white/5 pb-16">
              {categories.map((cat) => (
                <div key={cat.id}>
                  <h4 className="mb-6 text-xs font-black uppercase tracking-widest text-blue-400">
                    {cat.title}
                  </h4>
                  <ul className="space-y-3 text-[10px] font-medium text-gray-400">
                    {cat.items.map((item, i) => (
                      <li key={i}>
                        <button
                          onClick={() => {
                            setSelectedService(item);
                            setStage('form');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="hover:text-white transition-colors text-left"
                        >
                          {item.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
              {/* Col 1 */}
              <div>
                <div className="mb-6 flex items-center gap-2">
                  <img
                    src="/img/Regularize Digital -Branca.png"
                    alt="Regulariza Digital"
                    className="h-28 w-auto object-contain"
                  />
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Assessoria especializada para MEI e empresas em todo o Brasil.
                  Simplificamos a burocracia para você focar no que importa: seu negócio.
                </p>
              </div>

              {/* Col 2 */}
              <div>
                <h4 className="mb-6 text-sm font-bold uppercase tracking-wider">Institucional</h4>
                <ul className="space-y-3 text-xs text-gray-400">
                  <li><a href="#" className="hover:text-white">Quem Somos</a></li>
                  <li><a href="#" className="hover:text-white">Política de Privacidade</a></li>
                  <li><a href="#" className="hover:text-white">Termos de Uso</a></li>
                  <li><a href="#" className="hover:text-white">Trabalhe Conosco</a></li>
                </ul>
              </div>

              {/* Col 3 */}
              <div>
                <h4 className="mb-6 text-sm font-bold uppercase tracking-wider">Links Úteis</h4>
                <ul className="space-y-3 text-xs text-gray-400">
                  <li><a href="#" className="hover:text-white">Home</a></li>
                  <li><a href="#" className="hover:text-white">Blog</a></li>
                  <li><a href="#" className="hover:text-white">FAQ</a></li>
                  <li><a href="#" className="hover:text-white">Central de Ajuda</a></li>
                </ul>
              </div>

              {/* Col 4 */}
              <div>
                <h4 className="mb-6 text-sm font-bold uppercase tracking-wider">Atendimento</h4>
                <div className="mb-6 space-y-2 text-xs text-gray-400">
                  <p>contato@regularizadigital.com.br</p>
                  <p>0800 123 4567</p>
                  <p>Seg - Sex: 08h às 18h</p>
                </div>
                <h4 className="mb-4 text-sm font-bold uppercase tracking-wider">Redes Sociais</h4>
                <div className="flex gap-4">
                  <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-blue-600">
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-blue-600">
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-blue-600">
                    <Facebook className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Footer */}
        <div className="bg-white py-8">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
              {/* Left: Payments */}
              <div className="flex flex-col items-center md:items-start">
                <span className="mb-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Formas de Pagamento</span>
                <div className="flex flex-wrap gap-2">
                  {/* Mock Payment Icons */}
                  <div className="flex h-6 w-10 items-center justify-center rounded border border-gray-100 bg-gray-50 text-[8px] font-bold text-orange-500">VISA</div>
                  <div className="flex h-6 w-10 items-center justify-center rounded border border-gray-100 bg-gray-50 text-[8px] font-bold text-red-500">MASTER</div>
                  <div className="flex h-6 w-10 items-center justify-center rounded border border-gray-100 bg-gray-50 text-[8px] font-bold text-blue-500">ELO</div>
                  <div className="flex h-6 w-10 items-center justify-center rounded border border-gray-100 bg-gray-50 text-[8px] font-bold text-teal-500">PIX</div>
                  <div className="flex h-6 w-10 items-center justify-center rounded border border-gray-100 bg-gray-50 text-[8px] font-bold text-gray-500">BOLETO</div>
                </div>
              </div>

              {/* Center/Right: Seals */}
              <div className="flex flex-wrap items-center justify-center gap-6">
                <div className="flex items-center gap-2 rounded-full border border-gray-100 bg-gray-50 px-4 py-2">
                  <Lock className="h-4 w-4 text-green-500" />
                  <span className="text-[10px] font-bold text-gray-500">SSL BLINDADO</span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-gray-100 bg-gray-50 px-4 py-2">
                  <ShieldCheck className="h-4 w-4 text-blue-500" />
                  <span className="text-[10px] font-bold text-gray-500">SITE SEGURO</span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-4 py-2">
                  <MessageCircle className="h-4 w-4 text-green-600" />
                  <span className="text-[10px] font-bold text-green-600">WHATSAPP</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-lg font-black text-blue-600">9.3</span>
                  <span className="text-[8px] font-bold text-gray-400 uppercase">Nota de Avaliação</span>
                </div>
              </div>
            </div>

            {/* Signature */}
            <div className="mt-12 flex flex-col items-center justify-between border-t border-gray-100 pt-8 text-center md:flex-row md:text-left">
              <div className="flex items-center gap-2 opacity-30">
                <img
                  src="/img/Regularize Digital.png"
                  alt="Regulariza Digital"
                  className="h-6 w-auto object-contain grayscale"
                />
              </div>
              <p className="mt-4 text-[10px] font-medium text-gray-400 md:mt-0">
                © {new Date().getFullYear()} REGULARIZA DIGITAL LTDA. Todos os direitos reservados. CNPJ: 00.000.000/0001-00
              </p>
            </div>
          </div>
        </div>
      </footer>
      {/* Mobile Fixed Summary Bar */}
      {selectedService && stage !== 'checkout' && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] lg:hidden">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="max-w-[120px] truncate text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {selectedService.name}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Total:</span>
                <span className="text-lg font-black text-blue-600">
                  { (formStep === 4 || stage === 'checkout' || priceUnlocked) ? (
                    `R$ ${totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                  ) : (
                    '---'
                  )}
                </span>
              </div>
            </div>

            <div className="flex-1">
              <button
                disabled={!acceptedTerms || !fetchedData}
                onClick={handleFinalize}
                className={`w-full rounded-xl py-3 text-xs font-black text-white shadow-lg transition-transform active:scale-[0.98] ${acceptedTerms && fetchedData ? 'bg-[#4CAF50] shadow-green-200' : 'cursor-not-allowed bg-gray-300 shadow-none'
                  }`}
              >
                FINALIZAR E PAGAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />
      <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
      <Route path="/dashboard/pedidos" element={<MeusPedidosPage />} />
      <Route path="/dashboard/dados" element={<DadosUsuarioPage />} />
      <Route path="/dashboard/indicacao" element={<IndicacaoPage />} />
      <Route path="/dashboard/comissoes" element={<ComissoesPage />} />
      <Route path="/dashboard/conta" element={<ContaCorrentePage />} />
      <Route path="/dashboard/saque" element={<SaquePage />} />
      <Route path="/dashboard/faq" element={<FAQPage />} />
    </Routes>
  );
}
