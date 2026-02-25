export class EloCalculator{

  static calculateNewRating(
    ratingA:number,
    ratingB:number,
    score:0|0.5|1,
  ):{newA:number,newB:number}{
    const expectedA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
    const expectedB = 1 / (1 + Math.pow(10, (ratingA - ratingB) / 400));
    const scoreB = 1 - score;
    const kA = ratingA < 2400 ? 20 : 10;
    const kB = ratingB < 2400 ? 20 : 10;
    const newA = ratingA + kA * (score - expectedA);
    const newB = ratingB + kB * (scoreB - expectedB);
    return {
      newA: Math.round(newA),
      newB: Math.round(newB),
    };

  }

}
