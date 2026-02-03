# Installing PostgreSQL Client Tools

## Error: `psql: command not found` or `createdb: command not found`

This means PostgreSQL client tools are not installed or not in your PATH.

## Installation Instructions

### macOS

**Using Homebrew (Recommended):**
```bash
# Install PostgreSQL
brew install postgresql@15
# Or for latest version:
brew install postgresql

# Add to PATH (for this session)
export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"

# Or add to ~/.zshrc or ~/.bash_profile for permanent:
echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**Verify installation:**
```bash
psql --version
createdb --version
```

### Linux (Ubuntu/Debian)

```bash
sudo apt-get update
sudo apt-get install postgresql-client

# Or install full PostgreSQL (includes server):
sudo apt-get install postgresql postgresql-contrib
```

### Linux (Fedora/RHEL/CentOS)

```bash
sudo dnf install postgresql
# Or:
sudo yum install postgresql
```

### Windows

1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer
3. Make sure to check "Add PostgreSQL to PATH" during installation
4. Restart your terminal/command prompt

### Verify Installation

After installation, verify the tools are available:

```bash
psql --version
createdb --version
```

If you still get "command not found", you may need to:
1. Restart your terminal
2. Add PostgreSQL bin directory to your PATH
3. Check the installation location and add it manually to PATH

## After Installation

Once PostgreSQL tools are installed, you can run:

```bash
./scripts/db-setup.sh
```

This will:
- Create the database
- Run migrations
- Seed initial data
