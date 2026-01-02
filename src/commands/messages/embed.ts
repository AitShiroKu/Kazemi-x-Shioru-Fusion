import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ChannelType,
  Colors,
  MessageFlags,
} from 'discord.js';

function addEmbedOptions(subcommand: any, withChannel: boolean): any {
  subcommand
    .addStringOption((option: any) =>
      option
        .setName('content')
        .setDescription('Content of message.')
        .setDescriptionLocalizations({ th: 'เนื้อหาของข้อความ' }),
    )
    .addAttachmentOption((option: any) =>
      option
        .setName('attachment')
        .setDescription(
          'What needs to be attached to the embedded message to be sent.',
        )
        .setDescriptionLocalizations({
          th: 'สิ่งที่ต้องการแนบไปด้วยข้อความแบบฝังที่จะส่ง',
        }),
    )
    .addStringOption((option: any) =>
      option
        .setName('author_name')
        .setDescription('The name of the author of the embedded text.')
        .setDescriptionLocalizations({ th: 'ชื่อของผู้เขียนในข้อความแบบฝัง' }),
    )
    .addStringOption((option: any) =>
      option
        .setName('author_icon_url')
        .setDescription('Author icon in embedded text')
        .setDescriptionLocalizations({ th: 'ไอคอนของผู้เขียนในข้อความแบบฝัง' }),
    )
    .addStringOption((option: any) =>
      option
        .setName('author_url')
        .setDescription('Author links in embedded text')
        .setDescriptionLocalizations({ th: 'ลิงค์ของผู้เขียนในข้อความแบบฝัง' }),
    )
    .addStringOption((option: any) =>
      option
        .setName('color')
        .setDescription('Embedded text border color')
        .setDescriptionLocalizations({ th: 'สีของขอบข้อความแบบฝัง' }),
    )
    .addStringOption((option: any) =>
      option
        .setName('title')
        .setDescription('Topic of embedded message')
        .setDescriptionLocalizations({ th: 'หัวข้อของข้อความแบบฝัง' }),
    )
    .addStringOption((option: any) =>
      option
        .setName('url')
        .setDescription('The link to be attached to the topic of the embedded message.')
        .setDescriptionLocalizations({ th: 'ลิงค์ที่จะแนบไว้กับหัวข้อของข้อความแบบฝัง' }),
    )
    .addStringOption((option: any) =>
      option
        .setName('description')
        .setDescription('Description in embedded text')
        .setDescriptionLocalizations({ th: 'คำอธิบายในข้อความแบบฝัง' }),
    )
    .addStringOption((option: any) =>
      option
        .setName('thumbnail')
        .setDescription('Link to thumbnail in upper right corner in embedded text')
        .setDescriptionLocalizations({
          th: 'ลิงค์ของรูปขนาดเล็กมุมขวาบนในข้อความแบบฝัง',
        }),
    )
    .addStringOption((option: any) =>
      option
        .setName('first_field_name')
        .setDescription('The name of the field in the embedded text.')
        .setDescriptionLocalizations({ th: 'ชื่อของฟิลด์ในข้อความแบบฝัง' }),
    )
    .addStringOption((option: any) =>
      option
        .setName('first_field_value')
        .setDescription('Field values in embedded text')
        .setDescriptionLocalizations({ th: 'ค่าของฟิลด์ในข้อความแบบฝัง' }),
    )
    .addBooleanOption((option: any) =>
      option
        .setName('first_field_inline')
        .setDescription('Organized as a single line in a field of embedded text.')
        .setDescriptionLocalizations({
          th: 'จัดเป็นบรรทัดเดียวในฟิลด์ของข้อความแบบฝัง',
        }),
    )
    .addStringOption((option: any) =>
      option
        .setName('second_field_name')
        .setDescription('The name of the field in the embedded text.')
        .setDescriptionLocalizations({ th: 'ชื่อของฟิลด์ในข้อความแบบฝัง' }),
    )
    .addStringOption((option: any) =>
      option
        .setName('second_field_value')
        .setDescription('Field values in embedded text')
        .setDescriptionLocalizations({ th: 'ค่าของฟิลด์ในข้อความแบบฝัง' }),
    )
    .addBooleanOption((option: any) =>
      option
        .setName('second_field_inline')
        .setDescription('Organized as a single line in a field of embedded text.')
        .setDescriptionLocalizations({
          th: 'จัดเป็นบรรทัดเดียวในฟิลด์ของข้อความแบบฝัง',
        }),
    )
    .addStringOption((option: any) =>
      option
        .setName('image')
        .setDescription('Links to accompanying images in embedded text')
        .setDescriptionLocalizations({ th: 'ลิงค์รูปภาพประกอบในข้อความแบบฝัง' }),
    )
    .addStringOption((option: any) =>
      option
        .setName('timestamp')
        .setDescription(
          'Timestamp on embedded text (We recommend using https://www.epochconverter.com/) e.g. "1701090235"',
        )
        .setDescriptionLocalizations({
          th: 'เวลาประทับบนข้อความแบบฝัง (เราแนะนำให้ใช้ https://www.epochconverter.com/) เช่น "1701090235"',
        }),
    )
    .addStringOption((option: any) =>
      option
        .setName('footer_text')
        .setDescription('Embedded footer text')
        .setDescriptionLocalizations({ th: 'ข้อความส่วนท้ายของข้อความแบบฝัง' }),
    )
    .addStringOption((option: any) =>
      option
        .setName('footer_icon_url')
        .setDescription('Icon link in footer of embedded message')
        .setDescriptionLocalizations({
          th: 'ลิงค์ของไอคอนในส่วนท้ายของข้อความแบบฝัง',
        }),
    );

  if (withChannel) {
    subcommand.addChannelOption((option: any) =>
      option
        .setName('channel')
        .setDescription('channel to send the embedded message')
        .setDescriptionLocalizations({ th: 'ช่องที่จะส่งข้อความแบบฝัง' })
        .setRequired(false)
        .addChannelTypes(ChannelType.GuildText, ChannelType.PrivateThread, ChannelType.PublicThread),
    );
  }

  return subcommand;
}

function buildEmbed(interaction: ChatInputCommandInteraction): EmbedBuilder {
  const inputAuthorName = interaction.options.getString('author_name') ?? '';
  const inputAuthorURL = interaction.options.getString('author_url') ?? '';
  const inputAuthorIconURL = interaction.options.getString('author_icon_url') ?? '';
  const inputColor = interaction.options.getString('color') ?? '';
  const inputTitle = interaction.options.getString('title') ?? '';
  const inputURL = interaction.options.getString('url') ?? '';
  const inputDescription = interaction.options.getString('description') ?? '';
  const inputThumbnail = interaction.options.getString('thumbnail') ?? '';
  const inputFirstFieldName = interaction.options.getString('first_field_name') ?? '';
  const inputFirstFieldValue = interaction.options.getString('first_field_value') ?? '';
  const inputFirstFieldInline = interaction.options.getBoolean('first_field_inline') ?? false;
  const inputSecondFieldName = interaction.options.getString('second_field_name') ?? '';
  const inputSecondFieldValue = interaction.options.getString('second_field_value') ?? '';
  const inputSecondFieldInline = interaction.options.getBoolean('second_field_inline') ?? false;
  const inputImage = interaction.options.getString('image') ?? '';
  const inputTimestamp = interaction.options.getString('timestamp') ?? '';
  const inputFooterText = interaction.options.getString('footer_text') ?? '';
  const inputFooterIconURL = interaction.options.getString('footer_icon_url') ?? '';

  const embed = new EmbedBuilder();

  if (inputTitle) embed.setTitle(inputTitle);
  if (inputURL) embed.setURL(inputURL);
  if (inputDescription) embed.setDescription(inputDescription);
  if (inputThumbnail) embed.setThumbnail(inputThumbnail);
  if (inputImage) embed.setImage(inputImage);
  
  // Discord requires at least one of: title, description, fields, image, or thumbnail
  // If none of these are set, add a default description
  if (!inputTitle && !inputDescription && !inputFirstFieldName && !inputSecondFieldName && !inputImage && !inputThumbnail) {
    embed.setDescription('No content provided');
  }

  if (inputAuthorName || inputAuthorURL || inputAuthorIconURL) {
    embed.setAuthor({
      name: inputAuthorName || interaction.client.user?.username || 'Bot',
      url: inputAuthorURL || undefined,
      iconURL: inputAuthorIconURL || undefined,
    });
  }

  if (inputFooterText || inputFooterIconURL) {
    embed.setFooter({
      text: inputFooterText || ' ',
      iconURL: inputFooterIconURL || undefined,
    });
  }

  if (inputFirstFieldName && inputFirstFieldValue) {
    embed.addFields({
      name: inputFirstFieldName,
      value: inputFirstFieldValue,
      inline: inputFirstFieldInline,
    });
  }

  if (inputSecondFieldName && inputSecondFieldValue) {
    embed.addFields({
      name: inputSecondFieldName,
      value: inputSecondFieldValue,
      inline: inputSecondFieldInline,
    });
  }

  if (inputTimestamp) {
    const asNumber = Number(inputTimestamp);
    if (Number.isFinite(asNumber) && asNumber > 0) {
      const ms = asNumber < 1e12 ? asNumber * 1000 : asNumber;
      embed.setTimestamp(new Date(ms));
    }
  }

  if (inputColor) {
    const hex = inputColor.trim();
    if (/^#?[0-9a-f]{6}$/i.test(hex)) {
      embed.setColor(parseInt(hex.replace('#', ''), 16));
    } else if ((Colors as any)[hex] !== undefined) {
      embed.setColor((Colors as any)[hex]);
    }
  }

  return embed;
}

function hasAnyEmbedOption(interaction: ChatInputCommandInteraction): boolean {
  const keys = [
    'content',
    'attachment',
    'author_name',
    'author_icon_url',
    'author_url',
    'color',
    'title',
    'url',
    'description',
    'thumbnail',
    'first_field_name',
    'first_field_value',
    'first_field_inline',
    'second_field_name',
    'second_field_value',
    'second_field_inline',
    'image',
    'timestamp',
    'footer_text',
    'footer_icon_url',
  ];

  for (const key of keys) {
    const opt: any = interaction.options.get(key as any);
    if (opt && opt.value !== undefined && opt.value !== null && opt.value !== '') return true;
  }

  return false;
}

export const data = new SlashCommandBuilder()
  .setName('embed')
  .setDescription('Create an embedded message')
  .setDescriptionLocalizations({ th: 'สร้างข้อความแบบฝัง' })
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
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
    addEmbedOptions(
      subcommand
        .setName('send')
        .setDescription('Send embedded message')
        .setDescriptionLocalizations({ th: 'ส่งข้อความแบบฝัง' }),
      true,
    ),
  )
  .addSubcommand((subcommand) =>
    addEmbedOptions(
      subcommand
        .setName('reply')
        .setDescription('Reply embedded message')
        .setDescriptionLocalizations({ th: 'ตอบกลับข้อความแบบฝัง' })
        .addStringOption((option) =>
          option
            .setName('id')
            .setDescription('ID of the embedded message you want to rply')
            .setDescriptionLocalizations({
              th: 'ไอดีของข้อความแบบฝังที่ต้องการตอบกลับ',
            })
            .setRequired(true),
        ),
      false,
    ),
  )
  .addSubcommand((subcommand) =>
    addEmbedOptions(
      subcommand
        .setName('edit')
        .setDescription('Edit embedded message')
        .setDescriptionLocalizations({ th: 'แก้ไขข้อความแบบฝัง' })
        .addStringOption((option) =>
          option
            .setName('id')
            .setDescription('ID of the embedded message you want to edit')
            .setDescriptionLocalizations({
              th: 'ไอดีของข้อความแบบฝังที่ต้องการแก้ไข',
            })
            .setRequired(true),
        ),
      false,
    ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('suppress')
      .setDescription('Suppresses or unsuppresses embeds on a message.')
      .setDescriptionLocalizations({ th: 'ระงับหรือยกเลิกการฝังข้อความ' })
      .addStringOption((option) =>
        option
          .setName('id')
          .setDescription(
            'ID of the message for which you want to suppress or unembed the message.',
          )
          .setDescriptionLocalizations({
            th: 'ไอดีของข้อความที่ต้องการระงับหรือยกเลิกการฝังข้อความ',
          })
          .setRequired(true),
      )
      .addBooleanOption((option) =>
        option
          .setName('suppress')
          .setDescription('Want to suppress message embedding?')
          .setDescriptionLocalizations({ th: 'ต้องการระงับการฝังข้อความหรือไม่' })
          .setRequired(true),
      ),
  );

export const permissions = [PermissionFlagsBits.SendMessages];
export const category = 'messages';

export async function execute(interaction: ChatInputCommandInteraction) {
  const subcommand = interaction.options.getSubcommand(true);

  const client = interaction.client as any;
  const i18n = client.i18n?.t ?? ((k: string) => k);

  if (subcommand !== 'suppress' && !hasAnyEmbedOption(interaction)) {
    await interaction.reply({
      content: i18n('commands.embed.no_option_provided'),
      flags: [MessageFlags.Ephemeral],
    });
    return;
  }

  const inputID = interaction.options.getString('id') ?? '';
  const inputContent = interaction.options.getString('content') ?? '';
  const inputAttachment = interaction.options.getAttachment('attachment') ?? null;

  try {
    if (subcommand === 'send') {
      const inputChannel = interaction.options.getChannel('channel') ?? null;
      const channel = (inputChannel ?? interaction.channel) as any;

      await channel.send({
        content: inputContent || undefined,
        embeds: [buildEmbed(interaction)],
        files: inputAttachment ? [inputAttachment] : [],
      });

      await interaction.reply({
        content: inputChannel
          ? i18n('commands.embed.embedded_has_been_sent_to_channel', {
              id: inputChannel.id,
            })
          : i18n('commands.embed.embedded_has_been_sent'),
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    if (subcommand === 'reply') {
      const channel = interaction.channel as any;
      const message = await channel?.messages?.fetch?.(inputID);

      if (!message) {
        await interaction.reply({
          content: i18n('commands.embed.message_not_found'),
          flags: [MessageFlags.Ephemeral],
        });
        return;
      }

      await message.reply({
        content: inputContent || undefined,
        embeds: [buildEmbed(interaction)],
        files: inputAttachment ? [inputAttachment] : [],
      });

      await interaction.reply({
        content: i18n('commands.embed.embedded_has_been_replied'),
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    if (subcommand === 'edit') {
      const channel = interaction.channel as any;
      const message = await channel?.messages?.fetch?.(inputID);

      if (!message) {
        await interaction.reply({
          content: i18n('commands.embed.message_not_found'),
          flags: [MessageFlags.Ephemeral],
        });
        return;
      }

      if (!message.editable) {
        await interaction.reply({
          content: i18n('commands.embed.can_not_edit'),
          flags: [MessageFlags.Ephemeral],
        });
        return;
      }

      await message.edit({
        content: inputContent || undefined,
        embeds: [buildEmbed(interaction)],
        files: inputAttachment ? [inputAttachment] : [],
      });

      await interaction.reply({
        content: i18n('commands.embed.embedded_has_been_edited'),
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    if (subcommand === 'suppress') {
      const inputSuppress = interaction.options.getBoolean('suppress', true);
      const channel = interaction.channel as any;
      const message = await channel?.messages?.fetch?.(inputID);

      if (!message) {
        await interaction.reply({
          content: i18n('commands.embed.message_not_found'),
          flags: [MessageFlags.Ephemeral],
        });
        return;
      }

      if (!message.embeds || message.embeds.length === 0) {
        await interaction.reply({
          content: i18n('commands.embed.is_not_embed'),
          flags: [MessageFlags.Ephemeral],
        });
        return;
      }

      await message.suppressEmbeds(inputSuppress);

      await interaction.reply({
        content: inputSuppress
          ? i18n('commands.embed.suppresses')
          : i18n('commands.embed.unsuppresses'),
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }
  } catch (error) {
    client.logger?.error?.(error);
    await interaction.reply({
      content: i18n('commands.embed.can_not_edit'),
      flags: [MessageFlags.Ephemeral],
    });
  }
}

export default { data, execute, permissions, category };
