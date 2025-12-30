import { OAuth2Client } from "google-auth-library";
import { GoogleUserPayload } from "../../Domain/Types/GoogleUserPayload";


export class GoogleAuthService {
  private client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client(process.env.GOOGLE_AUTH_CLIENT_ID);
  }

  async verifyIdToken(idToken: string): Promise<GoogleUserPayload> {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_AUTH_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error("Invalid Google token");
    }

    return {
      email: payload.email!,
      name: payload.name!,
      sub: payload.sub!, // Google's unique user ID
    };
  }
}
