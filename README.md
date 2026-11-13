# Expense Claim Portal

Angular 20 frontend for the expense-claims workshop. The separately deployed Spring Boot API is in [`claims-service`](https://github.com/gkoshy-accenture/claims-service).

## Run locally

Requires Node.js 22.12 or newer.

```sh
npm ci
npm start
```

Open <http://localhost:4200>. The Angular dev server proxies `/api` requests to `http://localhost:8081`; start the API first for live data.

## Test and build

```sh
npm test
npm run build -- --base-href /myapp/
```

Tests use headless Chrome. The production build is deployed under `/myapp/`.

## Deploy

The root `Jenkinsfile` checks out this repository, runs tests, builds the static site, and deploys it to `/var/www/expense-ui`. The VM and Caddy setup is maintained in the `claims-service` repository.
