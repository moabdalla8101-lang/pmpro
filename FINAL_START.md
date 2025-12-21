# 🚀 Final Start Instructions

## All Services Ready!

### Terminal 1 - User Service:
```bash
source ~/.nvm/nvm.sh
nvm use 20
cd /Users/mohamed/Documents/pmpro/backend/user-service
npm run dev
```

### Terminal 2 - Content Service:
```bash
source ~/.nvm/nvm.sh
nvm use 20
cd /Users/mohamed/Documents/pmpro/backend/content-service
npm run dev
```

### Terminal 3 - Analytics Service:
```bash
source ~/.nvm/nvm.sh
nvm use 20
cd /Users/mohamed/Documents/pmpro/backend/analytics-service
npm run dev
```

### Terminal 4 - Mobile App (EASIEST):
```bash
cd /Users/mohamed/Documents/pmpro
./scripts/start-mobile.sh
```

Or manually:
```bash
source ~/.nvm/nvm.sh
nvm use 20
ulimit -n 4096
cd /Users/mohamed/Documents/pmpro/mobile
npm start
```

## Then in Expo DevTools:
- Press **`i`** for iOS Simulator
- Press **`a`** for Android Emulator

## Make Node 20 Default (One Time Setup)

Add to `~/.zshrc` or `~/.bashrc`:
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20
```

Then restart terminal or run: `source ~/.zshrc`

## Test Credentials

- Email: `admin@pmpapp.com`
- Password: `admin123`

🎉 Ready to test!

