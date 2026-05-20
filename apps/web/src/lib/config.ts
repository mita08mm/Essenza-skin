export const config = {

  apiUrl: process.env.NEXT_PUBLIC_API_URL,

  appUrl: process.env.NEXT_PUBLIC_APP_URL,

  environment: process.env.NODE_ENV,
} as const;

export const apiEndpoint = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${config.apiUrl}${cleanPath}`;
};
