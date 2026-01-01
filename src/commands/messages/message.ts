import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('message')
  .setDescription('Let bot print instead')
  .setDescriptionLocalizations({ th: 'ปล่อยให้บอทพิมพ์แทน' })
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
      .setName('send')
      .setDescription('Send message.')
      .setDescriptionLocalizations({ th: 'ส่งข้อความ' })
      .addStringOption((option) =>
        option
          .setName('content')
          .setDescription('The message you want to send.')
          .setDescriptionLocalizations({ th: 'ข้อความที่คุณต้องการ' })
          .setRequired(true),
      )
      .addAttachmentOption((option) =>
        option
          .setName('attachment')
          .setDescription('Things to be attached to message to be sent.')
          .setDescriptionLocalizations({
            th: 'สิ่งที่ต้องการแนบไปด้วยข้อความที่จะส่ง',
          })
          .setRequired(false),
      )
      .addChannelOption((option) =>
        option
          .setName('channel')
          .setDescription('The channel to send message to')
          .setDescriptionLocalizations({ th: 'ช่องที่จะส่งข้อความ' })
          .setRequired(false),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('reply')
      .setDescription('Reply message.')
      .setDescriptionLocalizations({ th: 'ส่งข้อความ' })
      .addStringOption((option) =>
        option
          .setName('id')
          .setDescription('ID of message you want to reply')
          .setDescriptionLocalizations({ th: 'ไอดีของข้อความที่ต้องการตอบกลับ' })
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName('content')
          .setDescription('The message you want to send.')
          .setDescriptionLocalizations({ th: 'ข้อความที่คุณต้องการ' })
          .setRequired(true),
      )
      .addAttachmentOption((option) =>
        option
          .setName('attachment')
          .setDescription('Things to be attached to message to be sent.')
          .setDescriptionLocalizations({
            th: 'สิ่งที่ต้องการแนบไปด้วยข้อความที่จะส่ง',
          })
          .setRequired(false),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('edit')
      .setDescription('Edit desired text.')
      .setDescriptionLocalizations({ th: 'แก้ไข้อความ' })
      .addStringOption((option) =>
        option
          .setName('id')
          .setDescription('ID of message you want to edit')
          .setDescriptionLocalizations({ th: 'ไอดีของข้อความที่ต้องการแก้ไข' })
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName('content')
          .setDescription('The text you want to change')
          .setDescriptionLocalizations({ th: 'ข้อความที่คุณต้องการเปลี่ยนแปลง' })
          .setRequired(true),
      )
      .addAttachmentOption((option) =>
        option
          .setName('attachment')
          .setDescription('Things to be attached to message to be sent.')
          .setDescriptionLocalizations({
            th: 'สิ่งที่ต้องการแนบไปด้วยข้อความที่จะส่ง',
          })
          .setRequired(false),
      ),
  );

export const permissions = [PermissionFlagsBits.SendMessages];
export const category = 'messages';

export async function execute(interaction: ChatInputCommandInteraction) {
  const subcommand = interaction.options.getSubcommand();
  const inputID = interaction.options.getString('id');
  const inputContent = interaction.options.getString('content') ?? '';
  const inputAttachment = interaction.options.getAttachment('attachment') ?? null;
  const inputChannel = interaction.options.getChannel('channel') ?? null;

  const client = interaction.client as any;
  const i18n = client.i18n.t;

  switch (subcommand) {
    case 'send':
      if (!inputChannel) {
        await (interaction.channel as any).send({
          content: inputContent,
          files: inputAttachment ? [inputAttachment] : [],
        });
      } else {
        await (inputChannel as any).send({
          content: inputContent,
          files: inputAttachment ? [inputAttachment] : [],
        });
      }

      await interaction.reply({
        content: inputChannel
          ? i18n('commands.message.sended_to_channel')
          : i18n('commands.message.sended'),
        ephemeral: true,
      });
      break;

    case 'reply':
      try {
        const message = await (interaction.channel as any).messages.fetch(inputID);

        if (!message)
          return await interaction.reply({
            content: i18n('commands.message.message_not_found'),
            ephemeral: true,
          });

        await message.reply({
          content: inputContent,
          files: inputAttachment ? [inputAttachment] : [],
        });
      } catch (error: any) {
        await interaction.reply({
          content: `Error: ${error.message}`,
          ephemeral: true,
        });
      }
      break;

    case 'edit':
      try {
        const message = await (interaction.channel as any).messages.fetch(inputID);

        if (!message)
          return await interaction.reply({
            content: i18n('commands.message.message_not_found'),
            ephemeral: true,
          });
        if (!message.editable)
          return await interaction.reply({
            content: i18n('commands.message.can_not_edit'),
            ephemeral: true,
          });

        await message.edit({
          content: inputContent,
          files: inputAttachment ? [inputAttachment] : [],
        });
      } catch (error: any) {
        await interaction.reply({
          content: `Error: ${error.message}`,
          ephemeral: true,
        });
      }
      break;
  }
}
