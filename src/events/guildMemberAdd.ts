import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';

export const name = Events.GuildMemberAdd;
export const once = false;

export async function execute(client: any, member: any) {

  const guild = member.guild;

  // Fetch member data
  const memberFetch = await member.user.fetch();
  const memberColor = memberFetch.accentColor;
  const memberTag = member.user.tag;
  const memberAvatar = member.user.displayAvatarURL();

  const guildMemberAddEmbed = new EmbedBuilder()
    .setTitle(memberTag)
    .setDescription(client.i18n.t('events.guildMemberAdd.greet'))
    .setTimestamp()
    .setColor(memberColor)
    .setThumbnail(memberAvatar)
    .setAuthor({
      iconURL:
        'https://emoji-media-us.s3.dualstack.us-west-1.amazonaws.com/120/microsoft/209/video-game_1f3ae.png',
      name: client.i18n.t('events.guildMemberAdd.welcome'),
    });

  client.logger.debug(`GuildMemberAdd event completed for ${member.user.tag}`);
}
