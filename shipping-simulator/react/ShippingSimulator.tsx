import React, { useState } from 'react'
import { useProduct } from 'vtex.product-context'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { ShippingForm } from './components/ShippingForm'
import { ShippingResults } from './components/ShippingResults'
import type { ShippingOption } from './typings/shipping'
import styles from './style/ShippingSimulator.css'

const ShippingSimulator: React.FC = () => {
  const [postalCode, setPostalCode] = useState('')
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const productContext = useProduct()
  const { orderForm } = useOrderForm()

  const selectedItem = productContext?.selectedItem
  const seller = selectedItem?.sellers?.[0]

  const handleSimulate = async () => {
    const cleanCEP = postalCode.replace(/\D/g, '')

    if (cleanCEP.length !== 8) {
      setError('Digite um CEP válido com 8 dígitos.')
      return
    }

    if (!selectedItem || !seller) {
      setError('Nenhum SKU selecionado. Selecione uma variação do produto.')
      return
    }

    setLoading(true)
    setError(null)
    setHasSearched(true)
    setShippingOptions([])

    try {
      const currentItems =
        orderForm?.items?.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          seller: item.seller,
        })) ?? []

      const newItem = {
        id: selectedItem.itemId,
        quantity: 1,
        seller: seller.sellerId,
      }

      const alreadyInCart = currentItems.some((i) => i.id === newItem.id)
      const items = alreadyInCart ? currentItems : [...currentItems, newItem]

      const response = await fetch('/api/checkout/pub/orderForms/simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          postalCode: cleanCEP,
          country: 'BRA',
        }),
      })

      if (!response.ok) throw new Error('Erro na API')

      const data = await response.json()
      const slas: ShippingOption[] = data?.logisticsInfo?.[0]?.slas ?? []

      if (slas.length === 0) {
        setError('Nenhuma opção de frete encontrada para este CEP.')
      } else {
        setShippingOptions(slas)
      }
    } catch {
      setError('Não foi possível calcular o frete. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section aria-label="Simulação de frete" className={styles.container}>
      <ShippingForm
        postalCode={postalCode}
        onChange={setPostalCode}
        onSubmit={handleSimulate}
        loading={loading}
      />
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
      {hasSearched && !loading && !error && (
        <ShippingResults options={shippingOptions} />
      )}
    </section>
  )
}

export default ShippingSimulator