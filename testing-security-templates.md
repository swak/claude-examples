# Testing and Security Implementation Templates

## Quick Reference Templates for Testing & Security Agent

### Frontend Testing Templates

#### React Component Test Template
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import Component from './Component';

expect.extend(toHaveNoViolations);

describe('Component', () => {
  const mockProps = {
    onAction: jest.fn(),
    data: { id: '1', name: 'Test' }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with required props', () => {
    render(<Component {...mockProps} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    const user = userEvent.setup();
    render(<Component {...mockProps} />);
    
    await user.click(screen.getByRole('button'));
    expect(mockProps.onAction).toHaveBeenCalledWith('1');
  });

  it('should be accessible', async () => {
    const { container } = render(<Component {...mockProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should match snapshot', () => {
    const { container } = render(<Component {...mockProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
```

#### Playwright E2E Test Template
```typescript
import { test, expect, Page } from '@playwright/test';

test.describe('User Authentication Flow', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.goto('/login');
  });

  test('should login successfully with valid credentials', async () => {
    await page.fill('[data-testid="email"]', 'user@example.com');
    await page.fill('[data-testid="password"]', 'validpassword');
    await page.click('[data-testid="login-button"]');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should show error for invalid credentials', async () => {
    await page.fill('[data-testid="email"]', 'user@example.com');
    await page.fill('[data-testid="password"]', 'wrongpassword');
    await page.click('[data-testid="login-button"]');

    await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid credentials');
  });

  test('should be accessible', async () => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
```

### Backend Testing Templates

#### FastAPI Test Template
```python
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from unittest.mock import Mock, patch
import jwt

from main import app, get_db
from database import Base
from models import User
from auth import create_access_token

# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture
def authenticated_user():
    user_data = {"sub": "testuser", "permissions": ["read", "write"]}
    token = create_access_token(data=user_data)
    return {"Authorization": f"Bearer {token}"}

class TestUserAPI:
    def test_create_user_success(self):
        response = client.post(
            "/users/",
            json={"email": "test@example.com", "password": "securepass123"}
        )
        assert response.status_code == 201
        data = response.json()
        assert data["email"] == "test@example.com"
        assert "password" not in data

    def test_create_user_duplicate_email(self):
        # Create first user
        client.post("/users/", json={"email": "test@example.com", "password": "pass123"})
        
        # Try to create duplicate
        response = client.post(
            "/users/",
            json={"email": "test@example.com", "password": "pass456"}
        )
        assert response.status_code == 400
        assert "already exists" in response.json()["detail"]

    def test_get_user_authenticated(self, authenticated_user):
        response = client.get("/users/me", headers=authenticated_user)
        assert response.status_code == 200
        data = response.json()
        assert "email" in data

    def test_get_user_unauthorized(self):
        response = client.get("/users/me")
        assert response.status_code == 401

    @patch('external_service.send_email')
    def test_user_registration_sends_email(self, mock_send_email):
        mock_send_email.return_value = True
        
        response = client.post(
            "/users/register",
            json={"email": "new@example.com", "password": "securepass123"}
        )
        
        assert response.status_code == 201
        mock_send_email.assert_called_once()
```

#### Pytest Security Test Template
```python
import pytest
import requests
from sqlalchemy.orm import Session
from fastapi.testclient import TestClient
import time
import hashlib

from main import app
from auth import verify_password, get_password_hash
from database import get_db

client = TestClient(app)

class TestSecurityVulnerabilities:
    
    def test_sql_injection_protection(self):
        """Test SQL injection attempts are properly handled"""
        malicious_payloads = [
            "'; DROP TABLE users; --",
            "1' OR '1'='1",
            "admin'/*",
            "'; INSERT INTO users VALUES ('hacker', 'pass'); --"
        ]
        
        for payload in malicious_payloads:
            response = client.get(f"/users/search?name={payload}")
            # Should not return 500 or expose database errors
            assert response.status_code in [200, 400, 404]
            # Should not contain SQL error messages
            assert "syntax error" not in response.text.lower()
            assert "mysql" not in response.text.lower()
            assert "postgresql" not in response.text.lower()

    def test_xss_protection(self):
        """Test XSS payload handling"""
        xss_payloads = [
            "<script>alert('xss')</script>",
            "javascript:alert('xss')",
            "<img src=x onerror=alert('xss')>",
            "';alert('xss');''"
        ]
        
        for payload in xss_payloads:
            response = client.post(
                "/comments/",
                json={"content": payload}
            )
            # Content should be escaped/sanitized
            assert "<script>" not in response.text
            assert "javascript:" not in response.text

    def test_password_hashing_security(self):
        """Test password storage security"""
        password = "testpassword123"
        hashed = get_password_hash(password)
        
        # Password should be hashed (not plaintext)
        assert hashed != password
        # Should use strong hashing (bcrypt produces 60-char hash)
        assert len(hashed) >= 60
        # Should verify correctly
        assert verify_password(password, hashed)
        # Should not verify incorrect password
        assert not verify_password("wrongpassword", hashed)

    def test_rate_limiting(self):
        """Test rate limiting implementation"""
        # Attempt multiple rapid requests
        responses = []
        for _ in range(20):
            response = client.post(
                "/auth/login",
                json={"email": "test@example.com", "password": "wrongpass"}
            )
            responses.append(response.status_code)
            time.sleep(0.1)
        
        # Should receive rate limiting response
        assert 429 in responses  # Too Many Requests

    def test_csrf_protection(self):
        """Test CSRF protection is enabled"""
        # Attempt request without CSRF token
        response = client.post(
            "/users/update-profile",
            json={"name": "Updated Name"},
            headers={"Origin": "https://malicious-site.com"}
        )
        # Should be blocked or require CSRF token
        assert response.status_code in [400, 403, 422]

    def test_sensitive_data_exposure(self):
        """Test that sensitive data is not exposed"""
        response = client.get("/users/1")
        data = response.json()
        
        # Sensitive fields should not be present
        sensitive_fields = ["password", "password_hash", "secret_key", "private_key"]
        for field in sensitive_fields:
            assert field not in data

    def test_jwt_token_security(self):
        """Test JWT token implementation security"""
        # Test with expired token
        expired_token = jwt.encode(
            {"sub": "user", "exp": time.time() - 3600},
            "secret", algorithm="HS256"
        )
        
        response = client.get(
            "/users/me",
            headers={"Authorization": f"Bearer {expired_token}"}
        )
        assert response.status_code == 401

        # Test with malformed token
        response = client.get(
            "/users/me",
            headers={"Authorization": "Bearer invalid.token.here"}
        )
        assert response.status_code == 401
```

### Security Configuration Templates

#### Security Headers Configuration
```typescript
// Next.js Security Headers
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-src 'none'"
    ].join('; ')
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};
```

#### Docker Security Template
```dockerfile
# Multi-stage build for security
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM node:18-alpine AS runner
# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set working directory
WORKDIR /app

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --chown=nextjs:nodejs public ./public
COPY --chown=nextjs:nodejs package.json ./package.json

# Security: Run as non-root user
USER nextjs

# Security: Don't run as PID 1
ENTRYPOINT ["dumb-init", "--"]

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

EXPOSE 3000

CMD ["npm", "start"]
```

### Performance Testing Templates

#### k6 Load Test Template
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

export let errorRate = new Rate('errors');

export let options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up
    { duration: '5m', target: 100 }, // Sustained load
    { duration: '2m', target: 200 }, // Spike test
    { duration: '5m', target: 200 }, // Sustained spike
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(99)<1500'], // 99% under 1.5s
    http_req_failed: ['rate<0.1'],     // Error rate under 10%
    errors: ['rate<0.1'],              // Custom error rate
  },
};

const BASE_URL = 'https://your-api.com';

export default function () {
  let loginResponse = http.post(`${BASE_URL}/auth/login`, {
    email: 'test@example.com',
    password: 'testpassword'
  });

  check(loginResponse, {
    'login status is 200': (r) => r.status === 200,
    'login response time < 500ms': (r) => r.timings.duration < 500,
  }) || errorRate.add(1);

  if (loginResponse.status === 200) {
    const token = loginResponse.json('token');
    const headers = { Authorization: `Bearer ${token}` };

    let profileResponse = http.get(`${BASE_URL}/users/profile`, { headers });
    
    check(profileResponse, {
      'profile status is 200': (r) => r.status === 200,
      'profile has email': (r) => r.json('email') !== undefined,
    }) || errorRate.add(1);
  }

  sleep(1);
}
```

### CI/CD Security Pipeline Template

#### GitHub Actions Security Workflow
```yaml
name: Security & Quality Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      # Dependency vulnerability scanning
      - name: Install dependencies
        run: npm ci

      - name: Run npm audit
        run: npm audit --audit-level=moderate

      # SAST scanning
      - name: Run Semgrep
        uses: returntocorp/semgrep-action@v1
        with:
          config: >-
            p/security-audit
            p/secrets
            p/owasp-top-ten

      # Container security scanning
      - name: Build Docker image
        run: docker build -t app:latest .

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'app:latest'
          format: 'sarif'
          output: 'trivy-results.sarif'

      # Infrastructure as Code scanning
      - name: Run Checkov
        uses: bridgecrewio/checkov-action@master
        with:
          directory: .
          framework: dockerfile,kubernetes
          output_format: sarif
          output_file_path: checkov-results.sarif

      # Upload results to GitHub Security tab
      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v2
        if: always()
        with:
          sarif_file: 'trivy-results.sarif'

      - name: Upload Checkov scan results
        uses: github/codeql-action/upload-sarif@v2
        if: always()
        with:
          sarif_file: 'checkov-results.sarif'

  quality-gate:
    runs-on: ubuntu-latest
    needs: security-scan
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      # Run comprehensive test suite
      - name: Run unit tests
        run: npm run test:unit -- --coverage

      - name: Run integration tests
        run: npm run test:integration

      - name: Run E2E tests
        run: npm run test:e2e

      # Performance testing
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.12.x
          lhci autorun

      # Security testing
      - name: Run OWASP ZAP Baseline Scan
        uses: zaproxy/action-baseline@v0.7.0
        with:
          target: 'http://localhost:3000'

      # Quality metrics validation
      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}

      # Fail if quality gates don't pass
      - name: Quality Gate Check
        run: |
          # Check test coverage (minimum 80%)
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "Coverage $COVERAGE% is below 80% threshold"
            exit 1
          fi

          # Check for high severity vulnerabilities
          if [ -f "vulnerability-report.json" ]; then
            HIGH_VULNS=$(cat vulnerability-report.json | jq '.vulnerabilities[] | select(.severity=="high" or .severity=="critical") | length')
            if [ "$HIGH_VULNS" -gt 0 ]; then
              echo "Found $HIGH_VULNS high/critical vulnerabilities"
              exit 1
            fi
          fi
```

### Accessibility Testing Template

#### axe-core Integration
```typescript
// jest-setup.ts
import 'jest-axe/extend-expect';

// Component.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Component from './Component';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<Component />);
    const results = await axe(container, {
      rules: {
        // Customize rules as needed
        'color-contrast': { enabled: true },
        'keyboard-navigation': { enabled: true },
        'focus-management': { enabled: true },
      }
    });
    expect(results).toHaveNoViolations();
  });

  it('should be keyboard navigable', async () => {
    render(<Component />);
    const interactiveElements = screen.getAllByRole(/button|link|textbox|checkbox|radio/);
    
    for (const element of interactiveElements) {
      element.focus();
      expect(element).toHaveFocus();
    }
  });
});
```

This template collection provides immediate, actionable code examples that the testing and security specialist agent can reference and adapt for specific project needs. Each template follows industry best practices and includes comprehensive security and quality validation patterns.