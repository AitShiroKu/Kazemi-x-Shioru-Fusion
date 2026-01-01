import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('leave')
  .setDescription('Exits the current audio channel.')
  .setDescriptionLocalizations({ th: 'ออกจากช่องสัญญาณเสียงปัจจุบัน' })
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

  const meChannel = (interaction.guild as any)?.members?.me?.voice?.channel;

  if (queue && !hasDjPermission(interaction, queue)) {
    await interaction.reply(i18n('commands.leave.not_a_dj'));
    return;
  }

  if (!meChannel) {
    await interaction.reply(i18n('commands.leave.not_in_any_channel'));
    return;
  }

  const connection = (client.player as any)?.voices?.get?.(meChannel.guild);

  if (!connection || typeof connection.leave !== 'function') {
    await interaction.reply(i18n('commands.leave.not_in_any_channel'));
    return;
  }

  try {
    // distube voice connections commonly accept guild
    await connection.leave(meChannel.guild);
  } catch {
    try {
      await connection.leave();
    } catch {
      // ignore
    }
  }

  await interaction.reply(i18n('commands.leave.now_leave'));
}

export default { data, execute, permissions, category };
