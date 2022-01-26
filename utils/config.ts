import { config as dotenvConfig } from "dotenv";
dotenvConfig();

interface IConfig {
  kovan: {
    provider_url: string;
    private_key: string;
  };
  mainnet: {
    provider_url: string;
    private_key: string;
  };
}

export const getEnv = (key: string, defaultValue?: any) => {
  const value = process.env[key];
  if (!value) {
    if (defaultValue === undefined || defaultValue === null) {
      throw new Error(`Required env var ${key} not set`);
    } else {
      return defaultValue;
    }
  }
  if (value.toLocaleLowerCase() === "false") {
    return false;
  }
  if (value.toLocaleLowerCase() === "true") {
    return true;
  }
  return value;
};

export const envconfig: IConfig = {
  kovan: {
    provider_url: getEnv("KOVAN_PROVIDER_URL", ""),
    private_key: getEnv("KOVAN_PRIVATE_KEY", ""),
  },
  mainnet: {
    provider_url: getEnv("MAINNET_PROVIDER_URL", ""),
    private_key: getEnv("MAINNET_PRIVATE_KEY", ""),
  },
};
