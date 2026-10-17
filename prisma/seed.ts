import { PrismaClient, Role, TeamRole, GameType, ScrimFormat, ScrimStatus, RegistrationStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Mulai seeding database NexusScrim...");

  // Clean up existing data
  await prisma.matchResult.deleteMany();
  await prisma.scrimRegistration.deleteMany();
  await prisma.scrim.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Data lama berhasil dibersihkan.");

  // 1. Seed Users
  const adminUser = await prisma.user.create({
    data: {
      name: "Nexus Admin",
      email: "admin@scrim.gg",
      role: Role.ADMIN,
      gameTag: "Admin#0001",
      discordUsername: "NexusAdmin#9999",
      image: "https://api.dicebear.com/7.x/bottts/svg?seed=AdminBoss",
    },
  });

  const captainVal = await prisma.user.create({
    data: {
      name: "Jason 'f0rsakeN' Susanto",
      email: "captain.prx@scrim.gg",
      role: Role.CAPTAIN,
      gameTag: "PRX f0rsakeN#WIB",
      discordUsername: "f0rsaken#1234",
      image: "https://api.dicebear.com/7.x/bottts/svg?seed=PRXf0rsakeN",
    },
  });

  const captainFnc = await prisma.user.create({
    data: {
      name: "Jake 'Boaster' Howlett",
      email: "captain.fnc@scrim.gg",
      role: Role.CAPTAIN,
      gameTag: "FNC Boaster#EU1",
      discordUsername: "boaster#5678",
      image: "https://api.dicebear.com/7.x/bottts/svg?seed=BoasterFNC",
    },
  });

  const captainRrq = await prisma.user.create({
    data: {
      name: "Muhammad 'Lemon' Ikhsan",
      email: "captain.rrq@scrim.gg",
      role: Role.CAPTAIN,
      gameTag: "RRQ Lemon#MLBB",
      discordUsername: "lemonalien#7777",
      image: "https://api.dicebear.com/7.x/bottts/svg?seed=LemonAlien",
    },
  });

  const captainBtr = await prisma.user.create({
    data: {
      name: "Muhammad 'Ryzen' Albi",
      email: "captain.btr@scrim.gg",
      role: Role.CAPTAIN,
      gameTag: "BTR Ryzen#PUBG",
      discordUsername: "ryzenbtr#8888",
      image: "https://api.dicebear.com/7.x/bottts/svg?seed=BTRRyzen",
    },
  });

  const memberPlayer = await prisma.user.create({
    data: {
      name: "Rendy 'Jinggg' Wang",
      email: "member@scrim.gg",
      role: Role.MEMBER,
      gameTag: "PRX Jinggg#DUO",
      discordUsername: "jinggg#4321",
      image: "https://api.dicebear.com/7.x/bottts/svg?seed=JingggPRX",
    },
  });

  const memberPlayer2 = await prisma.user.create({
    data: {
      name: "Ilya 'something' Petrov",
      email: "something@scrim.gg",
      role: Role.MEMBER,
      gameTag: "PRX smth#RUS",
      discordUsername: "something#1111",
      image: "https://api.dicebear.com/7.x/bottts/svg?seed=somethingPRX",
    },
  });

  console.log("👤 Users berhasil dibuat.");

  // 2. Seed Teams
  const teamPrx = await prisma.team.create({
    data: {
      name: "Paper Rex Academy",
      tag: "PRX",
      game: GameType.VALORANT,
      description: "Tim akademi resmi Paper Rex divisi VCT Pacific. Agresif, W-gaming!",
      logo: "https://api.dicebear.com/7.x/identicon/svg?seed=PRXTEAM",
      inviteCode: "PRX2026",
      captainId: captainVal.id,
      members: {
        create: [
          {
            userId: captainVal.id,
            roleInTeam: TeamRole.CAPTAIN,
            gameTag: "PRX f0rsakeN#WIB",
          },
          {
            userId: memberPlayer.id,
            roleInTeam: TeamRole.PLAYER,
            gameTag: "PRX Jinggg#DUO",
          },
          {
            userId: memberPlayer2.id,
            roleInTeam: TeamRole.PLAYER,
            gameTag: "PRX smth#RUS",
          },
        ],
      },
    },
  });

  const teamFnc = await prisma.team.create({
    data: {
      name: "Fnatic Rising",
      tag: "FNC",
      game: GameType.VALORANT,
      description: "Fnatic EMEA challenger roster preparing for international matches.",
      logo: "https://api.dicebear.com/7.x/identicon/svg?seed=FNCTEAM",
      inviteCode: "FNC2026",
      captainId: captainFnc.id,
      members: {
        create: [
          {
            userId: captainFnc.id,
            roleInTeam: TeamRole.CAPTAIN,
            gameTag: "FNC Boaster#EU1",
          },
        ],
      },
    },
  });

  const teamRrq = await prisma.team.create({
    data: {
      name: "RRQ Sena",
      tag: "RRQ",
      game: GameType.MOBILE_LEGENDS,
      description: "Tim MDL Indonesia divisi Mobile Legends RRQ Kingdom.",
      logo: "https://api.dicebear.com/7.x/identicon/svg?seed=RRQTEAM",
      inviteCode: "RRQ2026",
      captainId: captainRrq.id,
      members: {
        create: [
          {
            userId: captainRrq.id,
            roleInTeam: TeamRole.CAPTAIN,
            gameTag: "RRQ Lemon#MLBB",
          },
        ],
      },
    },
  });

  const teamBtr = await prisma.team.create({
    data: {
      name: "Bigetron Knights",
      tag: "BTR",
      game: GameType.PUBG_MOBILE,
      description: "Divisi squad PUBG Mobile Bigetron Esports.",
      logo: "https://api.dicebear.com/7.x/identicon/svg?seed=BTRTEAM",
      inviteCode: "BTR2026",
      captainId: captainBtr.id,
      members: {
        create: [
          {
            userId: captainBtr.id,
            roleInTeam: TeamRole.CAPTAIN,
            gameTag: "BTR Ryzen#PUBG",
          },
        ],
      },
    },
  });

  console.log("🛡️ Teams berhasil dibuat.");

  // 3. Seed Scrims
  const now = new Date();
  const tomorrowNight = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  tomorrowNight.setHours(20, 0, 0, 0);

  const tonight = new Date(now.getTime() + 4 * 60 * 60 * 1000);
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Scrim 1: Valorant BO3 - OPEN
  const scrimVal = await prisma.scrim.create({
    data: {
      title: "Valorant Tier 1-2 Weekly Showdown",
      game: GameType.VALORANT,
      format: ScrimFormat.BO3,
      startTime: tomorrowNight,
      maxSlots: 2,
      serverRegion: "Singapore 1 / 2",
      prizePool: "Rp 1.500.000 + Practice",
      status: ScrimStatus.OPEN,
      rules:
        "Map pool: Ascent, Haven, Bind, Sunset, Lotus.\nTournament Mode ON, Overtime Win by 2.\nNo tactical pausing over 3 minutes.\nDiscord voice room disediakan di server komunitas.",
      createdById: adminUser.id,
      registrations: {
        create: [
          {
            teamId: teamPrx.id,
            status: RegistrationStatus.APPROVED,
            notes: "Roster siap full main, ready lobby 15 menit sebelumnya.",
          },
        ],
      },
    },
  });

  // Scrim 2: MLBB BO3 - FULL
  const scrimMlbb = await prisma.scrim.create({
    data: {
      title: "Mobile Legends Pro Practice League",
      game: GameType.MOBILE_LEGENDS,
      format: ScrimFormat.BO3,
      startTime: tonight,
      maxSlots: 2,
      serverRegion: "Indonesia Server",
      prizePool: "Kompetitif / No Cash",
      status: ScrimStatus.FULL,
      rules:
        "Draft Pick Tournament Mode 5v5.\nBebas hero baru setelah minggu pertama rilis.\nPantang toxic chat all. Emote diperbolehkan secara wajar.",
      createdById: adminUser.id,
      registrations: {
        create: [
          {
            teamId: teamRrq.id,
            status: RegistrationStatus.APPROVED,
            notes: "Roster RRQ Sena siap tempur.",
          },
        ],
      },
    },
  });

  // Scrim 3: PUBG Mobile Battle Royale - OPEN
  await prisma.scrim.create({
    data: {
      title: "PUBG Mobile Scrim Season - Squad War 16 Teams",
      game: GameType.PUBG_MOBILE,
      format: ScrimFormat.BATTLE_ROYALE,
      startTime: new Date(now.getTime() + 48 * 60 * 60 * 1000),
      maxSlots: 16,
      serverRegion: "Asia Server",
      prizePool: "Total Rp 3.000.000",
      status: ScrimStatus.OPEN,
      rules:
        "4 Round: Erangel, Miramar, Sanhok, Erangel.\nSistem Poin Resmi PMGC (10 pts WWCD, 1 pt per kill).\nDilarang menggunakan emulator / trigger fisik.",
      createdById: adminUser.id,
      registrations: {
        create: [
          {
            teamId: teamBtr.id,
            status: RegistrationStatus.APPROVED,
            notes: "Slot drop: Pochinki & Pecado.",
          },
        ],
      },
    },
  });

  // Scrim 4: Completed Scrim with Match Result
  const completedScrim = await prisma.scrim.create({
    data: {
      title: "Valorant Radiant Warmup - Ascent Clashes",
      game: GameType.VALORANT,
      format: ScrimFormat.BO1,
      startTime: yesterday,
      maxSlots: 2,
      serverRegion: "Singapore",
      prizePool: "Glory & ELO",
      status: ScrimStatus.COMPLETED,
      rules: "Ascent standard competitive rule.",
      createdById: adminUser.id,
      registrations: {
        create: [
          {
            teamId: teamPrx.id,
            status: RegistrationStatus.APPROVED,
          },
          {
            teamId: teamFnc.id,
            status: RegistrationStatus.APPROVED,
          },
        ],
      },
      matchResults: {
        create: {
          winnerTeamId: teamPrx.id,
          teamAName: "Paper Rex Academy",
          teamBName: "Fnatic Rising",
          scoreTeamA: 13,
          scoreTeamB: 11,
          details: "Map: Ascent. Pertandingan ketat overtime! MVP: PRX f0rsakeN (28/14/8 KDA)",
          proofUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop",
        },
      },
    },
  });

  console.log("🎮 Scrims & Hasil Pertandingan berhasil dibuat.");
  console.log("✨ Seed database selesai dengan sukses!");
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
