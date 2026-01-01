import {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
  PermissionFlagsBits,
  Colors,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('minecraft')
  .setDescription('Check server or skin status in Minecraft.')
  .setDescriptionLocalizations({
    th: 'ตรวจสอบสถานะเซิร์ฟเวอร์หรือสินใน Minecraft',
  })
  .setContexts([
    InteractionContextType.BotDM,
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel,
  ])
  .setIntegrationTypes([
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall,
  ])
  .addSubcommand((subcommand) =>
    subcommand
      .setName('status')
      .setDescription('Explore Minecraft Server Info')
      .setDescriptionLocalizations({ th: 'สำรวจข้อมูลซิร์ฟเวอร์หรือสิน' })
      .addStringOption((option) =>
        option
          .setName('ip')
          .setDescription('IP address of Minecraft server')
          .setDescriptionLocalizations({
            th: 'ที่อยู่ IP ของเซิร์ฟเวอร์ Minecraft',
          })
          .setRequired(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('skin')
      .setDescription("Get player's skin.")
      .setDescriptionLocalizations({ th: 'รับข้อมูลผู้เล่อนของผู้เล่น' })
      .addStringOption((option) =>
        option
          .setName('name')
          .setDescription("Player's name")
          .setDescriptionLocalizations({
            th: 'ชื่อของผู้เล่น',
          })
          .setRequired(true),
      ),
  );

export const permissions = [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks];
export const category = 'information';

export async function execute(interaction: ChatInputCommandInteraction) {
  const subcommand = interaction.options.getSubcommand();
  const inputIP = interaction.options.getString('ip') ?? '';
  const inputName = interaction.options.getString('name') ?? '';

  await interaction.deferReply();

  const clientUsername = (interaction.client as any).user?.username;
  const clientAvatarURL = (interaction.client as any).user?.avatarURL();

  switch (subcommand) {
    case 'status': {
      if (!inputIP)
        return await interaction.editReply(
          (interaction.client as any).i18n.t('commands.minecraft.invalid_ip'),
        );

      const response = await fetch(
        `https://api.mcsrvstat.us/2/${inputIP.toLowerCase()}`,
      );

      if (response.status !== 200)
        return await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(Colors.Red)
              .setTitle(
                (interaction.client as any).i18n.t('commands.minecraft.server_unavailable'),
              )
              .setThumbnail(
                'https://em-content.zobj.net/thumbs/120/microsoft/319/free-oclock_1f552.png',
              )
              .setDescription(
                (interaction.client as any).i18n.t('commands.minecraft.server_unavailable'),
              ),
          ],
        });

      const data = await response.json();

      if (!data.online)
        return await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(Colors.Red)
              .setTitle(
                (interaction.client as any).i18n.t('commands.minecraft.server_offline'),
              )
              .setThumbnail(
                'https://em-content.zobj.net/thumbs/120/microsoft/319/free-oclock_1f552.png',
              )
              .setDescription(
                (interaction.client as any).i18n.t('commands.minecraft.server_offline'),
              ),
          ],
        });

      const host = data.hostname;
      const ip = data.ip;
      const icon = data.icon
        ? new AttachmentBuilder(
            Buffer.from(data.icon.split(',')[1], 'base64'),
            { name: 'icon.png' },
          )
        : '';
      const port = data.port.toString();
      const version = data.version
        ? (interaction.client as any).i18n.t('commands.minecraft.do_not_have')
        : (interaction.client as any).i18n.t('commands.minecraft.unknown');
      const maxPlayers = data.players.max?.toString() || '0';
      const onlinePlayers = data.players.online?.toString() || '0';
      const motd = data.motd?.clean?.join('\n') || '';

      const statusEmbed = new EmbedBuilder()
        .setColor(Colors.Green)
        .setAuthor({ name: clientUsername, iconURL: clientAvatarURL })
        .setDescription(
          (interaction.client as any).i18n.t('commands.minecraft.server_available') +
            `\`\`\`${host}:${port}\`\``,
        )
        .setThumbnail('https://em-content.zobj.net/thumbs/120/microsoft/319/free-oclock_1f552.png')
        .setTimestamp()
        .setFooter({
          text: (interaction.client as any).i18n.t('commands.minecraft.last_check'),
          iconURL: 'https://em-content.zobj.net/thumbs/120/microsoft/319/free-oclock_1f552.png',
        })
        .addFields([
          {
            name: (interaction.client as any).i18n.t('commands.minecraft.address'),
            value: host,
            inline: true,
          },
          {
            name: (interaction.client as any).i18n.t('commands.minecraft.ip'),
            value: ip,
            inline: true,
          },
          {
            name: (interaction.client as any).i18n.t('commands.minecraft.port'),
            value: port,
            inline: true,
          },
          {
            name: (interaction.client as any).i18n.t('commands.minecraft.version'),
            value: version,
            inline: true,
          },
          {
            name: (interaction.client as any).i18n.t('commands.minecraft.maximum_player_count'),
            value: maxPlayers,
            inline: true,
          },
          {
            name: (interaction.client as any).i18n.t('commands.minecraft.player_in_server'),
            value: onlinePlayers,
            inline: true,
          },
          {
            name: ( interaction.client as any).i18n.t('commands.minecraft.motd'),
            value: motd || (interaction.client as any).i18n.t('commands.minecraft.not_set'),
            inline: false,
          },
        ]);

      await interaction.editReply({
        embeds: [statusEmbed],
        files: icon ? [icon] : [],
      });
      break;
    }
    case 'skin': {
      if (!inputName)
        return await interaction.editReply(
          (interaction.client as any).i18n.t('commands.minecraft.invalid_name'),
        );

      const skinEmbed = new EmbedBuilder()
        .setColor(Colors.Green)
        .setAuthor({ name: clientUsername, iconURL: clientAvatarURL })
        .setTitle((interaction.client as any).i18n.t('commands.minecraft.skin_of'))
        .setImage(`https://minotar.net/armor/body/${inputName}/700.png`)
        .setTimestamp();

      await interaction.editReply({
        embeds: [skinEmbed],
        files: [
          new AttachmentBuilder(
            `https://minotar.net/armor/body/${inputName}/700.png`,
            { name: 'skin.png' },
          ),
        ],
      });
      break;
    }
  }

  return;
}
