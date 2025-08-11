declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_APP_BLOG_SERVICE_URL: string;
    readonly REACT_APP_AUTH_SERVICE_URL: string;
  }
}

declare var process: {
  env: NodeJS.ProcessEnv;
};
