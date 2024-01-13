interface InstanceConfig {
  baseUrl: string;
  headers?: HeadersInit;
}

class CustomFetcher {
  private config: InstanceConfig;
  private headers: HeadersInit = { "Content-Type": "application/json" };

  constructor(config: InstanceConfig) {
    this.config = { ...config };
    this.headers = { ...this.headers, ...config.headers };
  }

  // Factory method for creating new instance
  public static create = (config: InstanceConfig) => new CustomFetcher(config);

  // Adding request manager
  public request = async (url: string, config: RequestInit, payload?: any) => {
    const headers = new Headers({ ...this.headers, ...config.headers });

    // Get authorization data from localStorage
    const auth = localStorage.getItem("auth");
    if (auth) {
      const { token } = JSON.parse(auth);
      headers.append("Authorization", `Bearer ${token}`);
    }

    // Sending fetch request to server
    const response = await fetch(this.config.baseUrl + url, {
      ...this.config,
      ...config,
      headers,
      body: payload ? JSON.stringify(payload) : undefined,
    });

    let data;
    try {
      data = await response.json();
    } catch (error) {
      data = response.body;
    }

    if (!response.ok) {
      throw { response, data };
    }

    return data;
  };

  public get = (url: string) => {
    return this.request(url, { method: "GET" });
  };

  public post = (url: string, payload?: any) => {
    return this.request(url, { method: "POST" }, payload);
  };
}

const fetcher = CustomFetcher.create({
  baseUrl: import.meta.env.VITE_BACKEND_URL,
});

export default fetcher;
