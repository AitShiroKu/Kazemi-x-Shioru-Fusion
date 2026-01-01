import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('shuffle')
  .setDescription('Shuffle queue')
  .setDescriptionLocalizations({ th: 'สับเปลี่ยนในคิว' })
  .setDefaultMemberPermissions(null)
  .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel])
  .setIntegrationTypes([
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall,
  ]);

export const permissions = [PermissionFlagsBits.SendMessages];
export const category = 'music';

function hasDjPermission(interaction: ChatInputCommandInteraction, queue: any): boolean {
  const client: any = interaction.client;
  const djs = client?.configs?.djs;
  if (!djs?.enable) return true;

  try {
    if (interaction.user.id !== queue?.songs?.[0]?.user?.id && queue?.autoplay === false) {
      return false;
    }

    if (djs.only) {
      const member: any = interaction.member;
      const memberRoleIds: string[] = member?.roles?.cache?.map?.((r: any) => r.id) ?? [];
      const isDjUser = Array.isArray(djs.users) && djs.users.includes(interaction.user.id);
      const isDjRole =
        Array.isArray(djs.roles) &&
        memberRoleIds.some((roleId) => djs.roles.includes(roleId));

      if (!isDjUser && !isDjRole) return false;
    }

    return true;
  } catch {
    return true;
  }
}

export async function execute(interaction: ChatInputCommandInteraction) {
  const client = interaction.client as any;
  const i18n = client.i18n?.t ?? ((k: string) => k);

  const queue = (client.player as any)?.getQueue?.(interaction);
  if (!queue) {
    await interaction.reply(i18n('commands.shuffle.no_queue'));
    return;
  }

  if (!hasDjPermission(interaction, queue)) {
    await interaction.reply(i18n('commands.shuffle.not_a_dj'));
    return;
  }

  (client.player as any).shuffle(interaction);
  await interaction.reply(i18n('commands.shuffle.now_shuffle'));
}

export default { data, execute, permissions, category };
