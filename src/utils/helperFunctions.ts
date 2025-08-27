
// helpers/getApiErrorStatusCode.ts
export const getApiErrorStatusCode = (
  error: unknown
): number | string | null => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as any).response === "object"
  ) {
    const response = (error as any).response;
    if ("status" in response && typeof response.status === "number") {
      return response.status;
    }
  }

  return null;
};

export function getCurrentDateTime(): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(now.getDate()).padStart(2, "0");

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export const getFullUrl = (config: any) => {
  const baseURL = config.baseURL || "";
  const url = config.url || "";
  return `${baseURL}${url}`;
};

