import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('timezone')
  .setDescription('Convert time zones as desired.')
  .setDescriptionLocalizations({ th: 'แปลงเขตเวลาตามที่ต้องการ' })
  .setDefaultMemberPermissions(null)
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
      .setName('now')
      .setDescription('Get the current time for the desired time zone.')
      .setDescriptionLocalizations({
        th: 'รับเวลาปัจจุบันตามเขตเวลาที่ต้องการ',
      })
      .addStringOption((option) =>
        option
          .setName('locale')
          .setDescription(
            'The code of the location for which the time zone is to be converted, such as en-US',
          )
          .setDescriptionLocalizations({
            th: 'รหัสของสถานที่ที่ต้องการแปลงเขตเวลา เช่น th-TH',
          })
          .setRequired(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('convert')
      .setDescription('Convert the desired time zone to another time zone.')
      .setDescriptionLocalizations({ th: 'แปลงเขตเวลาที่ต้องการเป็นเขตเวลาอื่น' })
      .addStringOption((option) =>
        option
          .setName('time')
          .setDescription('Time to convert')
          .setDescriptionLocalizations({ th: 'เวลาที่ต้องการแปลง' })
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName('locale')
          .setDescription(
            'The code of the location for which the time zone is to be converted, such as en-US',
          )
          .setDescriptionLocalizations({
            th: 'รหัสของสถานที่ที่ต้องการแปลงเขตเวลา เช่น th-TH',
          })
          .setRequired(true),
      ),
  );

export const permissions = [PermissionFlagsBits.SendMessages];
export const category = 'utility';

export async function execute(interaction: ChatInputCommandInteraction) {
  const subcommand = interaction.options.getSubcommand(true);
  const inputTime = interaction.options.getString('time') ?? '';
  const inputLocale = interaction.options.getString('locale', true);

  const client = interaction.client as any;
  const i18n = client.i18n?.t ?? ((k: string) => k);

  switch (subcommand) {
    case 'now': {
      try {
        const date = new Date().toLocaleString(inputLocale);
        await interaction.reply(
          i18n('commands.timezone.this_timezone', {
            locale: inputLocale,
            time: date,
          }),
        );
      } catch {
        await interaction.reply(i18n('commands.timezone.can_not_convert_timezone'));
      }
      break;
    }
    case 'convert': {
      try {
        const date = new Date(inputTime).toLocaleString(inputLocale);
        await interaction.reply(
          i18n('commands.timezone.time_at_timezone', {
            locale: inputLocale,
            time: date,
          }),
        );
      } catch {
        await interaction.reply(i18n('commands.timezone.can_not_convert_timezone'));
      }
      break;
    }
  }
}

export default { data, execute, permissions, category };
