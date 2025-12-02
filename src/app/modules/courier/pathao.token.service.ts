// Fallback token storage (memory + Redis)
let memoryTokens = { access: null as string | null, refresh: null as string | null, expiry: 0 };

export const saveTokens = async (accessToken: string, refreshToken: string, expiresIn: number) => {
  memoryTokens = {
    access: accessToken,
    refresh: refreshToken,
    expiry: Date.now() + (expiresIn - 60) * 1000
  };
  
  try {
    const { redisClient } = await import('../../config/redis.config');
    await redisClient.setEx('pathao:access_token', expiresIn - 60, accessToken);
    await redisClient.set('pathao:refresh_token', refreshToken);
  } catch (error) {
    // Redis unavailable, using memory storage
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  if (Date.now() > memoryTokens.expiry) {
    memoryTokens.access = null;
  }
  return memoryTokens.access;
};

export const getRefreshToken = async (): Promise<string | null> => {
  return memoryTokens.refresh;
};

export const clearTokens = async () => {
  memoryTokens = { access: null, refresh: null, expiry: 0 };
};