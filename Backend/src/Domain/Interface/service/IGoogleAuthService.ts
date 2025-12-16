import { GoogleUserPayload } from "../../Types/GoogleUserPayload";

export interface IGoogleAuthService {
  verifyIdToken(token: string): Promise<GoogleUserPayload>;
}
