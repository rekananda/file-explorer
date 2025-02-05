import { ApiReturn } from "@core";
import { ZodError, ZodSchema } from "zod";

export function validateWithErrorKey<T>(schema: ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      throw {
        status: 400,
        message: "Validation error",
        error: error.errors.map((err) => ({
          [err.path[0]]: err.message,
        }))
      };
    }

    throw {
      status: 500,
      message: "Unexpected error during validation",
    };
  }
}

export function ApiReturnWrapper(data: any, message?: string, status: number = 200): ApiReturn {
  return {
    data,
    status,
    message: message || "Success"
  }
}