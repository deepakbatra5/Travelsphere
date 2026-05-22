#!/usr/bin/env node
/**
 * TravelSphere — Local Portal Testing Setup
 * 
 * Run this script ONCE as Administrator to add subdomain entries
 * to your Windows hosts file so you can test all 3 portals locally.
 * 
 * Usage (PowerShell as Admin):
 *   node scripts/setup-local-hosts.js
 * 
 * After running:
 *   Customer → http://localhost:3000
 *   Agent    → http://agent.localhost:3000
 *   Admin    → http://admin.localhost:3000
 */

const fs = require('fs')
const path = require('path')
const os = require('os')

const HOSTS_FILE = os.platform() === 'win32'
  ? 'C:\\Windows\\System32\\drivers\\etc\\hosts'
  : '/etc/hosts'

const ENTRIES = [
  '127.0.0.1  agent.localhost',
  '127.0.0.1  admin.localhost',
]

const MARKER_START = '# TravelSphere local portals — START'
const MARKER_END   = '# TravelSphere local portals — END'

try {
  let content = fs.readFileSync(HOSTS_FILE, 'utf8')

  // Remove existing TravelSphere block if present
  const blockRegex = new RegExp(`${MARKER_START}[\\s\\S]*?${MARKER_END}\\n?`, 'g')
  content = content.replace(blockRegex, '')

  // Append new block
  const block = `\n${MARKER_START}\n${ENTRIES.join('\n')}\n${MARKER_END}\n`
  content = content.trimEnd() + block

  fs.writeFileSync(HOSTS_FILE, content, 'utf8')
  console.log('✅ Hosts file updated!\n')
  console.log('  Customer → http://localhost:3000')
  console.log('  Agent    → http://agent.localhost:3000')
  console.log('  Admin    → http://admin.localhost:3000')
  console.log('\nRun: npm run dev')
} catch (err) {
  if (err.code === 'EACCES' || err.code === 'EPERM') {
    console.error('❌ Permission denied. Run this script as Administrator:')
    console.error('   Right-click PowerShell → "Run as administrator"')
    console.error('   Then: node scripts/setup-local-hosts.js')
  } else {
    console.error('❌ Error:', err.message)
  }
  process.exit(1)
}
