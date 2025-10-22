export const retry = async <T>(
    fn: () => Promise<T | null>,
    attempts = 5,
    delay = 300
  ): Promise<T | null> => {
    for (let i = 0; i < attempts; i++) {
      const result = await fn();
      if (result) return result;
      await new Promise((r) => setTimeout(r, delay));
    }
    return null;
};