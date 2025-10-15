# Components Directory

This directory contains React components that can be embedded in the Embeddable platform.

## Structure

Each component consists of two main files:
1. **`index.tsx`** - The React component implementation
2. **`*.emb.ts`** - Component metadata and configuration file

## Component Metadata File (*.emb.ts)

The `.emb.ts` file defines:
- **meta object**: Component configuration
  - `name`: Unique component identifier
  - `label`: Display name in the builder
  - `category`: Grouping in component library
  - `defaultWidth`/`defaultHeight`: Default dimensions
  - `classNames`: CSS classes to apply
  - `inputs`: Array of input definitions for the builder UI
  - `events`: Array of event definitions for interactivity

- **Input types**:
  - `string`, `number`, `boolean`: Simple values
  - `dataset`: Data source selection
  - `dimension`: Categorical field from a dataset
  - `measure`: Numeric aggregation from a dataset

- **defineComponent()**: Connects the React component to metadata
  - `props`: Function that maps inputs to component props
  - `events`: Event handlers for component interactions

## Loading Data

Use `loadData()` from `@embeddable.com/core` to fetch data. This function enables no-code users to configure data selection dynamically and generates SQL-like queries to retrieve data.

### Basic Usage
```typescript
props: (inputs: Inputs<typeof meta>) => {
  return {
    ...inputs,
    results: loadData({
      from: inputs.ds,
      select: [inputs.dimension, inputs.measure]
    }),
  };
}
```

### loadData Parameters
- **`from`** (required): Dataset to query
- **`select`** (required): Array of dimensions, measures, or time dimensions to retrieve
- **`orderBy`**: Sorting configuration
- **`limit`**: Maximum rows to return (default: 100)
- **`offset`**: Number of rows to skip for pagination
- **`filters`**: Additional query filters (array)
- **`timezone`**: Time zone for aggregations (defaults to UTC)

### Filter Operators
- **Comparison**: `equals`, `notEquals`, `gt`, `gte`, `lt`, `lte`
- **String**: `contains`, `startsWith`, `endsWith`
- **Existence**: `set`, `notSet`
- **Date**: `inDateRange`, `beforeDate`, `afterDate`

### Advanced Example
```typescript
results: loadData({
  from: inputs.dataset,
  select: [inputs.dimension, inputs.measure],
  filters: [{
    property: inputs.measure,
    operator: 'gt',
    value: 0
  }],
  orderBy: [{ property: inputs.measure, direction: 'desc' }],
  limit: 50
})
```

### DataResponse Object
The `results` prop returns a `DataResponse` with:
- **`isLoading`**: Boolean indicating loading state
- **`error`**: Error message if request fails
- **`data`**: Array of objects with dimension/measure values

## Events

Define events in metadata for interactivity:
```typescript
events: [
  {
    name: 'onChange',
    label: 'Change',
    properties: [{ name: 'value', type: 'string' }]
  }
]
```

Map event handlers in `defineComponent()`:
```typescript
events: {
  onChange: (value) => ({ value: value || Value.noFilter() })
}
```

## Common Patterns

- Use `<Spinner/>` component for loading states
- Use `<Error msg={error}/>` for error display
- Shared styles are in [styles.ts](examples/styles.ts)
- Chart.js is available for data visualizations (see ExamplePieChart)
- Components can use any CSS framework or charting library
- Multiple `loadData()` calls can be used in a single component

## Development Requirements

- Node.js 20 or later
- Components are bundled with Vite.js
- React-based component development
- No limitations on design systems or third-party libraries

## References

- Official docs: https://docs.embeddable.com/development/introduction
- Loading data: https://docs.embeddable.com/development/loading-data
