# Troubleshooting Guide

Common issues and solutions for the PMP Exam Prep App.

## Backend Issues

### Database Connection Errors

**Problem**: Services can't connect to PostgreSQL

**Solutions**:
1. Verify PostgreSQL is running:
   ```bash
   pg_isready
   ```

2. Check database credentials in `.env` files

3. Ensure database exists:
   ```bash
   psql -l | grep pmp_app
   ```

4. Check firewall/network settings

### Port Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use`

**Solutions**:
1. Find process using the port:
   ```bash
   lsof -i :3001  # Replace with your port
   ```

2. Kill the process or change port in `.env`

### Module Not Found Errors

**Problem**: `Cannot find module '@pmp-app/shared'`

**Solutions**:
1. Build shared package first:
   ```bash
   cd backend/shared
   npm install
   npm run build
   ```

2. Install dependencies in service:
   ```bash
   cd backend/user-service
   npm install
   ```

## Mobile App Issues

### Expo Connection Errors

**Problem**: Can't connect to Expo server

**Solutions**:
1. Clear Expo cache:
   ```bash
   cd mobile
   expo start -c
   ```

2. Check network connectivity

3. Verify API URL in `.env`:
   ```bash
   cat mobile/.env
   ```

### Build Errors

**Problem**: TypeScript or build errors

**Solutions**:
1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```

2. Clear watchman cache:
   ```bash
   watchman watch-del-all
   ```

3. Reset Metro bundler cache:
   ```bash
   expo start -c
   ```

### Navigation Errors

**Problem**: Navigation not working

**Solutions**:
1. Ensure all navigation dependencies are installed:
   ```bash
   npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
   ```

2. Check navigation setup in `AppNavigator.tsx`

## Web Admin Issues

### Build Errors

**Problem**: Vite build fails

**Solutions**:
1. Clear node_modules:
   ```bash
   cd web-admin
   rm -rf node_modules
   npm install
   ```

2. Check TypeScript errors:
   ```bash
   npm run build
   ```

### API Connection Errors

**Problem**: Can't connect to backend API

**Solutions**:
1. Verify backend services are running

2. Check API URL in `.env`:
   ```bash
   cat web-admin/.env
   ```

3. Check CORS settings in backend services

4. Verify proxy settings in `vite.config.ts`

## Docker Issues

### Container Won't Start

**Problem**: Docker containers exit immediately

**Solutions**:
1. Check logs:
   ```bash
   docker-compose logs
   ```

2. Verify environment variables

3. Check database connection

4. Ensure ports aren't in use

### Build Failures

**Problem**: Docker build fails

**Solutions**:
1. Check Dockerfile syntax

2. Verify all files are in context

3. Check for missing dependencies

4. Review build logs for specific errors

## Database Issues

### Migration Errors

**Problem**: Migrations fail to run

**Solutions**:
1. Check PostgreSQL version (15+ required)

2. Verify database user has permissions

3. Check for existing tables:
   ```bash
   psql -d pmp_app -c "\dt"
   ```

4. Drop and recreate if needed:
   ```bash
   dropdb pmp_app
   createdb pmp_app
   psql -d pmp_app -f backend/database/migrations/001_initial_schema.sql
   ```

### Connection Pool Errors

**Problem**: Too many database connections

**Solutions**:
1. Reduce connection pool size in service configs

2. Check for connection leaks

3. Restart services

## Authentication Issues

### JWT Token Errors

**Problem**: Invalid or expired tokens

**Solutions**:
1. Check JWT_SECRET in `.env` files

2. Verify token expiration settings

3. Clear stored tokens and re-login

### Password Reset Not Working

**Problem**: Password reset emails not sent

**Solutions**:
1. Verify SMTP settings in `.env`

2. Check email service credentials

3. Test SMTP connection

4. Check spam folder

## Performance Issues

### Slow API Responses

**Solutions**:
1. Check database query performance

2. Add database indexes

3. Implement caching

4. Check network latency

5. Monitor resource usage

### High Memory Usage

**Solutions**:
1. Check for memory leaks

2. Reduce connection pool sizes

3. Implement pagination

4. Optimize queries

## Getting Help

1. Check logs:
   - Backend: Check console output
   - Mobile: `expo start` shows errors
   - Web: Browser console

2. Review documentation:
   - `SETUP.md` for setup issues
   - `README.md` for general info

3. Check GitHub issues

4. Review error messages carefully

## Common Commands

```bash
# Restart all services
docker-compose restart

# View logs
docker-compose logs -f

# Reset database
./scripts/db-setup.sh

# Reinstall dependencies
find . -name node_modules -type d -prune -exec rm -rf {} \;
npm install  # in each directory
```



