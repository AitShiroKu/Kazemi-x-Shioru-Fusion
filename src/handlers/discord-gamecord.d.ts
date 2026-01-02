/**
 * Type definitions for discord-gamecord
 * This file provides TypeScript types for the discord-gamecord library
 */

declare module 'discord-gamecord' {
  import { ChatInputCommandInteraction, User, Message } from 'discord.js';

  export interface GameOptions {
    message: ChatInputCommandInteraction | Message;
    isSlashGame: boolean;
    embed?: {
      title?: string;
      color?: string;
      description?: string;
      statusTitle?: string;
      overTitle?: string;
      requestTitle?: string;
      requestColor?: string;
      rejectTitle?: string;
      rejectColor?: string;
      findDescription?: string;
    };
    emojis?: Record<string, string> | string[];
    timeoutTime?: number;
    buttonStyle?: string;
    playerOnlyMessage?: string;
    opponent?: User | null;
    mentionUser?: boolean;
    turnMessage?: string;
    winMessage?: string;
    tieMessage?: string;
    loseMessage?: string;
    timeoutMessage?: string;
    errMessage?: string;
    reqTimeoutTime?: number;
    requestMessage?: string;
    rejectMessage?: string;
    reqTimeoutMessage?: string;
    buttons?: Record<string, string>;
    trueButtonStyle?: string;
    falseButtonStyle?: string;
    mode?: string;
    difficulty?: number | string | null;
    theme?: string;
    customWord?: string | null;
    sentence?: string;
    hideEmojiTime?: number;
    fishes?: Record<string, { emoji: string; price: number }>;
    fishyRodPrice?: number;
    catchMessage?: string;
    sellMessage?: string;
    noBalanceMessage?: string;
    invalidTypeMessage?: string;
    invalidAmountMessage?: string;
    noItemMessage?: string;
    mines?: number;
    slots?: string[];
    snake?: Record<string, string>;
    foods?: string[];
    stopButton?: string;
    xButtonStyle?: string;
    oButtonStyle?: string;
    player?: any;
    hangman?: Record<string, string>;
  }

  export interface Game {
    startGame(): void;
    on(event: string, callback: (data: any) => void): void;
    catchFish?(): void;
    sellFish?(type?: string | null, amount?: string | null): void;
    fishyInventory?(): void;
  }

  export class TwoZeroFourEight {
    constructor(options: GameOptions);
    startGame(): void;
  }

  export class Connect4 {
    constructor(options: GameOptions);
    startGame(): void;
  }

  export class FastType {
    constructor(options: GameOptions);
    startGame(): void;
  }

  export class FindEmoji {
    constructor(options: GameOptions);
    startGame(): void;
  }

  export class Fishy {
    constructor(options: GameOptions);
    startGame(): void;
    on(event: string, callback: (data: any) => void): void;
    catchFish(): void;
    sellFish(type?: string | null, amount?: string | null): void;
    fishyInventory(): void;
  }

  export class Flood {
    constructor(options: GameOptions);
    startGame(): void;
  }

  export class GuessThePokemon {
    constructor(options: GameOptions);
    startGame(): void;
  }

  export class Hangman {
    constructor(options: GameOptions);
    startGame(): void;
  }

  export class MatchPairs {
    constructor(options: GameOptions);
    startGame(): void;
  }

  export class Minesweeper {
    constructor(options: GameOptions);
    startGame(): void;
  }

  export class RockPaperScissors {
    constructor(options: GameOptions);
    startGame(): void;
  }

  export class Slots {
    constructor(options: GameOptions);
    startGame(): void;
  }

  export class Snake {
    constructor(options: GameOptions);
    startGame(): void;
  }

  export class TicTacToe {
    constructor(options: GameOptions);
    startGame(): void;
  }

  export class Trivia {
    constructor(options: GameOptions);
    startGame(): void;
  }

  export class Wordle {
    constructor(options: GameOptions);
    startGame(): void;
  }

  export class WouldYouRather {
    constructor(options: GameOptions);
    startGame(): void;
  }
}
