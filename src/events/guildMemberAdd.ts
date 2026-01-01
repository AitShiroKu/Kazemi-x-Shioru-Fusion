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

  // Initialize guild data
  const guildRef = client.database.ref(`guilds/${guild.id}`);
  const guildSnapshot = await guildRef.get();

  if (!guildSnapshot.exists()) {
    await guildRef.set({
      joinedAt: guild.joinedAt?.toISOString() ?? new Date(guild.createdAt).toISOString(),
      createdAt: new Date(guild.createdAt).toISOString(),
      description: guild.description ?? '',
      iconURL: guild.iconURL() ?? '',
      preferredLocale: guild.preferredLocale ?? 'en-US',
      memberCount: guild.memberCount ?? 0,
      name: guild.name ?? '',
      verified: guild.verified ?? false,
      language: {
        type: 'AUTO',
        locale: 'en-US',
      },
      notify: {
        message: { enable: true },
        join: { enable: true },
        leave: { enable: true },
        ban: { enable: true },
        kick: { enable: false },
        member: { enable: true },
        role: { enable: true },
      },
      djs: {
        enable: true,
        roles: [],
        users: [],
      },
      level: {
        enable: true,
        multiplier: 1,
        xp: 15,
      },
      afk: {},
      automod: {
        enable: false,
        antiBot: {
          enable: false,
          all: false,
          bots: [],
        },
        antiSpam: {
          enable: false,
          limit: 5,
          muteTime: 30000,
        },
        antiLink: {
          enable: false,
          muteTime: 30000,
        },
        antiMassMention: {
          enable: false,
          limit: 10,
          muteTime: 30000,
        },
      },
    });

    client.logger.info(`Initialized data for guild ${guild.name} (${guild.id})`);
  }

  // Send join notification
  await (client as any).submitNotification(guild, Events.GuildMemberAdd, guildMemberAddEmbed);

  // Anti-Bot system
  if (member.user.bot) {
    const guildData = guildSnapshot.val();
    if (guildData?.automod) {
      const antiBotData = guildData.automod.antiBot;

      if (!antiBotData) return;
      if (!antiBotData.enable) return;
      if (!antiBotData.all && antiBotData.bots.includes(member.user.id))
        return;

      await member.kick({
        reason: 'Was prevented from joining guild by anti-bot system.',
      });
    }
  }

  client.logger.debug(`GuildMemberAdd event completed for ${member.user.tag}`);
}
