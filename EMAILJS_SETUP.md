# EmailJS Configuration for GitHub Pages Deployment

## Problem
EmailJS works locally but fails after deployment because environment variables from `.env` are not automatically available in GitHub Actions.

## Solution: Add GitHub Secrets

Follow these steps to fix the EmailJS configuration:

### Step 1: Get Your EmailJS Credentials
From your `.env` file, you have:
- Service ID: `service_qf24lcn`
- Template ID: `template_lv0irjo`
- Public Key: `MFIFO1NIYR0js7aIz`

### Step 2: Add Secrets to GitHub Repository

1. **Go to your GitHub repository**: `https://github.com/Ilias-Ahmed/Ilias-Ahmed.github.io`

2. **Navigate to Settings**:
   - Click on the "Settings" tab in your repository
   
3. **Go to Secrets and Variables**:
   - In the left sidebar, click "Secrets and variables"
   - Click "Actions"

4. **Add New Repository Secrets**:
   Click "New repository secret" button and add these three secrets:

   **Secret 1:**
   - Name: `VITE_EMAILJS_SERVICE_ID`
   - Value: `service_qf24lcn`
   
   **Secret 2:**
   - Name: `VITE_EMAILJS_TEMPLATE_ID`
   - Value: `template_lv0irjo`
   
   **Secret 3:**
   - Name: `VITE_EMAILJS_PUBLIC_KEY`
   - Value: `MFIFO1NIYR0js7aIz`

### Step 3: Verify the Configuration

After adding the secrets:

1. Make a small change to your code (or just push this file)
2. Commit and push to trigger the GitHub Actions workflow
3. The build will now include your EmailJS credentials
4. Test the contact form on your live site

### Step 4: Check EmailJS Dashboard Settings

Make sure in your EmailJS dashboard:

1. **Allowed Domains**: Add your custom domain
   - Go to https://dashboard.emailjs.com/admin
   - Click on your service
   - Under "Settings" → "Allowed Origins"
   - Add your custom domain (e.g., `yourdomain.com`)
   - Also add `*.github.io` for GitHub Pages

2. **Template Settings**: Verify your email template is active

3. **Service Status**: Ensure your service is active and not suspended

## Testing Locally vs Production

### Local Development (with .env)
```bash
npm run dev
```
Environment variables are loaded from `.env` file automatically.

### Production Build (GitHub Actions)
Environment variables come from GitHub Secrets and are injected during build time.

## Troubleshooting

### If you still see "Email service is not configured" error:

1. **Check GitHub Actions logs**:
   - Go to "Actions" tab in your repository
   - Check the latest deployment log
   - Look for environment variable errors

2. **Verify secrets are set correctly**:
   - Go to Settings → Secrets and variables → Actions
   - Make sure all three secrets exist with correct names (case-sensitive)

3. **Clear cache and redeploy**:
   - Make a dummy commit to force a fresh build
   
4. **Check browser console**:
   - Open DevTools (F12) on your live site
   - Check for EmailJS initialization logs
   - Look for configuration error messages

### Common Issues:

- **Secret names must match exactly** - They are case-sensitive
- **No quotes needed** - Just paste the raw values
- **Redeploy required** - Changes to secrets require a new deployment
- **Domain restrictions** - Make sure your domain is allowed in EmailJS dashboard

## Security Note

Never commit your `.env` file to GitHub. The `.gitignore` should already exclude it, but double-check to keep your credentials safe.

## Contact Form Features

The updated code now includes:
- Better error messages
- Debug logging (visible in browser console)
- Graceful fallback if EmailJS is not configured
- Additional email parameters for better formatting
