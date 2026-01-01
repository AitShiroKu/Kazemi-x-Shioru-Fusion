import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  Collection,
  ChannelType,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';
import type { Command } from '../../types/index.js';

function containsURL(text: string): boolean {
  return /(https?:\/\/|www\.)\S+/i.test(text);
}

export const data = new SlashCommandBuilder()
  .setName('purge')
  .setDescription('Delete a lot of messages')
  .setDescriptionLocalizations({ th: 'ลบข้อความจำนวนมาก' })
  .setDefaultMemberPermissions(
    PermissionFlagsBits.ReadMessageHistory | PermissionFlagsBits.ManageMessages,
  )
  .setContexts([
    InteractionContextType.BotDM,
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel,
  ])
  .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
  .addSubcommand((subcommand) =>
    subcommand
      .setName('all')
      .setDescription('Delete all messages according to the number.')
      .setDescriptionLocalizations({ th: 'ลบข้อความทั้งหมดตามจำนวน' })
      .addIntegerOption((option) =>
        option
          .setName('amount')
          .setDescription('The amount of messages to delete')
          .setDescriptionLocalizations({ th: 'จำนวนข้อความที่จะลบ' })
          .setRequired(true)
          .setMinValue(1)
          .setMaxValue(100),
      )
      .addChannelOption((option) =>
        option
          .setName('channel')
          .setDescription('Channel in which you want to delete the messages.')
          .setDescriptionLocalizations({ th: 'ช่องที่ต้องการลบข้อความ' })
          .addChannelTypes(ChannelType.GuildText),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('attachment')
      .setDescription('Delete all messages with attachments.')
      .setDescriptionLocalizations({ th: 'ลบข้อความทั้งหมดที่มีไฟล์แนบ' })
      .addIntegerOption((option) =>
        option
          .setName('amount')
          .setDescription('The amount of messages to delete')
          .setDescriptionLocalizations({ th: 'จำนวนข้อความที่จะลบ' })
          .setRequired(true)
          .setMinValue(1)
          .setMaxValue(100),
      )
      .addChannelOption((option) =>
        option
          .setName('channel')
          .setDescription('Channel in which you want to delete the messages.')
          .setDescriptionLocalizations({ th: 'ช่องที่ต้องการลบข้อความ' })
          .addChannelTypes(ChannelType.GuildText),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('me')
      .setDescription('Delete all messages from me.')
      .setDescriptionLocalizations({ th: 'ลบข้อความทั้งหมดที่มาจากฉัน' })
      .addIntegerOption((option) =>
        option
          .setName('amount')
          .setDescription('The amount of messages to delete')
          .setDescriptionLocalizations({ th: 'จำนวนข้อความที่จะลบ' })
          .setRequired(true)
          .setMinValue(1)
          .setMaxValue(100),
      )
      .addChannelOption((option) =>
        option
          .setName('channel')
          .setDescription('Channel in which you want to delete the messages.')
          .setDescriptionLocalizations({ th: 'ช่องที่ต้องการลบข้อความ' })
          .addChannelTypes(ChannelType.GuildText),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('bots')
      .setDescription('Delete all messages from bots.')
      .setDescriptionLocalizations({ th: 'ลบข้อความที่มาจากบอททั้งหมด' })
      .addIntegerOption((option) =>
        option
          .setName('amount')
          .setDescription('The amount of messages to delete')
          .setDescriptionLocalizations({ th: 'จำนวนข้อความที่จะลบ' })
          .setRequired(true)
          .setMinValue(1)
          .setMaxValue(100),
      )
      .addChannelOption((option) =>
        option
          .setName('channel')
          .setDescription('Channel in which you want to delete the messages.')
          .setDescriptionLocalizations({ th: 'ช่องที่ต้องการลบข้อความ' })
          .addChannelTypes(ChannelType.GuildText),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('link')
      .setDescription('Delete all messages that contain links.')
      .setDescriptionLocalizations({ th: 'ลบข้อความทั้งหมดที่มีลิงค์' })
      .addIntegerOption((option) =>
        option
          .setName('amount')
          .setDescription('The amount of messages to delete')
          .setDescriptionLocalizations({ th: 'จำนวนข้อความที่จะลบ' })
          .setRequired(true)
          .setMinValue(1)
          .setMaxValue(100),
      )
      .addChannelOption((option) =>
        option
          .setName('channel')
          .setDescription('Channel in which you want to delete the messages.')
          .setDescriptionLocalizations({ th: 'ช่องที่ต้องการลบข้อความ' })
          .addChannelTypes(ChannelType.GuildText),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('text')
      .setDescription('Delete all messages related to the given message.')
      .setDescriptionLocalizations({
        th: 'ลบข้อความทั้งหมดที่เกี่ยวข้องกับข้อความที่ให้',
      })
      .addStringOption((option) =>
        option
          .setName('text')
          .setDescription('Messages to be detected and removed')
          .setDescriptionLocalizations({
            th: 'ข้อความที่ต้องการตรวจหาและลบออก',
          })
          .setRequired(true),
      )
      .addIntegerOption((option) =>
        option
          .setName('amount')
          .setDescription('The amount of messages to delete')
          .setDescriptionLocalizations({ th: 'จำนวนข้อความที่จะลบ' })
          .setRequired(true)
          .setMinValue(1)
          .setMaxValue(100),
      )
      .addChannelOption((option) =>
        option
          .setName('channel')
          .setDescription('Channel in which you want to delete the messages.')
          .setDescriptionLocalizations({ th: 'ช่องที่ต้องการลบข้อความ' })
          .addChannelTypes(ChannelType.GuildText),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('user')
      .setDescription('Delete all messages from the user.')
      .setDescriptionLocalizations({ th: 'ลบข้อความทั้งหมดที่มาจากผู้ใช้' })
      .addUserOption((option) =>
        option
          .setName('user')
          .setDescription('Messages to be detected and removed')
          .setDescriptionLocalizations({
            th: 'ข้อความที่ต้องการตรวจหาและลบออก',
          })
          .setRequired(true),
      )
      .addIntegerOption((option) =>
        option
          .setName('amount')
          .setDescription('The amount of messages to delete')
          .setDescriptionLocalizations({ th: 'จำนวนข้อความที่จะลบ' })
          .setRequired(true)
          .setMinValue(1)
          .setMaxValue(100),
      )
      .addChannelOption((option) =>
        option
          .setName('channel')
          .setDescription('Channel in which you want to delete the messages.')
          .setDescriptionLocalizations({ th: 'ช่องที่ต้องการลบข้อความ' })
          .addChannelTypes(ChannelType.GuildText),
      ),
  );

export const permissions = [
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.ReadMessageHistory,
  PermissionFlagsBits.ManageMessages,
];
export const category = 'messages';

export async function execute(interaction: ChatInputCommandInteraction) {
  const subcommand = interaction.options.getSubcommand(true);
  const inputAmount = interaction.options.getInteger('amount', true);
  const inputChannel = interaction.options.getChannel('channel');
  const inputText = interaction.options.getString('text') ?? '';
  const inputUser = interaction.options.getUser('user');

  const client = interaction.client as any;
  const i18n = client.i18n?.t ?? ((k: string) => k);

  const deleteMessages = new Collection<string, any>();
  const channel = (inputChannel ?? interaction.channel) as any;

  try {
    if (!channel?.messages?.fetch || !channel?.bulkDelete) {
      await interaction.reply({
        content: i18n('commands.purge.messages_not_found'),
        ephemeral: true,
      });
      return;
    }

    const previousMessages = await channel.messages.fetch({
      limit: inputAmount,
      cache: false,
    });

    for (const previousMessage of previousMessages.values()) {
      if (deleteMessages.size >= inputAmount) break;
      if (!previousMessage.deletable) continue;
      if (previousMessage.createdTimestamp < Date.now() - 1209600000) continue;

      switch (subcommand) {
        case 'all':
          deleteMessages.set(previousMessage.id, previousMessage);
          break;
        case 'attachment':
          if (previousMessage.attachments?.size)
            deleteMessages.set(previousMessage.id, previousMessage);
          break;
        case 'me':
          if (previousMessage.author?.id === interaction.client.user?.id)
            deleteMessages.set(previousMessage.id, previousMessage);
          break;
        case 'bots':
          if (
            previousMessage.author?.bot &&
            previousMessage.author?.id !== interaction.client.user?.id
          )
            deleteMessages.set(previousMessage.id, previousMessage);
          break;
        case 'link':
          if (containsURL(previousMessage.content))
            deleteMessages.set(previousMessage.id, previousMessage);
          break;
        case 'text':
          if (previousMessage.content?.includes(inputText))
            deleteMessages.set(previousMessage.id, previousMessage);
          break;
        case 'user':
          if (inputUser && previousMessage.author?.id === inputUser.id)
            deleteMessages.set(previousMessage.id, previousMessage);
          break;
      }
    }
  } catch (error) {
    (client as any).logger?.error?.(error);
  }

  if (!deleteMessages.size) {
    await interaction.reply(i18n('commands.purge.messages_not_found'));
    return;
  }

  if (
    deleteMessages.size === 1 &&
    deleteMessages.first()?.author?.id === interaction.user.id
  ) {
    await deleteMessages.first()?.delete?.();
    await interaction.reply(i18n('commands.purge.messages_no_contains'));
    return;
  }

  await channel.bulkDelete(deleteMessages, true);
  await interaction.reply(
    i18n('commands.purge.messages_cleared', {
      size: deleteMessages.size,
    }),
  );
}

export default { data, execute, permissions, category };
