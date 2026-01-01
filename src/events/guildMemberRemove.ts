import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';
import type { Event } from '../types/index.js';

export const name = Events.GuildMemberRemove;
export const once = false;

export async function execute(client: any, member: any) {
  if (member.user.bot) return;

  const guild = member.guild;

  // Fetch member data
  const memberFetch = await member.user.fetch();
  const memberColor = memberFetch.accentColor;
  const memberTag = member.user.tag;
  const memberAvatar = member.user.displayAvatarURL();

  const guildMemberRemoveEmbed = new EmbedBuilder()
    .setTitle(memberTag)
    .setDescription(
      client.i18n.t('events.guildMemberRemove.user_has_exited'),
    )
    .setTimestamp()
    .setColor(memberColor)
    .setThumbnail(memberAvatar)
    .setAuthor({
      iconURL:
        'https://emoji-media-us.s3.dualstack.us-west-1.amazonaws.com/120/microsoft/209/video-game_1f3ae.png',
      name: client.i18n.t('events.guildMemberRemove.goodbye'),
    });

  // Initialize guild data
  await (client as any).initializeData(guild);

  // Send leave notification
  await (client as any).submitNotification(guild, Events.GuildMemberRemove, guildMemberRemoveEmbed);

  client.logger.debug(`GuildMemberRemove event completed for ${member.user.tag}`);
}
