// types/google-auth-library.d.ts
declare module 'google-auth-library' {
    export class OAuth2Client {
      constructor(
        clientId: string,
        clientSecret: string,
        redirectUri: string
      );
  
      verifyIdToken(options: {
        idToken: string;
        audience: string;
      }): Promise<any>;
    }
}