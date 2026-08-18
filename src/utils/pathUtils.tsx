export function PathUtils_BuildBackEndServerUrl(p_UrlPath: string): string {
  // Ensure the sub-path always starts with a leading slash if missing
  const cleanPath = p_UrlPath.startsWith("/") ? p_UrlPath : `/${p_UrlPath}`;

  // import.meta.env.PROD is automatically true when running 'vite build'
  if (import.meta.env.PROD) {
    const prodUrl = import.meta.env.VITE_API_RENDER_URL || "";
    return `${prodUrl}${cleanPath}`;
  } else {
    const localUrl = import.meta.env.VITE_API_LOCAL_URL || "http://localhost:8080";
    return `${localUrl}${cleanPath}`;
  }
}
