# Data Models Directory

This directory contains Cube.js data model definitions in YAML format (`.cube.yml` files).

## Overview

The data modeling layer provides an abstraction between raw database data and analytics, serving as a "single source of truth" for data definitions. It uses Cube.js technology to:
- Ensure data consistency across all dashboards
- Improve maintainability by centralizing metric definitions
- Enable non-technical users to explore data without writing SQL
- Automatically generate optimized SQL queries
- Protect your database (default 100-row limit on queries)

## Structure

Each model file defines cubes that represent data sources and their relationships.

## Cube Definition

```yaml
cubes:
  - name: table_name
    title: Display Name
    sql_table: schema.table_name
    data_source: default
```

### Custom SQL

Use custom SQL queries instead of direct table access:
```yaml
sql: >
  select *
  from public.customers
  where country = '{COMPILE_CONTEXT.securityContext.country}'
```

## Dimensions

Dimensions are virtual columns used for filtering and grouping data. They can reference database columns or be computed using SQL expressions.

```yaml
dimensions:
  - name: id
    sql: id
    type: number
    primary_key: true

  - name: email
    title: 'Email address'
    sql: email
    type: string

  - name: created_at
    sql: created_at
    type: time
```

**Dimension types**: `string`, `number`, `time`

**Concatenation example** - Dimensions can combine multiple columns:
```yaml
- name: location
  title: "Location"
  sql: CONCAT(city, ', ', country)
  type: string
```

## Measures

Measures are numeric aggregations (metrics) calculated from your data:
```yaml
measures:
  - name: count
    type: count
    title: '# of records'

  - name: total_revenue
    type: sum
    sql: amount
    title: 'Total Revenue'
```

**Measure types**: `count`, `sum`, `avg`, `min`, `max`, `countDistinct`

Measures ensure consistent metric definitions across all dashboards and prevent inconsistencies in calculations.

## Joins

Define relationships between cubes:
```yaml
joins:
  - name: orders  # Name of the cube to join (not table name)
    sql: "{CUBE}.id = {orders}.customer_id"
    relationship: one_to_many  # or many_to_one, one_to_one
```

## Meta Properties

Add custom metadata that will be passed to components:
```yaml
dimensions:
  - name: created_at
    sql: created_at
    type: time
    meta:
      some_property: value
```

## Security Context

Reference security context for row-level security:
```yaml
sql: >
  select *
  from public.customers
  where country = '{COMPILE_CONTEXT.securityContext.country}'
```

Security contexts are defined in [../presets/security-contexts.sc.yml](../presets/security-contexts.sc.yml).

## Pre-aggregations

Define pre-aggregations for performance optimization:
```yaml
pre_aggregations:
  # See https://cube.dev/docs/caching/pre-aggregations/getting-started
```

## Development Workflow

1. Define data models in `*.cube.yml` files
2. Test models in the Data Playground (Embeddable builder)
3. Push models to your workspace using `npm run embeddable:push`
4. Build dashboards using the no-code builder

## Best Practices

- Centralize all metric definitions in data models
- Use meaningful titles for dimensions and measures
- Leverage row-level security with security contexts
- Test models thoroughly before deployment
- Document complex SQL expressions in comments

## References

- Cube.js documentation: https://cube.dev/docs
- Embeddable data modeling: https://docs.embeddable.com/data-modeling/introduction
- Data modeling 101: https://docs.embeddable.com/data-modeling/introduction
