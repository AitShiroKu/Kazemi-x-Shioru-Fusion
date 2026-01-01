import {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
} from 'discord.js';
import { YouTubePlugin, SearchResultType } from '@distube/youtube';
import { SoundCloudPlugin, SearchType } from '@distube/soundcloud';

export const data = new SlashCommandBuilder()
  .setName('playlist')
  .setDescription('Create or add a playlist of songs.')
  .setDescriptionLocalizations({ th: 'สร้างหรือเพิ่มเพลย์ลิสต์ของเพลง' })
  .setDefaultMemberPermissions(PermissionFlagsBits.Connect)
  .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel])
  .setIntegrationTypes([
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall,
  ])
  .addStringOption((option) =>
    option
      .setName('links')
      .setDescription('The playlist links you want, separated by "," for each one.')
      .setDescriptionLocalizations({
        th: 'ลิงค์ของเพลย์ลิสต์ที่คุณต้องการคั่นด้วย "," สำหรับแต่ละรายการ',
      })
      .setAutocomplete(true)
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName('name')
      .setDescription('Set the name of the playlist.')
      .setDescriptionLocalizations({ th: 'ตั้งชื่อของเพลย์ลิสต์' }),
  )
  .addBooleanOption((option) =>
    option
      .setName('skip')
      .setDescription(
        'Immediately skip the currently playing song (if it exists) and play the added song.',
      )
      .setDescriptionLocalizations({
        th: 'ข้ามเพลงที่เล่นอยู่ทันที (หากมีอยู่) และเล่นเพลงที่เพิ่มมา',
      }),
  )
  .addIntegerOption((option) =>
    option
      .setName('position')
      .setDescription(
        'The position of the playlist to be inserted or added, starting from zero.',
      )
      .setDescriptionLocalizations({
        th: 'ตำแหน่งของเพลย์ลิสต์ที่ต้องการแทรกหรือเพิ่มโดยเริ่มต้นนับจากศูนย์',
      }),
  )
  .addChannelOption((option) =>
    option
      .setName('channel')
      .setDescription('The channel that wants her to play music.')
      .setDescriptionLocalizations({ th: 'ช่องที่ต้องการให้เธอเล่นเพลง' })
      .addChannelTypes(ChannelType.GuildVoice, ChannelType.GuildStageVoice),
  );

export const permissions = [
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.Connect,
  PermissionFlagsBits.Speak,
];
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

export async function autocomplete(interaction: AutocompleteInteraction) {
  const focusedValue = interaction.options.getFocused();
  if (!focusedValue) return interaction.respond([]);

  try {
    const youtubePlugin = new YouTubePlugin();
    const soundCloudPlugin = new SoundCloudPlugin();

    const [youtubeResults, soundCloudResults] = await Promise.all([
      youtubePlugin.search(focusedValue, {
        type: SearchResultType.PLAYLIST,
        limit: 10,
        safeSearch: true,
      }) as any,
      soundCloudPlugin.search(focusedValue, SearchType.Playlist as any, 10) as any,
    ]);

    const sc = Array.isArray(soundCloudResults) ? soundCloudResults : [];
    const yt = Array.isArray(youtubeResults) ? youtubeResults : [];

    const soundCloudNames = new Set(sc.map((r: any) => String(r.name).toLowerCase()));
    const combined = [...sc, ...yt.filter((r: any) => !soundCloudNames.has(String(r.name).toLowerCase()))];

    if (!combined.length) return interaction.respond([]);

    await interaction.respond(
      combined.slice(0, 25).map((choice: any) => {
        const name: string = String(choice.name ?? 'Unknown');
        const url: string = String(choice.url ?? '');
        const safeName = name.length > 100 ? name.slice(0, 97) + '...' : name;
        const value = url.length > 100 ? safeName : url;
        return { name: safeName, value };
      }),
    );
  } catch {
    await interaction.respond([]);
  }
}

export async function execute(interaction: ChatInputCommandInteraction) {
  const inputLinks = interaction.options.getString('links', true);
  const inputName =
    interaction.options.getString('name') ??
    (interaction.client as any).i18n?.t?.('commands.playlist.playlist_of_user', {
      id: interaction.user.id,
    }) ??
    `playlist-${interaction.user.id}`;

  const inputSkip = interaction.options.getBoolean('skip') ?? false;
  const inputPosition = interaction.options.getInteger('position') ?? 0;
  const inputChannel = interaction.options.getChannel('channel') ?? null;

  const client = interaction.client as any;
  const i18n = client.i18n?.t ?? ((k: string) => k);

  const queue = (client.player as any)?.getQueue?.(interaction);
  const voiceChannel = (interaction.member as any)?.voice?.channel ?? null;
  const meChannel = (interaction.guild as any)?.members?.me?.voice?.channel ?? null;

  const filteredLinks = inputLinks
    .split(',')
    .map((song) => song.trim())
    .filter(Boolean);

  if (queue && !hasDjPermission(interaction, queue)) {
    await interaction.reply(i18n('commands.playlist.not_a_dj'));
    return;
  }

  if (!queue && (inputSkip || inputPosition)) {
    await interaction.reply(i18n('commands.playlist.no_queue'));
    return;
  }

  if (!inputChannel && !voiceChannel && !meChannel) {
    await interaction.reply(i18n('commands.playlist.not_in_channel'));
    return;
  }

  if (!filteredLinks.length) {
    await interaction.reply(i18n('commands.playlist.need_for_link'));
    return;
  }

  await interaction.deferReply();

  try {
    const playlist = await (client.player as any).createCustomPlaylist(filteredLinks, {
      member: interaction.member,
      name: inputName,
      parallel: true,
    });

    await (client.player as any).play(
      voiceChannel || inputChannel || meChannel,
      playlist,
      {
        member: interaction.member,
        message: false,
        skip: inputSkip,
        position: inputPosition,
        textChannel: interaction.channel,
      },
    );

    await interaction.deleteReply();
  } catch (error: any) {
    if (error?.code === 'VOICE_CONNECT_FAILED') {
      await interaction.editReply(i18n('commands.playlist.can_not_connect'));
      return;
    }
    if (error?.code === 'NON_NSFW') {
      await interaction.editReply(i18n('commands.playlist.can_not_play_in_non_nsfw'));
      return;
    }
    if (error?.code === 'NO_VALID_SONG') {
      await interaction.editReply(i18n('commands.playlist.no_valid_song'));
      return;
    }
    if (error?.code === 'EMPTY_PLAYLIST') {
      await interaction.editReply(i18n('commands.playlist.empty_playlist'));
      return;
    }

    if (!queue && meChannel) {
      try {
        const connection = (client.player as any).voices.get(meChannel);
        connection.leave();
      } catch {
        // ignore
      }
    }

    client.logger?.error?.(error);
    await interaction.editReply(i18n('commands.playlist.no_valid_song'));
  }
}

export default { data, execute, permissions, category, autocomplete };
