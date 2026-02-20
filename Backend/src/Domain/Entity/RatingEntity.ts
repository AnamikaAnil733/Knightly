export type TimeControl = "BULLET" | "BLITZ" | "RAPID" |"CLASSICAL";

export class UserRating {

    private _ratings: {
      BULLET: number;
      BLITZ: number;
      RAPID: number;
      CLASSICAL: number;
    };
  
    constructor(ratings?: Partial<Record<
      "BULLET" | "BLITZ" | "RAPID" | "CLASSICAL",
      number
    >>) {
      this._ratings = {
        BULLET: ratings?.BULLET ?? 1200,
        BLITZ: ratings?.BLITZ ?? 1200,
        RAPID: ratings?.RAPID ?? 1200,
        CLASSICAL: ratings?.CLASSICAL ?? 1200
      };
    }
  
    get(type: keyof typeof this._ratings): number {
      return this._ratings[type];
    }
  
    set(type: keyof typeof this._ratings, value: number): void {
      this._ratings[type] = value;
    }
  
    getAll() {
      return { ...this._ratings };
    }
  }
  