# Warehouse (warehouse)

Warehouse SPA that interacts with the Warehouse API: https://github.com/Lietsaki/warehouse-api-test
Visit the live version: https://warehouse-frontend-14e9b.web.app/#/

List of features:

- Fetch products and articles.
- User account creation and login.
- Create products and articles (only if logged in).
- Delete products and articles (only if logged in).
- Sell products, meaning that the product gets deleted and its number of required articles is subtracted from the articles' stock (only if logged in).
- Upload products in batch from a JSON file (only if logged in).
- Upload articles in batch from a JSON file (only if logged in).
- Responsiveness for mobile devices under 600px width.

## Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Build the app for production
```bash
quasar build
```

