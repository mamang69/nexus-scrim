interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

interface DiscordEmbed {
  title: string;
  description?: string;
  url?: string;
  color?: number; // decimal color code
  fields?: DiscordEmbedField[];
  footer?: { text: string; icon_url?: string };
  timestamp?: string;
}

export async function sendDiscordWebhook({
  content,
  embeds,
}: {
  content?: string;
  embeds?: DiscordEmbed[];
}): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl || !webhookUrl.startsWith("http")) {
    return false;
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Nexus Scrim Bot",
        avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=nexus",
        content,
        embeds,
      }),
    });

    return res.ok;
  } catch (err) {
    console.error("Failed to send Discord webhook:", err);
    return false;
  }
}

export async function notifyNewScrim({
  title,
  game,
  format,
  startTimeWIB,
  scrimUrl,
}: {
  title: string;
  game: string;
  format: string;
  startTimeWIB: string;
  scrimUrl: string;
}) {
  return sendDiscordWebhook({
    embeds: [
      {
        title: `🔥 SCRIM BARU DIBUKA: ${title}`,
        url: scrimUrl,
        description: `Jadwal scrim e-sports terbaru telah dipublikasikan. Segera daftarkan tim Anda sebelum slot penuh!`,
        color: 0x00f2fe, // Neon cyan
        fields: [
          { name: "🎮 Game", value: game, inline: true },
          { name: "⚔️ Format", value: format, inline: true },
          { name: "⏰ Jadwal (WIB)", value: startTimeWIB, inline: true },
        ],
        footer: { text: "NexusScrim Matchmaking Platform" },
        timestamp: new Date().toISOString(),
      },
    ],
  });
}

export async function notifyRegistrationStatus({
  teamName,
  scrimTitle,
  status,
  scrimUrl,
}: {
  teamName: string;
  scrimTitle: string;
  status: "APPROVED" | "REJECTED";
  scrimUrl: string;
}) {
  const isApproved = status === "APPROVED";
  return sendDiscordWebhook({
    embeds: [
      {
        title: isApproved ? `✅ Pendaftaran Disetujui!` : `❌ Pendaftaran Ditolak`,
        url: scrimUrl,
        description: `Pendaftaran untuk tim **${teamName}** pada scrim **${scrimTitle}** telah diperbarui.`,
        color: isApproved ? 0x00f59b : 0xff3b5c,
        fields: [
          { name: "Tim", value: teamName, inline: true },
          { name: "Status", value: status, inline: true },
        ],
        footer: { text: "NexusScrim Notification" },
        timestamp: new Date().toISOString(),
      },
    ],
  });
}
