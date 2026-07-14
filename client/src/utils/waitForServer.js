import api from "./api"; // adjust path

export const waitForServer = async () => {
  while (true) {
    try {
      await api.get("/health");
      return;
    } catch {
      console.log("Waiting for server...");
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
};