/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  namespace google.accounts.id {
    interface CredentialResponse {
      credential: string;
      select_by: string;
    }

    type InitializeFunction = (options: {
      client_id: string;
      callback: (response: CredentialResponse) => void;
    }) => void;

    type RenderButtonFunction = (
      parent: HTMLElement,
      options: {
        theme?: "outline" | "filled_blue" | "filled_black";
        size?: "large" | "medium" | "small";
        width?: number;
        text?: "continue_with" | "sign_in_with";
        shape?: "pill" | "rectangular";
      }
    ) => void;
  }

  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: google.accounts.id.InitializeFunction;
          renderButton: google.accounts.id.RenderButtonFunction;
        };
      };
    };
  }
}

export {};
