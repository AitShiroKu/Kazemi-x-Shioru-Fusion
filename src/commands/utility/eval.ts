import {
  SlashCommandBuilder,
  EmbedBuilder,
  Colors,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';
import { Script } from 'node:vm';

export const data = new SlashCommandBuilder()
  .setName('eval')
  .setDescription('Evaluate the Javascript code for testing.')
  .setDescriptionLocalizations({
    th: 'ประเมินรหัส JavaScript สำหรับทดสอบผลการทำงาน',
  })
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
  .addStringOption((option) =>
    option
      .setName('script')
      .setDescription('The Javascript code to be evaluated.')
      .setRequired(true),
  );

export const permissions = [PermissionFlagsBits.SendMessages];
export const category = 'utility';

export async function execute(interaction: ChatInputCommandInteraction) {
  const inputScript = interaction.options.getString('script', true);

  const client = interaction.client as any;
  const i18n = client.i18n?.t ?? ((k: string) => k);

  const resultEmbed = new EmbedBuilder().setTitle(i18n('commands.eval.result'));

  try {
    const script = new Script(inputScript);
    const result = script.runInNewContext();

    resultEmbed
      .setDescription(`\`\`\`JavaScript\n${String(result)}\n\`\`\``)
      .setColor(Colors.Green);
  } catch (error: any) {
    resultEmbed
      .setDescription(`\`\`\`JavaScript\n${String(error)}\n\`\`\``)
      .setColor(Colors.Red);
  }

  await interaction.reply({ embeds: [resultEmbed] });
}

export default { data, execute, permissions, category };
