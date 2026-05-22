export type Portal = 'customer' | 'agent' | 'admin'

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1'])

export function normalizeHost(host: string | null) {
  return (host || '').split(':')[0].toLowerCase()
}

export function getRootDomain() {
  return (process.env.NEXT_PUBLIC_ROOT_DOMAIN || process.env.ROOT_DOMAIN || 'travelsphere.sbs').toLowerCase()
}

export function getPortalFromHost(hostHeader: string | null): Portal {
  const host = normalizeHost(hostHeader)
  const rootDomain = getRootDomain()

  if (host === `admin.${rootDomain}` || host.startsWith('admin.')) return 'admin'
  if (host === `agent.${rootDomain}` || host.startsWith('agent.')) return 'agent'

  return 'customer'
}

export function isLocalHost(hostHeader: string | null) {
  return LOCAL_HOSTS.has(normalizeHost(hostHeader))
}
