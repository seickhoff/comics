# Comic Book Collection Manager

A web-based application for organizing and managing your comic book collection. Track your comics, generate valuation reports, and perform bulk operations with an intuitive interface.

## Features

### Collection Management

- **Add Comics**: Single entry or bulk add consecutive issues with automatic date increment
- **Edit & Delete**: Modify individual comics or batch-edit multiple selections
- **Smart Search**: Regex-powered filtering with AND/OR logic across all fields
- **Multi-Column Sorting**: Intelligent sorting that handles titles with "The" prefix
- **Auto-Complete**: Field suggestions based on your existing collection

### Batch Operations

- Select and edit multiple comics simultaneously
- Merge common field values, leave mismatched fields unchanged
- Append or replace comments during batch updates
- Bulk delete selected items

### Reports & Visualization

- **Maintenance View**: Full table with filtering, sorting, and inline editing
- **Summary View**: Interactive statistics dashboard with clickable filtering
  - Most valuable comics, top writers, artists, and publishers
  - Title rankings by issue count
  - Collection breakdown by condition and decade
  - Click any item to instantly filter the maintenance view
- **Heatmap View**: Visual timeline of your collection by publication date
  - Interactive grid showing comics by month and year
  - Color intensity indicates collection density
  - Click any cell to filter by specific month/year
  - Identify gaps and collection patterns at a glance
- **Overstreet Report**: Professional valuation report grouped by Title → Publisher → Volume

### Data Management

- Load collections from JSON files or clipboard
- Export collections with timestamped filenames
- Preview raw JSON data
- Column visibility controls

## Tech Stack

- **React 19** with TypeScript
- **React Router** for navigation
- **Bootstrap 5** via react-bootstrap
- **Vite** for fast development and builds
- **ESLint** and **Prettier** for code quality

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Visit http://localhost:5173 to view the app.

### Build for Production

```bash
npm run build
```

### Other Commands

- `npm run lint` - Check code quality
- `npm run fix` - Auto-fix linting issues
- `npm run format` - Format code with Prettier
- `npm run preview` - Preview production build

## Data Format

Collections are stored as JSON arrays with the following structure:

```json
[
  {
    "title": "The Amazing Spider-Man",
    "publisher": "Marvel",
    "volume": "1",
    "issue": "1",
    "month": "03",
    "year": "1963",
    "quantity": 1,
    "value": "500000.00",
    "condition": "VF",
    "writer": ["Stan Lee"],
    "artist": ["Steve Ditko"],
    "comments": "First appearance"
  }
]
```

### Grade Codes

- **MT** - Mint
- **NM** - Near Mint
- **VF** - Very Fine
- **FN** - Fine
- **VG** - Very Good
- **GD** - Good
- **FR** - Fair
- **PR** - Poor

## Project Structure

```
src/
├── components/       # Reusable UI components
├── config/           # Constants and configuration
├── context/          # React contexts and providers
├── hooks/            # Custom React hooks
├── interfaces/       # TypeScript interfaces
├── pages/            # Page components
├── routes/           # Route definitions
└── utils/            # Helper functions
```

## Usage Tips

### Bulk Add Comics

1. Fill in comic details including issue, month, and year
2. Enter an ending issue number in the "End Issue" field
3. Submit to create all comics in the range with auto-incrementing dates

### Batch Editing

1. Select multiple comics using checkboxes
2. Click "Edit Selected"
3. Modify any fields - empty fields = no change
4. Use the append option for comments to add notes without replacing existing text

### Smart Filtering

- Use regex patterns for advanced searching (e.g., `Spider.*Man`)
- Toggle AND/OR logic for combining multiple filters
- Filter any visible column in real-time

### Interactive Exploration

**Summary Page:**

- Click any writer, artist, or publisher name to see all their comics
- Click a title to view all issues in your collection
- Click a decade or condition to filter by those criteria
- Click a specific comic to view that exact issue

**Heatmap Page:**

- Click any month/year cell to view all comics published in that period
- Visual heat intensity shows collection density (darker = more comics)
- Quickly spot gaps or heavy collection periods

All interactive filters automatically navigate to the Maintenance view with appropriate filters applied.

## License

MIT
