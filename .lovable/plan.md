I will investigate and fix the UTMify tracking issues by addressing potential script loading errors, enhancing UTM parameter capture in the frontend, and standardizing the order status sent to the UTMify API.

### Changes to be made:

#### Frontend (`public/v99-core-secure-app.js` and `public/payment-blindado.js`)
- Fix the UTMify script tags to use the correct local path `js/latest.js` and remove redundant or broken script references.
- Enhance the `getTrackingParams` function to capture a wider range of tracking parameters (including `fbclid`, `gclid`, etc.) and to look for both standard and `utmify_` prefixed keys in `localStorage`.
- Add the UTMify API token to the script tags to ensure proper account association.

#### Backend (`src/routes/criar-pix.ts`)
- Change the initial order status sent to UTMify from `waiting_payment` to `pending`, which is more universally recognized for generated but unpaid orders.
- Ensure all captured tracking parameters are correctly mapped to the UTMify payload.

#### Backend (`src/lib/paradise.server.ts`)
- Add detailed logging for the UTMify API response to facilitate debugging if tracking still fails.

#### Syntax Review
- Verify that the changes maintain the correct JavaScript syntax, especially within the large template literals used for HTML injection.

TECHNICAL DETAILS:
- UTMify API endpoint: `https://api.utmify.com.br/api-credentials/orders`
- Headers: `x-api-token`
- Status mapping: `pending` (generated), `paid` (approved)
