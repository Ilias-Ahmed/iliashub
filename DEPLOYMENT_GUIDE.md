# EmailJS Configuration - Step-by-Step Deployment Guide

## ✅ What You've Already Done

- Created `github-pages` environment in Settings → Environments
- Added the EmailJS secrets to that environment

## 🔧 What I Just Fixed

Updated `.github/workflows/deploy.yml` to use the `github-pages` environment in the build job, so it can access the secrets you added.

## 📋 Step-by-Step Verification Guide

### Step 1: Verify Your Environment Secrets

1. Go to: `https://github.com/Ilias-Ahmed/Ilias-Ahmed.github.io/settings/environments`
2. Click on `github-pages` environment
3. Scroll down to **Environment secrets**
4. Verify these 3 secrets exist:
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_TEMPLATE_ID`
   - `VITE_EMAILJS_PUBLIC_KEY`

**Important:** Secret names are CASE-SENSITIVE. They must match exactly as shown above with `VITE_` prefix.

### Step 2: Check Secret Values (Without Revealing Them)

Your secrets should have these values (from your .env):

- `VITE_EMAILJS_SERVICE_ID` = `service_qf24lcn`
- `VITE_EMAILJS_TEMPLATE_ID` = `template_lv0irjo`
- `VITE_EMAILJS_PUBLIC_KEY` = `MFIFO1NIYR0js7aIz`

**If you need to update them:**

1. Click the pencil icon next to each secret
2. Paste the correct value (no quotes, just the raw value)
3. Click "Update secret"

### Step 3: Deploy the Updated Workflow

Now that I've updated the workflow file, you need to deploy it:

```bash
# Stage the changes
git add .

# Commit
git commit -m "Fix EmailJS environment secrets configuration"

# Push to trigger deployment
git push origin development
```

Or push to `main` branch if that's your deployment branch:

```bash
git push origin main
```

### Step 4: Monitor the Deployment

1. Go to: `https://github.com/Ilias-Ahmed/Ilias-Ahmed.github.io/actions`
2. Click on the latest workflow run
3. Watch the **Build** job
4. Click on the "Build" step to see the logs
5. Look for any error messages

**What to look for:**

- Build should complete successfully without "undefined" errors
- No warnings about missing environment variables

### Step 5: Test the Deployed Site

1. Wait for deployment to complete (usually 2-3 minutes)
2. Open your live site in a browser
3. Open Developer Tools (Press F12)
4. Go to the **Console** tab
5. Navigate to the Contact section
6. Look for this message: `"EmailJS initialized successfully"`

**If you see this message:** ✅ Configuration is working!
**If you see "EmailJS Public Key is missing":** ❌ Secrets not loaded

### Step 6: Test Sending an Email

1. Fill out the contact form on your live site
2. Click "Send Message"
3. Check the Console tab for any error messages

**Expected behavior:**

- You should see: `"Email sent successfully"` with a response object
- You should receive an email notification

### Step 7: Verify EmailJS Dashboard Settings

Make sure your domain is allowed:

1. Go to: `https://dashboard.emailjs.com/admin`
2. Click on your email service (`service_qf24lcn`)
3. Go to **Settings** tab
4. Under **Allowed Origins**, add:
   - Your custom domain (e.g., `https://yourdomain.com`)
   - GitHub Pages domain: `https://*.github.io`
   - Also add: `https://ilias-ahmed.github.io`

**Format examples:**

```
https://yourdomain.com
https://*.github.io
https://ilias-ahmed.github.io
```

## 🔍 Troubleshooting

### Issue 1: "Email service is not configured" Error

**Cause:** Environment variables not loaded during build

**Check:**

1. Verify workflow file has `environment: github-pages` in the build job (I just added this)
2. Verify secrets are in the `github-pages` environment (not repository secrets)
3. Check secret names are EXACTLY: `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`

**Fix:**

- Push the updated workflow file (from Step 3 above)
- Rebuild the site

### Issue 2: Build Succeeds but Still Not Working

**Check browser console:**

```javascript
// Open DevTools (F12), paste this in Console:
console.log({
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
});
```

**If all show `undefined`:**

- The environment variables weren't baked into the build
- Redeploy after verifying secrets are correct

### Issue 3: "Failed to send email" Error

**Possible causes:**

1. **Domain not allowed in EmailJS:** Add your domain in EmailJS dashboard (Step 7)
2. **Service suspended:** Check EmailJS account status
3. **Template not active:** Verify template exists and is active
4. **API limit reached:** Check your EmailJS usage quota

### Issue 4: Secrets Not Showing in Environment

**Fix:**

1. Delete the `github-pages` environment
2. Recreate it:
   - Go to Settings → Environments
   - Click "New environment"
   - Name: `github-pages`
   - Click "Configure environment"
3. Add secrets again:
   - Click "Add secret"
   - Name: `VITE_EMAILJS_SERVICE_ID`
   - Value: `service_qf24lcn`
   - Click "Add secret"
   - Repeat for other two secrets

## 🎯 Quick Checklist

Before pushing:

- [ ] Secrets added to `github-pages` environment with correct names
- [ ] Secret values are correct (no quotes, no extra spaces)
- [ ] Workflow file updated (I did this for you)

After pushing:

- [ ] GitHub Actions workflow runs successfully
- [ ] Build step completes without errors
- [ ] Site deploys successfully
- [ ] Browser console shows "EmailJS initialized successfully"
- [ ] Contact form works without errors

## 📞 Still Having Issues?

If it still doesn't work after following all steps:

1. **Check the GitHub Actions logs** for the exact error
2. **Take a screenshot** of the browser console error
3. **Verify** EmailJS dashboard settings
4. **Test locally** first: `npm run dev` should work with your .env file

## 🔐 Alternative: Use Repository Secrets (Simpler Option)

If environment secrets are causing issues, you can use repository secrets instead:

1. **Add secrets to Repository Secrets:**

   - Go to: Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Add the same 3 secrets there

2. **Remove environment reference from build job:**
   - Remove the `environment:` lines from the build job in deploy.yml
   - The workflow will automatically use repository secrets

Repository secrets are simpler because they're available to all jobs automatically.

---

**Note:** After any changes, you must commit and push to trigger a new deployment. The secrets are baked into the build at build-time, not runtime.
