// Vercel Auto-Deploy Webhook Trigger Service

export const DEFAULT_DEPLOY_HOOK_URL = 'https://api.vercel.com/v1/integrations/deploy/prj_yTcHA8BktV0bgT7pkqpht5eakbjI/2zU3zsDyEW'

export const VERCEL_PROJECT_INFO = {
  projectId: 'prj_yTcHA8BktV0bgT7pkqpht5eakbjI',
  orgId: 'team_yYLm6aMJhylp8fII3mCirIKD',
  projectName: 'cat2026-app',
  productionUrl: 'https://cat2026-app.vercel.app',
  deployHookUrl: DEFAULT_DEPLOY_HOOK_URL,
}

export async function triggerVercelDeployHook(webhookUrl?: string): Promise<boolean> {
  const url = webhookUrl || localStorage.getItem('cat2026_vercel_deploy_hook') || DEFAULT_DEPLOY_HOOK_URL

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    return res.ok
  } catch (err) {
    console.error('[Vercel Deploy Hook] Trigger error:', err)
    return false
  }
}
