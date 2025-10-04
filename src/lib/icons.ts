/**
 * Sistema de Gerenciamento de Ícones - SV Lentes
 *
 * Este módulo centraliza todos os ícones do projeto, fornecendo:
 * - Tipagem TypeScript forte
 * - Categorização lógica
 * - Metadados para otimização
 * - Sugestões de uso contextual
 */

export type IconCategory =
  | 'atendimento'
  | 'beneficios'
  | 'processos'
  | 'medico'
  | 'badges'
  | 'perfil';

export interface IconMetadata {
  /** Nome do arquivo do ícone */
  filename: string;
  /** Caminho relativo a partir de /public */
  path: string;
  /** Categoria funcional */
  category: IconCategory;
  /** Descrição do uso recomendado */
  description: string;
  /** Tamanho recomendado em pixels */
  recommendedSize: {
    width: number;
    height: number;
  };
  /** Contextos sugeridos de uso */
  suggestedUse: string[];
  /** Alt text padrão para acessibilidade */
  defaultAlt: string;
}

/**
 * Catálogo completo de ícones disponíveis
 */
export const ICONS: Record<string, IconMetadata> = {
  // ===== ATENDIMENTO E SUPORTE =====
  customerService: {
    filename: 'customer_service_icon.png',
    path: '/icones/customer_service_icon.png',
    category: 'atendimento',
    description: 'Ícone de atendimento ao cliente via WhatsApp/Chat',
    recommendedSize: { width: 64, height: 64 },
    suggestedUse: ['seção de contato', 'botão de suporte', 'FAQ', 'header'],
    defaultAlt: 'Atendimento ao cliente SV Lentes'
  },

  atendimento24x7: {
    filename: 'icon_atend24:7.png',
    path: '/icones/icon_atend24:7.png',
    category: 'atendimento',
    description: 'Ícone destacando disponibilidade 24/7',
    recommendedSize: { width: 80, height: 80 },
    suggestedUse: ['seção de benefícios', 'cards de vantagens', 'hero section'],
    defaultAlt: 'Atendimento 24 horas por dia, 7 dias por semana'
  },

  amorSaude: {
    filename: 'icon_amoresaude.png',
    path: '/icones/icon_amoresaude.png',
    category: 'atendimento',
    description: 'Ícone representando cuidado e amor à saúde',
    recommendedSize: { width: 48, height: 48 },
    suggestedUse: ['seção sobre nós', 'valores da empresa', 'footer'],
    defaultAlt: 'Cuidado e amor com sua saúde ocular'
  },

  // ===== BENEFÍCIOS E VANTAGENS =====
  shieldSecurity: {
    filename: 'blue_shield_checkmark_icon.png',
    path: '/icones/blue_shield_checkmark_icon.png',
    category: 'beneficios',
    description: 'Escudo de segurança com checkmark - garantia e confiança',
    recommendedSize: { width: 72, height: 72 },
    suggestedUse: ['seção de garantias', 'benefícios', 'compliance LGPD'],
    defaultAlt: 'Segurança e garantia nos serviços'
  },

  premiumQuality: {
    filename: 'diamond_and_star_icon.png',
    path: '/icones/diamond_and_star_icon.png',
    category: 'beneficios',
    description: 'Diamante com estrela - qualidade premium',
    recommendedSize: { width: 64, height: 64 },
    suggestedUse: ['planos premium', 'diferenciais', 'qualidade do produto'],
    defaultAlt: 'Qualidade premium garantida'
  },

  piggyBank: {
    filename: 'piggy_bank_with_dollar_coin.png',
    path: '/icones/piggy_bank_with_dollar_coin.png',
    category: 'beneficios',
    description: 'Cofrinho com moeda - economia e valor',
    recommendedSize: { width: 80, height: 80 },
    suggestedUse: ['calculadora de economia', 'comparação de preços', 'benefícios financeiros'],
    defaultAlt: 'Economia com assinatura de lentes'
  },

  calculator: {
    filename: 'colorful_calculator_icon.png',
    path: '/icones/colorful_calculator_icon.png',
    category: 'beneficios',
    description: 'Calculadora colorida - cálculo de economia',
    recommendedSize: { width: 64, height: 64 },
    suggestedUse: ['seção calculadora', 'simulador de preços', 'CTA de economia'],
    defaultAlt: 'Calcule sua economia'
  },

  // ===== PROCESSOS E ENTREGA =====
  delivery: {
    filename: 'hand_holding_package_icon.png',
    path: '/icones/hand_holding_package_icon.png',
    category: 'processos',
    description: 'Mão segurando pacote - entrega de lentes',
    recommendedSize: { width: 72, height: 72 },
    suggestedUse: ['seção como funciona', 'processo de entrega', 'benefícios logísticos'],
    defaultAlt: 'Entrega de lentes em domicílio'
  },

  location: {
    filename: 'cartoon-character-location-icon.png',
    path: '/icones/cartoon-character-location-icon.png',
    category: 'processos',
    description: 'Personagem com pin de localização',
    recommendedSize: { width: 80, height: 80 },
    suggestedUse: ['área de cobertura', 'localização da clínica', 'mapa de atendimento'],
    defaultAlt: 'Localização e área de atendimento'
  },

  // ===== MÉDICO E CONSULTAS =====
  eyeCalendar: {
    filename: 'eye-calendar-icon.png',
    path: '/icones/eye-calendar-icon.png',
    category: 'medico',
    description: 'Olho com calendário - agendamento de consultas',
    recommendedSize: { width: 72, height: 72 },
    suggestedUse: ['agendamento', 'consultas', 'acompanhamento médico'],
    defaultAlt: 'Agende sua consulta oftalmológica'
  },

  eyeCheckAward: {
    filename: 'eye_check_award_icon.png',
    path: '/icones/eye_check_award_icon.png',
    category: 'medico',
    description: 'Exame oftalmológico com selo de qualidade',
    recommendedSize: { width: 80, height: 80 },
    suggestedUse: ['seção médica', 'exames', 'diferenciais clínicos'],
    defaultAlt: 'Exames oftalmológicos certificados'
  },

  // ===== BADGES E SELOS =====
  popularBadge: {
    filename: 'flaming_crown_popular_badge.png',
    path: '/icones/flaming_crown_popular_badge.png',
    category: 'badges',
    description: 'Coroa flamejante - plano mais popular',
    recommendedSize: { width: 56, height: 56 },
    suggestedUse: ['cards de planos', 'destaque de produtos', 'pricing'],
    defaultAlt: 'Plano mais popular'
  },

  anniversaryBadge: {
    filename: 'ten_year_anniversary_badge.png',
    path: '/icones/ten_year_anniversary_badge.png',
    category: 'badges',
    description: 'Selo de 10 anos - experiência e tradição',
    recommendedSize: { width: 64, height: 64 },
    suggestedUse: ['sobre nós', 'credibilidade', 'footer', 'testimonials'],
    defaultAlt: '10 anos de experiência'
  },

  // ===== PERFIL =====
  drPhilipe: {
    filename: 'drphilipe_perfil.jpeg',
    path: '/icones/drphilipe_perfil.jpeg',
    category: 'perfil',
    description: 'Foto de perfil do Dr. Philipe Saraiva Cruz',
    recommendedSize: { width: 120, height: 120 },
    suggestedUse: ['sobre nós', 'equipe médica', 'testimonials', 'footer'],
    defaultAlt: 'Dr. Philipe Saraiva Cruz - CRM-MG 69.870'
  },

  userPin: {
    filename: 'Pin_icon_menino.png',
    path: '/icones/Pin_icon_menino.png',
    category: 'perfil',
    description: 'Avatar de usuário - representação de cliente',
    recommendedSize: { width: 48, height: 48 },
    suggestedUse: ['área do usuário', 'perfil', 'testimonials'],
    defaultAlt: 'Usuário SV Lentes'
  }
} as const;

/**
 * Helper para obter ícones por categoria
 */
export function getIconsByCategory(category: IconCategory): IconMetadata[] {
  return Object.values(ICONS).filter(icon => icon.category === category);
}

/**
 * Helper para obter caminho completo do ícone
 */
export function getIconPath(iconKey: keyof typeof ICONS): string {
  return ICONS[iconKey].path;
}

/**
 * Helper para obter alt text padrão
 */
export function getIconAlt(iconKey: keyof typeof ICONS): string {
  return ICONS[iconKey].defaultAlt;
}

/**
 * Tipo auxiliar para garantir uso correto das chaves de ícones
 */
export type IconKey = keyof typeof ICONS;
