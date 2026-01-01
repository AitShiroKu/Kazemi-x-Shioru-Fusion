import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Colors,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Get help using it.')
  .setDescriptionLocalizations({
    th: 'รับความช่วยเหลือเกี่ยวกับการใช้งาน',
  })
  .setContexts([
    InteractionContextType.BotDM,
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel,
  ])
  .setIntegrationTypes([
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall,
  ]);

export const permissions = [PermissionFlagsBits.SendMessages];
export const category = 'me';

export async function execute(interaction: ChatInputCommandInteraction) {
  const client = interaction.client as any;
  const i18n = client.i18n.t;

  const clientUsername = interaction.client.user.username;
  const clientAvatar = interaction.client.user.displayAvatarURL();

  const helpEmbed = new EmbedBuilder()
    .setColor(Colors.Blue)
    .setAuthor({ iconURL: clientAvatar, name: clientUsername })
    .setTitle(i18n('commands.help.ask_for_help'))
    .setDescription(i18n('commands.help.greeting_message'))
    .addFields(
      {
        name: '🎮 Fun',
        value: `\`/8ball\` - เกมทำนาย 8ball\n\`/dice\` - ทอยลูกเต๋า\n\`/coinflip\` - โยนเหรียญ\n\`/rps\` - เป่ายิ้งฉุบ`,
        inline: false,
      },
      {
        name: 'ℹ️ Information',
        value: `\`/ping\` - ตรวจสอบความเร็วในการตอบสนองของบอท\n\`/user\` - แสดงข้อมูลผู้ใช้\n\`/guild\` - แสดงข้อมูลเซิร์ฟเวอร์\n\`/anime\` - ค้นหาข้อมูลอนิเมะ\n\`/minecraft\` - ตรวจสอบข้อมูล Minecraft\n\`/weather\` - ตรวจสอบสภาพอากาศ\n\`/osu\` - ดูข้อมูลผู้เล่น osu!\n\`/status\` - ตรวจสอบสถานะบอท\n\`/covid\` - ข้อมูลสถานการณ์ COVID-19\n\`/leveling\` - ข้อมูลระบบเลเวล`,
        inline: false,
      },
      {
        name: '🎵 Music',
        value: `\`/play\` - เล่นเพลง\n\`/pause\` - หยุดเพลงชั่วคราว\n\`/resume\` - เล่นเพลงต่อ\n\`/skip\` - ข้ามเพลง\n\`/stop\` - หยุดเล่นเพลง\n\`/queue\` - แสดงคิวเพลง\n\`/volume\` - ปรับระดับเสียง\n\`/repeat\` - เปิด/ปิดการวนซ้ำ\n\`/shuffle\` - สลับลำดับเพลง\n\`/join\` - เข้าห้องเสียง\n\`/leave\` - ออกจากห้องเสียง\n\`/playlist\` - จัดการเพลย์ลิสต์\n\`/autoplay\` - เปิด/ปิดการเล่นอัตโนมัติ\n\`/jump\` - ข้ามไปเพลงที่ต้องการ\n\`/seek\` - กรอไปยังช่วงเวลาในเพลง`,
        inline: false,
      },
      {
        name: '⚙️ Manager',
        value: `\`/afk\` - ตั้งค่าสถานะ AFK\n\`/timeout\` - ปิดกั้นผู้ใช้ชั่วคราว\n\`/warn\` - เตือนผู้ใช้\n\`/level\` - ตรวจสอบเลเวล\n\`/exp\` - ตรวจสอบประสบการณ์\n\`/emoji\` - จัดการอีโมจิ\n\`/invite\` - สร้างลิงก์เชิญ\n\`/captcha\` - ตั้งค่าระบบยืนยันตัวตน\n\`/automod\` - ตั้งค่าระบบควบคุมอัตโนมัติ\n\`/ban\` - แบนผู้ใช้\n\`/kick\` - เตะผู้ใช้ออก\n\`/mute\` - ปิดเสียงผู้ใช้`,
        inline: false,
      },
      {
        name: '🛠️ Utility',
        value: `\`/ask\` - ถามคำถามกับ Kuniko (ใช้ Gemini AI)\n\`/translate\` - แปลภาษา\n\`/timezone\` - ตรวจสอบเวลาตามเขตเวลา\n\`/encoder\` - เข้ารหัส/ถอดรหัสข้อความ\n\`/enlarge\` - ขยายอีโมจิ\n\`/qrcode\` - สร้าง QR Code\n\`/paste\` - สร้างลิงก์ paste\n\`/eval\` - รันโค้ด (สำหรับ Developer)\n\`/calculate\` - เครื่องคิดเลข\n\`/reminder\` - ตั้งเวลาแจ้งเตือน\n\`/poll\` - สร้างโพล`,
        inline: false,
      },
      {
        name: '⚡ Settings',
        value: `\`/language\` - เปลี่ยนภาษา\n\`/djs\` - ตั้งค่า Discord.js\n\`/notify\` - ตั้งค่าการแจ้งเตือน\n\`/resetmemory\` - รีเซ็ตความจำการสนทนา\n\`/prefix\` - เปลี่ยน prefix\n\`/welcome\` - ตั้งค่าข้อความต้อนรับ`,
        inline: false,
      },
      {
        name: '👤 Profile',
        value: `\`/help\` - แสดงรายการคำสั่งทั้งหมด\n\`/about\` - เกี่ยวกับบอท\n\`/donate\` - สนับสนุนบอท\n\`/issues\` - รายงานปัญหา\n\`/changelog\` - ดูประวัติการอัพเดท`,
        inline: false,
      }
    )
    .setFooter({
      text: `${i18n('commands.help.footer_text') || 'คำสั่งทั้งหมด'} | ${interaction.guild?.name || 'DM'}`,
      iconURL: interaction.guild?.iconURL() || undefined
    })
    .setTimestamp();

  await interaction.reply({ embeds: [helpEmbed], ephemeral: false });
}