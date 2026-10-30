export type ActionState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> }
  | { status: "success"; message: string };

export const idleState: ActionState = { status: "idle" };

export function errorState(message: string, fieldErrors?: Record<string, string>): ActionState {
  return { status: "error", message, fieldErrors };
}

export function successState(message: string): ActionState {
  return { status: "success", message };
}

export function toMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    if (error.message === "UNAUTHORIZED") return "Sesi berakhir, silakan login ulang.";
    return error.message;
  }
  return fallback;
}
