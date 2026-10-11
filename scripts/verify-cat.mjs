import { createServer } from 'vite'

const server = await createServer({
  configFile: './vite.config.ts',
  appType: 'custom',
  server: { middlewareMode: true },
})

try {
  const { runStage1VerificationTests } = await server.ssrLoadModule('/src/services/__tests__/stage1_verification.ts')
  const results = await runStage1VerificationTests()
  for (const result of results) {
    console.log(`[${result.status}] ${result.id}: ${result.test} — ${result.detail}`)
  }
  const failures = results.filter(result => result.status !== 'PASS')
  console.log(`CAT verification: ${results.length - failures.length}/${results.length} passed`)
  if (failures.length) {
    process.exitCode = 1
    console.error(`Failed checks: ${failures.map(failure => failure.id).join(', ')}`)
  }
} finally {
  await server.close()
}
