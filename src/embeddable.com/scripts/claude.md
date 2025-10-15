# Scripts Directory

This directory contains Node.js scripts for managing database connections and embeddings via the Embeddable API.

## Available Scripts

### Connection Management
- **connection-create.cjs** - Create a new database connection
- **connection-read.cjs** - Read/retrieve a connection by name
- **connection-update.cjs** - Update an existing connection
- **connection-delete.cjs** - Delete a connection
- **connection-list.cjs** - List all connections
- **connection-test.cjs** - Test a connection's validity

### Embedding Management
- **embedding-preview.cjs** - Preview embedding configurations

## Configuration

All scripts require configuration at the top of the file:

```javascript
const apiKey = '...';  // Your Embeddable API key
const BASE_URL = 'https://api.us.embeddable.com'; // US
// const BASE_URL = 'https://api.eu.embeddable.com'; // EU
```

## Connection Scripts Usage

### Creating a Connection

Edit [connection-create.cjs](connection-create.cjs):
```javascript
const connectionName = 'my-db';
const dbType = 'postgres'; // or bigquery, snowflake, etc.
const credentials = {
  database: 'mydb',
  host: 'localhost',
  user: 'user',
  password: 'pass',
};
```

Then run: `node src/embeddable.com/scripts/connection-create.cjs`

### Supported Database Types
- PostgreSQL (`postgres`)
- BigQuery (`bigquery`)
- Snowflake (`snowflake`)
- MySQL (`mysql`)
- And more - see https://docs.embeddable.com/data/credentials

### API Authentication

All scripts use Bearer token authentication:
```javascript
headers: {
  'Authorization': `Bearer ${apiKey}`
}
```

Keep your API key secure and never commit it to version control.

## Running Scripts

```bash
node src/embeddable.com/scripts/<script-name>.cjs
```

## API Endpoints

Scripts interact with the Embeddable API v1:
- `POST /api/v1/connections` - Create connection
- `GET /api/v1/connections` - List connections
- `GET /api/v1/connections/:name` - Get connection
- `PUT /api/v1/connections/:name` - Update connection
- `DELETE /api/v1/connections/:name` - Delete connection

## References
- Connection credentials: https://docs.embeddable.com/data/credentials
- API documentation: https://docs.embeddable.com/api
