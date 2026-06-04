import React from 'react'
import type { ShippingOption } from '../typings/shipping'
import styles from '../style/ShippingSimulator.css'

interface Props {
  options: ShippingOption[]
}

const formatPrice = (cents: number) =>
  cents === 0
    ? 'Grátis'
    : new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(cents / 100)

const formatDeadline = (estimate: string) => {
  if (!estimate) return 'Consulte o prazo'
  const days = parseInt(estimate.replace(/\D/g, ''))
  if (isNaN(days)) return estimate
  if (days === 0) return 'Hoje'
  if (days === 1) return '1 dia útil'
  return `${days} dias úteis`
}

export const ShippingResults: React.FC<Props> = ({ options }) => {
  if (options.length === 0) return null

  return (
    <div className={styles.results} aria-live="polite">
      <h4 className={styles.resultsTitle}>Opções de entrega</h4>
      <ul className={styles.list} role="list">
        {options.map((option) => (
          <li key={option.id} className={styles.item}>
            <span className={styles.optionName}>{option.name}</span>
            <span className={styles.optionDeadline}>
              {formatDeadline(option.shippingEstimate)}
            </span>
            <span className={styles.optionPrice}>
              {formatPrice(option.price)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}