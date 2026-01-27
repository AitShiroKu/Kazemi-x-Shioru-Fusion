/**
 * DisTube Music Player Service
 * Kazemi x Shioru Fusion
 */

import { DisTube, type DisTubeEvents } from "distube";
import { DeezerPlugin } from "@distube/deezer";
import { YouTubePlugin } from "@distube/youtube";
import { SpotifyPlugin } from "@distube/spotify";
import { SoundCloudPlugin } from "@distube/soundcloud";
import { YtDlpPlugin } from "@distube/yt-dlp";
import type { Client } from "discord.js";
import type { BotConfig } from "../handlers/types.js";
import { debug } from "../logger/logger.js";
import logger from "../logger/logger.js";

let player: DisTube | null = null;

/**
 * Initialize DisTube Music Player
 */
export function initializeMusicPlayer(
  client: Client,
  config: BotConfig,
): DisTube {
  if (player) {
    debug("DisTube Music Player already initialized", {}, "music");
    return player;
  }

  const options = {
    plugins: [
      new DeezerPlugin(),
      new YouTubePlugin(),
      new SpotifyPlugin(),
      new SoundCloudPlugin(),
      new YtDlpPlugin({ update: false }),
    ] as any,
    customFilters: Array.isArray(config.filters)
      ? (Object.fromEntries(
          config.filters.map((filter) => [filter, filter]),
        ) as any)
      : ((config.filters || {}) as any),
  } as any;

  player = new DisTube(client, options);

  // Set the maximum number of listeners for the player to avoid memory leaks
  player.setMaxListeners(2);

  debug("DisTube Music Player initialized successfully", {}, "music");
  return player;
}

/**
 * Get music player instance
 */
export function getPlayer(): DisTube {
  if (!player) {
    throw new Error(
      "Music player not initialized. Call initializeMusicPlayer first.",
    );
  }
  return player;
}

/**
 * Check if voice channel is empty
 */
export function isVoiceChannelEmpty(voiceState: any): boolean {
  if (!voiceState.channel) return false;
  const voiceChannel = voiceState.channel;
  if (!voiceChannel) return false;
  return voiceChannel.members.size === 1; // Only bot is in the channel
}

/**
 * Get voice channel members count
 */
export function getVoiceChannelMembersCount(voiceState: any): number {
  if (!voiceState.channel) return 0;
  const voiceChannel = voiceState.channel;
  if (!voiceChannel) return 0;
  return voiceChannel.members.size;
}

export default {
  initializeMusicPlayer,
  getPlayer,
  isVoiceChannelEmpty,
  getVoiceChannelMembersCount,
};
