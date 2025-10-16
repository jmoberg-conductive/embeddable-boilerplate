# Presets Directory

This directory contains configuration presets for client contexts and security contexts.

## Client Contexts (.cc.yml)

Client contexts provide front-facing configuration passed dynamically at runtime to customize the embeddable experience. This is client-side data that can be accessed in React components.

### Common Use Cases
- Client-specific theming
- Localization/language switching
- Dark/Light mode toggling
- Currency selection
- Passing custom data to components

### Structure
```yaml
- name: Context Name
  clientContext:
    key: value
    theme: 'theme-name'
    language: 'en'
    currency: 'USD'
  canvas:
    background: "#fff"
```

### Runtime Usage

When embedding, pass client context via the web component:
```html
<em-beddable
  client-context="${JSON.stringify({
    currency: 'dollar',
    language: 'english',
    theme: 'dark'
  })}"
></em-beddable>
```

Access in component definition:
```typescript
props: (inputs, [state, setState], clientContext) => ({
  ...inputs,
  clientContext
})
```

Use in React component:
```typescript
export default function Component(props) {
  const { clientContext } = props;
  const { language, theme } = clientContext;
  // Use context for conditional rendering
}
```

### Important Notes
- **Front-facing only**: Client context is visible to end users
- **Not for security**: Cannot be used in data models or server-side security
- **Testing**: Use presets in builder to test different client contexts

## Security Contexts (.sc.yml)

Security contexts provide private, backend-only information for row-level security and data access control. This ensures end-users only see data they're authorized to access.

### How It Works

1. **Security Token Generation**: When requesting an access token, pass a JSON security context
2. **SQL Filtering**: Use Jinja templating in data models to filter queries
3. **Server-Side Only**: Security context is never exposed to the frontend

### Structure
```yaml
- name: Context Name
  securityContext:
    userId: 45
    orgId: "abc123"
    countries: ['us-east', 'eu-west']
    role: admin
  environment: default
```

### Usage in Data Models

Reference security context in Cube.js models using `{COMPILE_CONTEXT.securityContext.property}`:

```yaml
# In models/*.cube.yml
cubes:
  - name: customers
    sql: >
      SELECT *
      FROM public.customers
      WHERE orgId = '{COMPILE_CONTEXT.securityContext.orgId}'
```

### Multi-Tenancy Example
```yaml
# Filter by organization
sql: >
  SELECT *
  FROM public.orders
  WHERE tenant_id = '{COMPILE_CONTEXT.securityContext.tenantId}'
```

### Role-Based Access
```yaml
# Filter by user role
sql: >
  SELECT *
  FROM public.reports
  WHERE visibility_level <= '{COMPILE_CONTEXT.securityContext.accessLevel}'
```

### Security Best Practices
- Security context is **NEVER** exposed to the frontend
- Passed securely via security tokens during authentication
- Use for filtering sensitive data at the SQL level
- Define multiple contexts for testing different user scenarios
- Test all security scenarios using presets before deployment
- Environment can be used to separate dev/staging/prod data

## Builder Usage

Both client and security contexts are used by the Embeddable builder during development and preview. They allow you to test different scenarios without deploying.

## References
- Client Context docs: https://docs.embeddable.com/development/client-context
- Row-level security: https://docs.embeddable.com/data-modeling/row-level-security
