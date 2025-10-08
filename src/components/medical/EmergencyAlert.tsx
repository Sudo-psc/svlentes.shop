/**
 * Componente de Alertas Médicos de Emergência
 *
 * Exibe sinais de alerta que requerem atenção médica imediata,
 * conforme requisitos de conformidade healthcare.
 *
 * @see CLAUDE.md - Clinical Safety Requirements
 */

'use client'

import { useState } from 'react'
import { AlertTriangle, Phone, X } from 'lucide-react'

interface EmergencySign {
  id: string
  text: string
  severity: 'critical' | 'urgent'
}

const EMERGENCY_SIGNS: EmergencySign[] = [
  {
    id: 'pain',
    text: 'Dor ocular intensa ou persistente',
    severity: 'critical'
  },
  {
    id: 'redness',
    text: 'Vermelhidão severa (hiperemia)',
    severity: 'critical'
  },
  {
    id: 'vision',
    text: 'Visão turva súbita ou perda de visão',
    severity: 'critical'
  },
  {
    id: 'discharge',
    text: 'Secreção purulenta',
    severity: 'urgent'
  },
  {
    id: 'photophobia',
    text: 'Fotofobia intensa (sensibilidade à luz)',
    severity: 'urgent'
  },
  {
    id: 'foreign-body',
    text: 'Sensação de corpo estranho persistente',
    severity: 'urgent'
  }
]

const EMERGENCY_CONTACTS = {
  whatsapp: '+55 33 99860-1427',
  phone: '(33) 99860-1427',
  doctor: 'Dr. Philipe Saraiva Cruz',
  crm: 'CRM-MG 69.870',
  clinic: 'Saraiva Vision - Caratinga/MG'
}

export function EmergencyAlert() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6 relative" role="alert" aria-live="polite">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-red-600 hover:text-red-800"
        aria-label="Fechar alerta"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="flex gap-3">
        <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div className="flex-1">
          <h3 className="text-red-800 font-bold text-lg mb-2">
            ⚠️ Sinais de Alerta - Procure Atendimento Imediato
          </h3>

          <p className="text-red-700 text-sm mb-3">
            Se você apresentar qualquer um dos sintomas abaixo, <strong>remova suas lentes imediatamente</strong> e procure atendimento oftalmológico de emergência:
          </p>

          <ul className="space-y-2 mb-4">
            {EMERGENCY_SIGNS.map((sign) => (
              <li key={sign.id} className="flex items-start gap-2 text-red-700 text-sm">
                <span className={`
                  inline-block w-2 h-2 rounded-full mt-1.5 flex-shrink-0
                  ${sign.severity === 'critical' ? 'bg-red-600 animate-pulse' : 'bg-red-500'}
                `} aria-label={sign.severity === 'critical' ? 'Crítico' : 'Urgente'} />
                <span>{sign.text}</span>
              </li>
            ))}
          </ul>

          <div className="bg-white border border-red-200 rounded-lg p-3 mt-3">
            <p className="text-red-800 font-semibold text-sm mb-2">
              📞 Contato de Emergência:
            </p>
            <div className="space-y-1 text-sm text-red-700">
              <p>
                <strong>{EMERGENCY_CONTACTS.doctor}</strong> ({EMERGENCY_CONTACTS.crm})
              </p>
              <p>{EMERGENCY_CONTACTS.clinic}</p>
              <div className="flex items-center gap-2 mt-2">
                <a
                  href={`tel:${EMERGENCY_CONTACTS.whatsapp}`}
                  className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  <Phone className="h-4 w-4" />
                  {EMERGENCY_CONTACTS.phone}
                </a>
                <a
                  href={`https://wa.me/${EMERGENCY_CONTACTS.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          <p className="text-red-600 text-xs mt-3 italic">
            ⚕️ Não ignore sintomas oculares graves. O tratamento precoce é fundamental para prevenir complicações sérias.
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Versão compacta do alerta para Header/Footer
 */
export function EmergencyAlertCompact() {
  return (
    <div className="bg-red-600 text-white text-center py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-sm">
        <AlertTriangle className="h-4 w-4 flex-shrink-0 animate-pulse" aria-hidden="true" />
        <span className="font-medium">
          Emergência Oftalmológica?
        </span>
        <a
          href={`tel:${EMERGENCY_CONTACTS.whatsapp}`}
          className="underline hover:no-underline font-bold"
        >
          Ligue: {EMERGENCY_CONTACTS.phone}
        </a>
      </div>
    </div>
  )
}
