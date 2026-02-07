# Valentine Proposal (Private)

Passcode-protected Valentine proposal site.

- Passcode: **Iloveyouyash** (client-side hash in `js/auth.js`)
- Login: open `login.html`
- Protected page: `index.html` (redirects to login if not authenticated)

Run locally:
```
python -m http.server 5500
# open http://localhost:5500/login.html
```

Deploy to GitHub Pages / Netlify / Vercel as a static site.
