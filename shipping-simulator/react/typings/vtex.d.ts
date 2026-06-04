declare module 'vtex.product-context' {
  export const useProduct: () => {
    selectedItem?: {
      itemId: string
      sellers: Array<{sellerId: string}>
    }
  } | null
}

declare module 'vtex.order-manager/OrderForm' {
  export const useOrderForm: () => {
    orderForm: {
      items: Array<{
        id: string
        quantity: number
        seller: string
      }>
    }
  }
}