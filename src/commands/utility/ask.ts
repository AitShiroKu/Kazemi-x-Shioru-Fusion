import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  AttachmentBuilder,
  EmbedBuilder,
} from "discord.js";
import { geminiResponse } from "../../services/ai/gemini.js";
import { debug } from "../../services/logger/logger.js";
import logger from "../../services/logger/logger.js";

export const data = new SlashCommandBuilder()
  .setName("ask")
  .setDescription("Ask Kazemi Miharu anything!")
  .setDescriptionLocalizations({
    th: "ถามอะไร Kazemi Miharu ก็ได้เลย!",
  })
  .addStringOption((option) =>
    option
      .setName("question")
      .setDescription("The question you want to ask.")
      .setDescriptionLocalizations({
        th: "คำถามที่คุณต้องการจะถาม",
      })
      .setRequired(true),
  );

export const category = "utility";

export async function execute(interaction: ChatInputCommandInteraction) {
  const client = interaction.client as any;
  const question = interaction.options.getString("question", true);

  try {
    await interaction.deferReply();
  } catch (error: any) {
    logger.error({ error }, "Error deferring reply");
    if (error.code === 10062) {
      return await interaction.reply({
        content: "❌ Interaction หมดอายุ กรุณาลองใหม่",
        ephemeral: true,
      });
    }
    return;
  }

  const userId = interaction.user.id;
  const username = interaction.user.globalName || interaction.user.username;
  const SUPPORT_URL = process.env.SUPPORT_URL;

  try {
    const response = await geminiResponse(
      question,
      userId,
      username,
      client.userConversations,
      client.saveMemory,
    );

    // Limit the response if it's too long for an embed (max 4096 characters for description)
    // splitMessageWithCodeBlocks already handles splitting, so we can use it.
    const messageSegments = client.splitMessageWithCodeBlocks?.(response) || [
      { text: response },
    ];

    const supportButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel("Support")
        .setEmoji("📝")
        .setStyle(ButtonStyle.Link)
        .setURL(SUPPORT_URL || "https://example.com"),
      new ButtonBuilder()
        .setLabel("Invite Me")
        .setEmoji("🌸")
        .setStyle(ButtonStyle.Link)
        .setURL(
          `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8`,
        ),
    );

    for (let i = 0; i < messageSegments.length; i++) {
      const segment = messageSegments[i];

      const embed = new EmbedBuilder()
        .setColor(0xe91e63) // Premium Pink
        .setDescription(client.formatBotReply?.(segment.text) || segment.text)
        .setTimestamp()
        .setFooter({
          text: `Asked by ${username} | Kazemi Miharu AI Beta Build v1.0.0`,
          iconURL: interaction.user.displayAvatarURL(),
        });

      if (i === 0) {
        // Debug logging to diagnose the issue
        const prefix = "💬 Question: ";
        const suffix = "...";
        const maxTitleLength = 256;
        const maxQuestionLength =
          maxTitleLength - prefix.length - suffix.length;

        debug(
          "ASK Command processing",
          {
            originalLength: question.length,
            prefixLength: prefix.length,
            suffixLength: suffix.length,
            maxAllowed: maxQuestionLength,
            isTruncated: question.length > 250,
          },
          "ask-command",
        );

        let finalQuestion;
        if (question.length > maxQuestionLength) {
          finalQuestion = question.substring(0, maxQuestionLength) + suffix;
          debug(
            "Question truncated",
            {
              originalLength: question.length,
              newLength: finalQuestion.length,
            },
            "ask-command",
          );
        } else {
          finalQuestion = question;
          debug(
            "Question not truncated",
            { length: finalQuestion.length },
            "ask-command",
          );
        }

        const finalTitle = prefix + finalQuestion;
        debug(
          "Final title created",
          { titleLength: finalTitle.length, title: finalTitle },
          "ask-command",
        );

        embed.setTitle(finalTitle);
      }

      const replyOptions: any = {
        embeds: [embed],
        components: i === messageSegments.length - 1 ? [supportButton] : [],
      };

      if (segment.attachment) {
        const attachment = new AttachmentBuilder(
          Buffer.from(segment.attachment.content, "utf-8"),
          { name: segment.attachment.name },
        );
        replyOptions.files = [attachment];
      }

      if (i === 0) {
        try {
          await interaction.editReply(replyOptions);
        } catch (error: any) {
          if (error.code === 10062) {
            return await interaction.followUp({
              content: "❌ Interaction หมดอายุ คำตอบจะไม่สมบูรณ์",
              ephemeral: true,
            });
          }
          throw error;
        }
      } else {
        try {
          await interaction.followUp(replyOptions);
        } catch (error: any) {
          if (error.code === 10062) {
            return await interaction.followUp({
              content: "❌ Interaction หมดอายุ คำตอบจะไม่สมบูรณ์",
              ephemeral: true,
            });
          }
          throw error;
        }
      }
    }
  } catch (error) {
    client.logger.error(error, "Error in ask command");

    const errorEmbed = new EmbedBuilder()
      .setColor(0xff0000)
      .setDescription("❌ ขออภัยค่ะ เกิดข้อผิดพลาดในการประมวลผล");

    try {
      await interaction.editReply({
        embeds: [errorEmbed],
      });
    } catch (replyError: any) {
      if (replyError.code === 10062) {
        return await interaction.followUp({
          content: "❌ Interaction หมดอายุ ไม่สามารถแสดงข้อผิดพลาดได้",
          ephemeral: true,
        });
      }
      throw replyError;
    }
  }
}
