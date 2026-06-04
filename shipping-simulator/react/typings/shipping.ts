export interface ShippingOption {
  id: string
  name: string
  price: number
  shippingEstimate: string
  deliveryWindow?: {
    startDateUtc: string
    endDateUtc: string
  }
}