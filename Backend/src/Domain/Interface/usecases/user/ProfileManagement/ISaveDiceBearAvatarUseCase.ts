export interface ISaveDiceBearAvatarUseCase {
    execute(input: {
      userId: string;
      diceBearUrl: string;
    }): Promise<string>;
  }
  