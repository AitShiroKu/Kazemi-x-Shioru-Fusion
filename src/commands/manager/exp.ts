import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('exp')
  .setDescription('Manage experience within server.')
  .setDescriptionLocalizations({
    th: 'จัดการค่าประสบการณ์ภายในเซิร์ฟเวอร์ของคุณ',
  })
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
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
      .setName('set')
      .setDescription("Set members' experience.")
      .setDescriptionLocalizations({
        th: 'ตั้งค่าประสบการณ์ของสมาชิก',
      })
      .addUserOption((option) =>
        option
          .setName('member')
          .setDescription(
            "The name of member who wants to set experience value.",
          )
          .setDescriptionLocalizations({
            th: 'ชื่อของสมาชิกที่ต้องการกำหนดค่าประสบการณ์ของสมาชิก',
          })
          .setRequired(true),
      )
      .addIntegerOption((option) =>
        option
          .setName('amount')
          .setDescription('The amount of experience that you want to set.')
          .setDescriptionLocalizations({
            th: 'จำนวนค่าประสบการณ์ที่คุณต้องการตั้งค่า',
          })
          .setRequired(true)
          .setMinValue(0),
      ),
  );

export const permissions = [PermissionFlagsBits.SendMessages];
export const category = 'manager';

export async function execute(interaction: ChatInputCommandInteraction) {
  const subcommand = interaction.options.getSubcommand();

  const client = interaction.client as any;
  const i18n = client.i18n.t;

  if (!interaction.guild) {
    return await interaction.reply(i18n('commands.exp.guild_only'));
  }

  switch (subcommand) {
    case 'set':
      await interaction.reply({
        content: i18n('commands.exp.not_implemented'),
        ephemeral: true,
      });
      break;
  }

  return;
}
