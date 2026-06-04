import React from 'react'
import styles from '../style/ShippingSimulator.css'

interface Props {
  postalCode: string
  onChange: (value: string) => void
  onSubmit: () => void
  loading: boolean
}

const formatCEP = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`
  return digits
}

export const ShippingForm: React.FC<Props> = ({ postalCode, onChange, onSubmit, loading }) => {
  return (
    <div className={styles.form}>
      <label htmlFor="postal-code-input" className={styles.label}>
        Calcular frete
      </label>
      <div className={styles.inputRow}>
        <input
          id="postal-code-input"
          type="text"
          inputMode="numeric"
          placeholder="00000-000"
          value={postalCode}
          onChange={(e) => onChange(formatCEP(e.target.value))}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
          maxLength={9}
          aria-label="Digite seu CEP"
          className={styles.input}
          disabled={loading}
        />
        <button
          onClick={onSubmit}
          disabled={loading}
          aria-busy={loading}
          className={styles.button}
        >
          {loading ? 'Calculando...' : 'Calcular'}
        </button>
      </div>
      <a
        href="https://buscacepinter.correios.com.br/app/endereco/index.php"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.cepLink}
        aria-label="Não sei meu CEP, abre site dos Correios"
      >
        Não sei meu CEP
      </a>
    </div>
  )
}