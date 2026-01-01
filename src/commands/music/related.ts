import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('related')
  .setDescription('Songs related to the currently playing song')
  .setDescriptionLocalizations({ th: 'เพลงที่เกี่ยวข้องกับเพลงที่เล่นอยู่' })
  .setDefaultMemberPermissions(null)
  .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel])
  .setIntegrationTypes([
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall,
  ])
  .addSubcommand((option) =>
    option
      .setName('add')
      .setDescription('Add related songs to the queue.')
      .setDescriptionLocalizations({ th: 'เพิ่มเพลงที่เกี่ยวข้องลงในคิว.' }),
  );

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
    await interaction.reply(i18n('commands.related.no_queue'));
    return;
  }

  if (!hasDjPermission(interaction, queue)) {
    await interaction.reply(i18n('commands.related.not_a_dj'));
    return;
  }

  try {
    let relatedSong: any;

    if (typeof (client.player as any).addRelatedSong === 'function') {
      relatedSong = await (client.player as any).addRelatedSong(interaction.guild);
    } else if (typeof queue.addRelatedSong === 'function') {
      relatedSong = await queue.addRelatedSong();
    }

    if (!relatedSong) {
      await interaction.reply(i18n('commands.related.no_queue'));
      return;
    }

    await interaction.reply(
      i18n('commands.related.added_related_song', {
        name: relatedSong.name,
        duration: relatedSong.formattedDuration,
      }),
    );
  } catch (error) {
    client.logger?.error?.(error);
    await interaction.reply(i18n('commands.related.no_queue'));
  }
}

export default { data, execute, permissions, category };
