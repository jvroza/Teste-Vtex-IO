import React from 'react'
import type { ShippingOption } from '../typings/shipping'

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
    <div className="shipping-simulator__results" aria-live="polite">
      <h4 className="shipping-simulator__results-title">Opções de entrega</h4>
      <ul className="shipping-simulator__list" role="list">
        {options.map((option) => (
          <li key={option.id} className="shipping-simulator__item">
            <span className="shipping-simulator__option-name">{option.name}</span>
            <span className="shipping-simulator__option-deadline">
              {formatDeadline(option.shippingEstimate)}
            </span>
            <span className="shipping-simulator__option-price">
              {formatPrice(option.price)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
};