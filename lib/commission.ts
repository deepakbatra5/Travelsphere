export const COMPANY_COMMISSION_RATE = 0.2
export const AGENT_PAYOUT_RATE = 1 - COMPANY_COMMISSION_RATE

export function getCompanyCommission(totalAmount: number) {
  return totalAmount * COMPANY_COMMISSION_RATE
}

export function getAgentPayout(totalAmount: number) {
  return totalAmount * AGENT_PAYOUT_RATE
}
