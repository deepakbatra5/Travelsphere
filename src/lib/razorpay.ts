import Razorpay from 'razorpay'

let razorpayClient: Razorpay | undefined

function getRazorpayClient() {
  if (!razorpayClient) {
    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keyId || !keySecret) {
      throw new Error('Razorpay credentials are not set')
    }

    razorpayClient = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })
  }

  return razorpayClient
}

export const razorpay = new Proxy({} as Razorpay, {
  get(_target, property, receiver) {
    return Reflect.get(getRazorpayClient(), property, receiver)
  },
})
