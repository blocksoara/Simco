import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SASPAY_API_BASE = 'https://api.saspay.me/api/v1';
const SASPAY_API_KEY =
  process.env.SASPAY_API_KEY || 'sk_live_yPRAneq68CjDbvri30C4uJe3TBKo5C7vyCbh1oM826o';

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  // Dynamic CORS headers
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Vary', 'Origin');
      res.header('Access-Control-Allow-Credentials', 'true');
    } else {
      res.header('Access-Control-Allow-Origin', '*');
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Api-Version, X-CSRF-Token'
    );
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    next();
  });

  app.use(express.json());

  // -------------------------------------------------------------
  // API Routes: SasPay Integration
  // -------------------------------------------------------------

  /**
   * Health & Config check
   */
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Homeluxe Real Estate Backend',
      saspayConfigured: Boolean(SASPAY_API_KEY),
    });
  });

  /**
   * GET /api/saspay/pricing-fees
   * Returns official publishing fees configured per user instructions
   */
  app.get('/api/saspay/pricing-fees', (req, res) => {
    res.json({
      baseCurrency: 'XAF',
      fees: [
        { type: 'Single Family Home', nameFr: 'Maison individuelle', amountXaf: 500 },
        { type: 'Condo / Apartment', nameFr: 'Appartement / Combo', amountXaf: 1000 },
        { type: 'Coastal Villa', nameFr: 'Villa côtière', amountXaf: 1500 },
        { type: 'Luxury Villa', nameFr: 'Villa de prestige', amountXaf: 2000 },
        { type: 'Land / Plot', nameFr: 'Terrain / Parcelle', amountXaf: 3000 },
      ],
    });
  });

const SASPAY_MINIMUMS: Record<string, number> = {
  EUR: 1.00,
  USD: 0.50,
  GBP: 1.00,
  CAD: 1.00,
  CHF: 1.00,
  XAF: 200,
  XOF: 200,
  AED: 2,
  MAD: 4,
  DZD: 48,
  TND: 2,
  CDF: 800,
  GNF: 3200,
  NGN: 470,
  ZAR: 6,
  GHS: 5,
  KES: 50,
  MGA: 1600,
  MUR: 20,
};

function resolveCountryIso(countryInput?: string): string | undefined {
  if (!countryInput) return undefined;
  const clean = String(countryInput).trim();
  if (/^[A-Za-z]{2}$/.test(clean)) {
    return clean.toUpperCase();
  }
  const lower = clean.toLowerCase();
  if (lower.includes('france')) return 'FR';
  if (lower.includes('cameroun') || lower.includes('cameroon')) return 'CM';
  if (lower.includes('ivoire') || lower.includes('ivory')) return 'CI';
  if (lower.includes('sénégal') || lower.includes('senegal')) return 'SN';
  if (lower.includes('gabon')) return 'GA';
  if (lower.includes('bénin') || lower.includes('benin')) return 'BJ';
  if (lower.includes('togo')) return 'TG';
  if (lower.includes('mali')) return 'ML';
  if (lower.includes('burkina')) return 'BF';
  if (lower.includes('congo') && (lower.includes('rdc') || lower.includes('démocratique') || lower.includes('kinshasa'))) return 'CD';
  if (lower.includes('congo')) return 'CG';
  if (lower.includes('guinée') || lower.includes('guinea')) return 'GN';
  if (lower.includes('maroc') || lower.includes('morocco')) return 'MA';
  if (lower.includes('algérie') || lower.includes('algeria')) return 'DZ';
  if (lower.includes('tunisie') || lower.includes('tunisia')) return 'TN';
  if (lower.includes('états-unis') || lower.includes('united states') || lower.includes('usa')) return 'US';
  if (lower.includes('canada')) return 'CA';
  if (lower.includes('royaume-uni') || lower.includes('united kingdom')) return 'GB';
  if (lower.includes('suisse') || lower.includes('switzerland')) return 'CH';
  if (lower.includes('belgique') || lower.includes('belgium')) return 'BE';
  if (lower.includes('espagne') || lower.includes('spain')) return 'ES';
  if (lower.includes('italie') || lower.includes('italy')) return 'IT';
  if (lower.includes('allemagne') || lower.includes('germany')) return 'DE';
  if (lower.includes('émirats') || lower.includes('emirates') || lower.includes('dubai')) return 'AE';
  if (lower.includes('afrique du sud') || lower.includes('south africa')) return 'ZA';
  if (lower.includes('nigeria') || lower.includes('nigéria')) return 'NG';
  if (lower.includes('ghana')) return 'GH';
  if (lower.includes('kenya')) return 'KE';
  if (lower.includes('madagascar')) return 'MG';
  if (lower.includes('maurice') || lower.includes('mauritius')) return 'MU';
  return undefined;
}

  /**
   * POST /api/saspay/create-checkout and /api/payment/create-listing-order
   * Initiates a hosted checkout session via SasPay REST API
   * Following https://docs.saspay.me/quickstart and /api-reference/payments/checkout-create
   */
  app.post(['/api/saspay/create-checkout', '/api/payment/create-listing-order'], async (req, res) => {
    try {
      const {
        amount,
        currency = 'XAF',
        description,
        country,
        customer_email,
        customer_name,
        customer_phone = '',
        metadata = {},
      } = req.body;

      const finalEmail = String(customer_email || '').trim() || 'annonceur@homeluxe.com';
      const finalName = String(customer_name || '').trim() || 'Annonceur Homeluxe';
      const upperCurrency = String(currency || 'XAF').toUpperCase();

      // Ensure amount satisfies SasPay gateway minimums e.g. 1.00 EUR, 0.50 USD, 200 XAF
      const numAmount = parseFloat(String(amount));
      const minAllowed = SASPAY_MINIMUMS[upperCurrency] || 1.00;
      const finalAmount = isNaN(numAmount) ? minAllowed : Math.max(numAmount, minAllowed);
      const formattedAmount = finalAmount.toFixed(2);

      const resolvedCountry = resolveCountryIso(country);

      const payload: Record<string, any> = {
        amount: formattedAmount,
        currency: upperCurrency,
        description: description || `Publication annonce Homeluxe (${upperCurrency})`,
        customer_email: finalEmail,
        customer_name: finalName,
        customer_phone: String(customer_phone || '').trim(),
        metadata: {
          platform: 'homeluxe',
          service: 'property_listing_fee',
          ...metadata,
        },
      };

      // Only pass country if it is a valid 2-letter uppercase ISO code
      if (resolvedCountry) {
        payload.country = resolvedCountry;
      }

      console.log('[SasPay] Creating checkout session:', {
        amount: payload.amount,
        currency: payload.currency,
        country: payload.country || '(global/unrestricted)',
        customer_email: payload.customer_email,
      });

      const sendSasPayRequest = async () => {
        const resp = await fetch(`${SASPAY_API_BASE}/checkout-sessions/`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${SASPAY_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const text = await resp.text();
        let parsed: any = null;
        try {
          parsed = JSON.parse(text);
        } catch (_) {
          parsed = null;
        }
        return { ok: resp.ok, status: resp.status, data: parsed, rawText: text };
      };

      let result = await sendSasPayRequest();

      // Retry once on 502/503/504
      if (!result.ok && (result.status >= 500 || !result.data)) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        result = await sendSasPayRequest();
      }

      if (!result.data) {
        return res.status(result.status || 502).json({
          success: false,
          error:
            'La passerelle SasPay est momentanément indisponible (502). Veuillez réessayer dans un instant.',
          details: result.rawText,
        });
      }

      const data = result.data;

      if (!result.ok || !data.success) {
        console.error('[SasPay] Checkout creation failed:', data);
        let errorMsg = 'Erreur lors de la création de la session SasPay';
        if (typeof data.message === 'string' && data.message.trim()) {
          errorMsg = data.message;
        } else if (typeof data.error === 'string' && data.error.trim()) {
          errorMsg = data.error;
        } else if (data.error && typeof data.error === 'object') {
          if (typeof data.error.detail === 'string' && data.error.detail.trim()) {
            errorMsg = data.error.detail;
          } else {
            const parts = Object.entries(data.error).map(([k, v]) => {
              const valStr = Array.isArray(v) ? v.join(', ') : String(v);
              return `${k}: ${valStr}`;
            });
            if (parts.length > 0) errorMsg = parts.join(' | ');
          }
        }
        return res.status(result.status || 400).json({
          success: false,
          error: errorMsg,
          details: data,
        });
      }

      return res.status(201).json(data);
    } catch (err: any) {
      console.error('[SasPay] Unexpected error creating checkout session:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Erreur interne du serveur lors de la communication avec SasPay',
      });
    }
  });

  /**
   * GET /api/saspay/check-status/:id and /api/payment/check-status/:id
   * Polls the status of a checkout session
   * Docs: GET /api/v1/checkout-sessions/{id}/status/
   */
  app.get(['/api/saspay/check-status/:id', '/api/payment/check-status/:id'], async (req, res) => {
    try {
      const sessionId = req.params.id;
      if (!sessionId) {
        return res.status(400).json({ success: false, error: 'Session ID is required' });
      }

      const response = await fetch(`${SASPAY_API_BASE}/checkout-sessions/${sessionId}/status/`, {
        headers: {
          Authorization: `Bearer ${SASPAY_API_KEY}`,
        },
      });

      const text = await response.text();
      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch (_) {
        data = null;
      }

      if (!data) {
        return res.status(response.status || 502).json({
          success: false,
          error: 'Statut SasPay indisponible',
          details: text,
        });
      }

      if (!response.ok) {
        let errorMsg = 'Impossible de vérifier le statut de la session';
        if (typeof data.message === 'string' && data.message.trim()) {
          errorMsg = data.message;
        } else if (typeof data.error === 'string' && data.error.trim()) {
          errorMsg = data.error;
        }
        return res.status(response.status).json({
          success: false,
          error: errorMsg,
          details: data,
        });
      }

      return res.json(data);
    } catch (err: any) {
      console.error('[SasPay] Status check error:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Erreur lors de la vérification du statut SasPay',
      });
    }
  });

  /**
   * GET /api/saspay/countries
   * Proxies supported countries
   */
  app.get('/api/saspay/countries', async (req, res) => {
    try {
      const response = await fetch(`${SASPAY_API_BASE}/countries/`);
      const data = await response.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  /**
   * GET /api/saspay/networks
   * Proxies supported mobile money networks
   */
  app.get('/api/saspay/networks', async (req, res) => {
    try {
      const response = await fetch(`${SASPAY_API_BASE}/networks/`, {
        headers: {
          Authorization: `Bearer ${SASPAY_API_KEY}`,
        },
      });
      const data = await response.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // -------------------------------------------------------------
  // Static files & Vite Middleware setup
  // -------------------------------------------------------------
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Homeluxe] Server listening on http://0.0.0.0:${PORT} (env: ${process.env.NODE_ENV || 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('[Homeluxe] Failed to start server:', err);
  process.exit(1);
});
