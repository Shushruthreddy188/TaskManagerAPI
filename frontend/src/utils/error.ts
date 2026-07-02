import { isAxiosError } from "axios";

export function extractErrorMessage(err: unknown): string {
  if (isAxiosError(err) && err.response?.data?.message) {
    return err.response.data.message as string;
  }
  return "Something went wrong. Please try again.";
}
