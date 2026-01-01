import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    AttachmentBuilder,
} from 'discord.js';
import type { Command } from '../../types/index.js';

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
        const response = await client.geminiResponse(
            question,
            userId,
            username,
            client.userConversations,
            client.saveMemory,
        );

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
            const replyOptions: any = {
                content: client.formatBotReply?.(segment.text) || segment.text,
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
        await interaction.editReply({
            content: client.formatBotReply?.('❌ ขออภัยค่ะ เกิดข้อผิดพลาดในการประมวลผล') || '❌ ขออภัยค่ะ เกิดข้อผิดพลาดในการประมวลผล',
        });
    }
}
