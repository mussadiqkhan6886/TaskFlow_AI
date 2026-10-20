export const getServerApiBaseUrl = () => {
  const env = process.env
  return env["INTERNAL_API_URL"] || env["NEXT_PUBLIC_BASE_URL"]
}
