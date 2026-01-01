import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
  Colors,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('filter')
  .setDescription('Add more powerful filters to your music.')
  .setDescriptionLocalizations({
    th: 'ใส่ฟิลเตอร์ในเพลงของคุณให้มีพลังมากขึ้น',
  })
  .setDefaultMemberPermissions(null)
  .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel])
  .setIntegrationTypes([
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall,
  ])
  .addSubcommand((subcommand) =>
    subcommand
      .setName('add')
      .setDescription('Add a filter to the queue.')
      .setDescriptionLocalizations({ th: 'เพิ่มฟิลเตอร์เข้าไปในคิว' })
      .addStringOption((option) =>
        option
          .setName('filter')
          .setDescription('The filters you want to use.')
          .setDescriptionLocalizations({
            th: 'รูปแบบเสียงที่คุณต้องการใช้ คุณสามารถระบุเพิ่มเติมได้โดยใช้ "," สำหรับรุปแบบหลายรายการ',
          })
          .setRequired(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('remove')
      .setDescription('Remove the filter in the queue.')
      .setDescriptionLocalizations({ th: 'ลบฟิลเตอร์ในคิว' })
      .addStringOption((option) =>
        option
          .setName('filter')
          .setDescription('The filters you want to use.')
          .setDescriptionLocalizations({
            th: 'รูปแบบเสียงที่คุณต้องการใช้ คุณสามารถระบุเพิ่มเติมได้โดยใช้ "," สำหรับรุปแบบหลายรายการ',
          })
          .setRequired(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('set')
      .setDescription('Set all new queue filters.')
      .setDescriptionLocalizations({ th: 'ตั้งค่าฟิลเตอร์ในคิวใหม่ทั้งหมด' })
      .addStringOption((option) =>
        option
          .setName('filter')
          .setDescription('The filters you want to use.')
          .setDescriptionLocalizations({
            th: 'รูปแบบเสียงที่คุณต้องการใช้ คุณสามารถระบุเพิ่มเติมได้โดยใช้ "," สำหรับรุปแบบหลายรายการ',
          })
          .setRequired(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('list')
      .setDescription('See all supported filters.')
      .setDescriptionLocalizations({ th: 'ดูฟิลเตอร์ทั้งหมดที่รองรับ' }),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('now')
      .setDescription('View filters that are currently queued.')
      .setDescriptionLocalizations({ th: 'ดูฟิลเตอร์ที่อยู่คิวตอนนี้' }),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('clear')
      .setDescription('Remove all filters in the queue.')
      .setDescriptionLocalizations({ th: 'ลบฟิลเตอร์ทั้งหมดในคิว' }),
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
  const subcommand = interaction.options.getSubcommand(true);
  const inputFilters = interaction.options.getString('filter') ?? '';

  const client = interaction.client as any;
  const i18n = client.i18n?.t ?? ((k: string) => k);

  const queue = (client.player as any)?.getQueue?.(interaction);

  const filterString = inputFilters
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  const filterList = Object.keys((client.player as any)?.filters ?? {});

  const filterEmbed = {
    content: i18n('commands.filter.sound_filtering'),
    embeds: [
      new EmbedBuilder()
        .setTitle(i18n('commands.filter.available_filter'))
        .setDescription(
          String(i18n('commands.filter.available_filter_description'))
            .replace('%s1', String(filterList.length))
            .replace('%s2', filterList.join(', ')),
        )
        .setColor(Colors.Blue),
    ],
  };

  const checkFilters = (filters: string[]) => {
    const valid: string[] = [];
    const invalid: string[] = [];

    for (const filter of filters) {
      if (filterList.includes(filter)) valid.push(filter);
      else invalid.push(filter);
    }

    return { valid, invalid };
  };

  if (!queue) {
    await interaction.reply(i18n('commands.filter.no_queue'));
    return;
  }

  if (!hasDjPermission(interaction, queue)) {
    await interaction.reply(i18n('commands.filter.not_a_dj'));
    return;
  }

  switch (subcommand) {
    case 'add': {
      if (!filterString.length) {
        await interaction.reply(filterEmbed);
        return;
      }

      const checked = checkFilters(filterString);
      if (checked.invalid.length > 0) {
        await interaction.reply(
          String(i18n('commands.filter.unknown_filter')).replace(
            '%s',
            checked.invalid.join(', '),
          ),
        );
        return;
      }

      await queue.filters.add(filterString);
      await interaction.reply(
        String(i18n('commands.filter.add_filter')).replace(
          '%s',
          filterString.join(', '),
        ),
      );
      return;
    }

    case 'remove': {
      if (!filterString.length) {
        await interaction.reply(filterEmbed);
        return;
      }

      const checked = checkFilters(filterString);
      if (checked.invalid.length > 0) {
        await interaction.reply(
          String(i18n('commands.filter.unknown_filter')).replace(
            '%s',
            checked.invalid.join(', '),
          ),
        );
        return;
      }

      await queue.filters.remove(filterString);
      await interaction.reply(
        String(i18n('commands.filter.remove_filter')).replace(
          '%s',
          filterString.join(', '),
        ),
      );
      return;
    }

    case 'set': {
      if (!filterString.length) {
        await interaction.reply(filterEmbed);
        return;
      }

      const checked = checkFilters(filterString);
      if (checked.invalid.length > 0) {
        await interaction.reply(
          String(i18n('commands.filter.unknown_filter')).replace(
            '%s',
            checked.invalid.join(', '),
          ),
        );
        return;
      }

      await queue.filters.set(filterString);
      await interaction.reply(
        String(i18n('commands.filter.set_filter')).replace(
          '%s',
          filterString.join(', '),
        ),
      );
      return;
    }

    case 'list': {
      const availableEmbed = new EmbedBuilder()
        .setTitle(i18n('commands.filter.available_filter'))
        .setDescription(
          String(i18n('commands.filter.available_filter_description'))
            .replace('%s1', String(filterList.length))
            .replace('%s2', filterList.join(', ')),
        )
        .setColor(Colors.Green);

      await interaction.reply({
        content: i18n('commands.filter.sound_filtering'),
        embeds: [availableEmbed],
      });
      return;
    }

    case 'now': {
      const filtersName = queue.filters?.names?.join?.(', ') ?? '';
      const filtersSize = queue.filters?.names?.length ?? 0;
      const listEmbed = new EmbedBuilder()
        .setTitle(i18n('commands.filter.list_filter_title'))
        .setDescription(
          filtersSize
            ? String(i18n('commands.filter.list_filter_description'))
                .replace('%s1', String(filtersSize))
                .replace('%s2', filtersName)
            : i18n('commands.filter.list_filter_description_empty'),
        )
        .setColor(Colors.Blue);

      await interaction.reply({ embeds: [listEmbed] });
      return;
    }

    case 'clear': {
      await queue.filters.clear();
      await interaction.reply(i18n('commands.filter.clear_filter'));
      return;
    }

    default: {
      await interaction.reply(i18n('commands.filter.unknown_input_option'));
      return;
    }
  }
}

export default { data, execute, permissions, category };
