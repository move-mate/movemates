const STATIC_ALLOWED_ORIGINS = new Set([
  "https://movemates.co.za",
  "https://www.movemates.co.za",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

function getAllowedOrigins(): Set<string> {
  const allowedOrigins = new Set(STATIC_ALLOWED_ORIGINS);
  const fromEnv = process.env.CORS_ALLOWED_ORIGINS;

  if (!fromEnv) {
    return allowedOrigins;
  }

  for (const origin of fromEnv.split(",")) {
    const trimmed = origin.trim().replace(/\/$/, "");
    if (trimmed) {
      allowedOrigins.add(trimmed);
    }
  }

  return allowedOrigins;
}

export function corsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get("origin")?.replace(/\/$/, "");
  const allowedOrigins = getAllowedOrigins();

  const headers: HeadersInit = {
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };

  if (!origin || !allowedOrigins.has(origin)) {
    return headers;
  }

  return {
    ...headers,
    "Access-Control-Allow-Origin": origin,
  };
}
