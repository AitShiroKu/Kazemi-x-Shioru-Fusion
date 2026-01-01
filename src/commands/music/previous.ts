import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('previous')
  .setDescription('Return to the previous song.')
  .setDescriptionLocalizations({ th: 'กลับไปยังเพลงก่อนหน้านี้' })
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
    await interaction.reply(i18n('commands.previous.no_queue'));
    return;
  }

  if (!hasDjPermission(interaction, queue)) {
    await interaction.reply(i18n('commands.previous.not_a_dj'));
    return;
  }

  if (!queue.previousSongs || queue.previousSongs.length === 0) {
    await interaction.reply(i18n('commands.previous.no_previous_song_queue'));
    return;
  }

  (client.player as any).previous(interaction);
  await interaction.reply(i18n('commands.previous.previous'));
}

export default { data, execute, permissions, category };
