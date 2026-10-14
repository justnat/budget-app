# SmartBudget

React conversion of the supplied SmartBudget financial dashboard. The project separates the UI into reusable React components, keeps styling in `src/styles.css`, and stores budget data in SQLite through an Express API.

## Requirements

- Node.js 20 or newer
- npm

## Run in development

```sh
npm install
npm run dev
```

Vite serves the React app at `http://localhost:5173` and proxies `/api` requests to Express at `http://localhost:3001`. The first run seeds the original example budget. SQLite data is kept in `server/data/smartbudget.sqlite`.

## Production build

```sh
npm install
npm run build
npm start
```

Express serves the built app and API on port 3001. Set `PORT` to change the port.

## Features

- Dashboard cards, expense breakdown, 12-month cash flow forecast, and spending health check
- Income and expense tracking with monthly, weekly, biweekly, and annual frequencies
- 50/30/20 target comparison and savings goals
- Scenario simulator, currency selection, dark theme, JSON export, demo data, and reset
- SQLite persistence through `GET /api/budget` and `PUT /api/budget`

The app is a single-user local budget planner; it does not include authentication or multi-user access control.
