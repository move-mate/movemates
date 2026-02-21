import { google } from 'googleapis';

export type WaitlistEntry = {
  name: string;
  email: string;
  phone: string;
  type: string;
  social: string;
  province: string;
  city: string;
};

export class DuplicateWaitlistEmailError extends Error {
  code = 'DUPLICATE_EMAIL' as const;

  constructor(email: string) {
    super(`Email already exists in waitlist: ${email}`);
    this.name = 'DuplicateWaitlistEmailError';
  }
}

const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

type ServiceAccountCredentials = {
  client_email: string;
  private_key: string;
};

const getRequiredEnv = (name: string): string => {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const stripWrappingQuotes = (value: string): string => {
  const trimmed = value.trim();
  const startsWithDoubleQuote = trimmed.startsWith('"') && trimmed.endsWith('"');
  const startsWithSingleQuote = trimmed.startsWith("'") && trimmed.endsWith("'");
  if (startsWithDoubleQuote || startsWithSingleQuote) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
};

const normalizeEmail = (value: string) => value.trim().toLowerCase();

const toSafeSheetName = (value?: string) => {
  const raw = value?.trim();
  if (!raw) {
    return 'Sheet1';
  }
  return stripWrappingQuotes(raw);
};

const toA1Range = (sheetName: string, cells: string) => {
  const escapedSheetName = sheetName.replace(/'/g, "''");
  return `'${escapedSheetName}'!${cells}`;
};

const getServiceAccountFromJsonEnv = (): ServiceAccountCredentials | null => {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw?.trim()) {
    return null;
  }

  const normalized = stripWrappingQuotes(raw);
  try {
    const parsed = JSON.parse(normalized) as Partial<ServiceAccountCredentials>;
    if (parsed.client_email && parsed.private_key) {
      return {
        client_email: parsed.client_email,
        private_key: parsed.private_key,
      };
    }
  } catch {
    // Ignore invalid JSON here and let normal env validation run.
  }

  return null;
};

const createSheetsClient = () => {
  const serviceAccountJson = getServiceAccountFromJsonEnv();
  const clientEmail = serviceAccountJson?.client_email ?? getRequiredEnv('GOOGLE_SERVICE_ACCOUNT_EMAIL');
  const privateKey = serviceAccountJson?.private_key ?? getRequiredEnv('GOOGLE_PRIVATE_KEY');

  if (!privateKey.includes('BEGIN PRIVATE KEY')) {
    throw new Error(
      'Invalid Google private key format. Use the service-account private_key value with escaped newlines (\\n) in .env.',
    );
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: [SHEETS_SCOPE],
  });

  return google.sheets({ version: 'v4', auth });
};

export const addToWaitlist = async ({
  name,
  email,
  phone,
  type,
  social,
  province,
  city,
}: WaitlistEntry) => {
  const sheets = createSheetsClient();
  const spreadsheetId = getRequiredEnv('GOOGLE_SHEETS_SPREADSHEET_ID');
  const sheetName = toSafeSheetName(process.env.GOOGLE_SHEETS_SHEET_NAME);
  const normalizedInputEmail = normalizeEmail(email);

  const existingEmailResponse = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: toA1Range(sheetName, 'C:C'),
  });
  const existingValues = existingEmailResponse.data.values ?? [];
  const existingEmails = existingValues
    .map((row) => row?.[0])
    .filter((value): value is string => typeof value === 'string')
    .map(normalizeEmail);

  if (existingEmails.includes(normalizedInputEmail)) {
    throw new DuplicateWaitlistEmailError(normalizedInputEmail);
  }

  const submittedAt = new Date().toLocaleString('en-ZA', {
    timeZone: 'Africa/Johannesburg',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const row = [
    submittedAt,
    name,
    email,
    phone,
    type,
    social,
    province,
    city,
  ];

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: toA1Range(sheetName, 'A:H'),
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [row],
      },
    });
  } catch (error: any) {
    if (error?.code === 'ERR_OSSL_UNSUPPORTED') {
      throw new Error(
        'Google key decode failed. Re-copy private_key from your service-account JSON and keep newline escapes as \\n in .env.',
      );
    }
    throw error;
  }

  return {
    saved: true,
    email,
  };
};
