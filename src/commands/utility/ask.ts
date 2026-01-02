import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    AttachmentBuilder,
    EmbedBuilder,
} from 'discord.js';
import { geminiResponse } from '../../services/ai/gemini.js';

export const data = new SlashCommandBuilder()
    .setName('ask')
    .setDescription('Ask Kazemi Miharu anything!')
    .setDescriptionLocalizations({
        th: 'ถามอะไร Kazemi Miharu ก็ได้เลย!',
    })
    .addStringOption((option) =>
        option
            .setName('question')
            .setDescription('The question you want to ask.')
            .setDescriptionLocalizations({
                th: 'คำถามที่คุณต้องการจะถาม',
            })
            .setRequired(true),
    );

export const category = 'utility';

export async function execute(interaction: ChatInputCommandInteraction) {
    const client = interaction.client as any;
    const question = interaction.options.getString('question', true);

    await interaction.deferReply();

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
        const messageSegments = client.splitMessageWithCodeBlocks?.(response) || [{ text: response }];

        const supportButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel('Support')
                .setEmoji('📝')
                .setStyle(ButtonStyle.Link)
                .setURL(SUPPORT_URL || 'https://example.com'),
            new ButtonBuilder()
                .setLabel('Invite Me')
                .setEmoji('🌸')
                .setStyle(ButtonStyle.Link)
                .setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8`),
        );

        for (let i = 0; i < messageSegments.length; i++) {
            const segment = messageSegments[i];

            const embed = new EmbedBuilder()
                .setColor(0xE91E63) // Premium Pink
                .setDescription(client.formatBotReply?.(segment.text) || segment.text)
                .setTimestamp()
                .setFooter({
                    text: `Asked by ${username} | Gemini AI`,
                    iconURL: interaction.user.displayAvatarURL()
                });

            if (i === 0) {
                embed.setTitle(`💬 Question: ${question.length > 250 ? question.substring(0, 247) + '...' : question}`);
            }

            const replyOptions: any = {
                embeds: [embed],
                components: i === messageSegments.length - 1 ? [supportButton] : [],
            };

            if (segment.attachment) {
                const attachment = new AttachmentBuilder(
                    Buffer.from(segment.attachment.content, 'utf-8'),
                    { name: segment.attachment.name },
                );
                replyOptions.files = [attachment];
            }

            if (i === 0) {
                await interaction.editReply(replyOptions);
            } else {
                await interaction.followUp(replyOptions);
            }
        }
    } catch (error) {
        client.logger.error(error, 'Error in ask command');

        const errorEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setDescription('❌ ขออภัยค่ะ เกิดข้อผิดพลาดในการประมวลผล');

        await interaction.editReply({
            embeds: [errorEmbed],
        });
    }
}
