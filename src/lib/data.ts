import { prisma } from "@/lib/prisma";
import { GameType, ScrimFormat, ScrimStatus, RegistrationStatus, TeamRole } from "@prisma/client";

// Fallback mock data if PostgreSQL (Neon) connection is pending
export const MOCK_SCRIMS = [
  {
    id: "scrim-val-1",
    title: "Valorant Tier 1-2 Weekly Showdown",
    game: "VALORANT" as GameType,
    format: "BO3" as ScrimFormat,
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Besok
    maxSlots: 2,
    rules: "Map pool: Ascent, Haven, Bind, Sunset, Lotus. Overtime Win by 2. No tactical pausing > 3 mins.",
    serverRegion: "Singapore 1 / 2",
    prizePool: "Rp 1.500.000 + Practice",
    status: "OPEN" as ScrimStatus,
    registrations: [
      {
        id: "reg-1",
        status: "APPROVED" as RegistrationStatus,
        team: {
          id: "team-prx",
          name: "Paper Rex Academy",
          tag: "PRX",
          logo: "https://api.dicebear.com/7.x/identicon/svg?seed=PRXTEAM",
          game: "VALORANT" as GameType,
        },
      },
    ],
    matchResults: [],
  },
  {
    id: "scrim-mlbb-1",
    title: "Mobile Legends Pro Practice League",
    game: "MOBILE_LEGENDS" as GameType,
    format: "BO3" as ScrimFormat,
    startTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
    maxSlots: 2,
    rules: "Draft Pick Tournament Mode 5v5. All hero unlocked. Fairplay rule.",
    serverRegion: "Indonesia Server",
    prizePool: "Kompetitif / Friendly",
    status: "FULL" as ScrimStatus,
    registrations: [
      {
        id: "reg-2",
        status: "APPROVED" as RegistrationStatus,
        team: {
          id: "team-rrq",
          name: "RRQ Sena",
          tag: "RRQ",
          logo: "https://api.dicebear.com/7.x/identicon/svg?seed=RRQTEAM",
          game: "MOBILE_LEGENDS" as GameType,
        },
      },
      {
        id: "reg-3",
        status: "APPROVED" as RegistrationStatus,
        team: {
          id: "team-onic",
          name: "ONIC Prodigy",
          tag: "ONIC",
          logo: "https://api.dicebear.com/7.x/identicon/svg?seed=ONICTEAM",
          game: "MOBILE_LEGENDS" as GameType,
        },
      },
    ],
    matchResults: [],
  },
  {
    id: "scrim-pubg-1",
    title: "PUBG Mobile Scrim Season - Squad War 16 Teams",
    game: "PUBG_MOBILE" as GameType,
    format: "BATTLE_ROYALE" as ScrimFormat,
    startTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
    maxSlots: 16,
    rules: "4 Round: Erangel, Miramar, Sanhok, Erangel. PMGC Points system. No emulator.",
    serverRegion: "Asia Server",
    prizePool: "Total Rp 3.000.000",
    status: "OPEN" as ScrimStatus,
    registrations: [
      {
        id: "reg-4",
        status: "APPROVED" as RegistrationStatus,
        team: {
          id: "team-btr",
          name: "Bigetron Knights",
          tag: "BTR",
          logo: "https://api.dicebear.com/7.x/identicon/svg?seed=BTRTEAM",
          game: "PUBG_MOBILE" as GameType,
        },
      },
    ],
    matchResults: [],
  },
  {
    id: "scrim-val-2",
    title: "Valorant Radiant Warmup - Ascent Clashes",
    game: "VALORANT" as GameType,
    format: "BO1" as ScrimFormat,
    startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
    maxSlots: 2,
    rules: "Ascent standard competitive rules.",
    serverRegion: "Singapore",
    prizePool: "Glory & ELO",
    status: "COMPLETED" as ScrimStatus,
    registrations: [
      {
        id: "reg-5",
        status: "APPROVED" as RegistrationStatus,
        team: {
          id: "team-prx",
          name: "Paper Rex Academy",
          tag: "PRX",
          logo: "https://api.dicebear.com/7.x/identicon/svg?seed=PRXTEAM",
          game: "VALORANT" as GameType,
        },
      },
      {
        id: "reg-6",
        status: "APPROVED" as RegistrationStatus,
        team: {
          id: "team-fnc",
          name: "Fnatic Rising",
          tag: "FNC",
          logo: "https://api.dicebear.com/7.x/identicon/svg?seed=FNCTEAM",
          game: "VALORANT" as GameType,
        },
      },
    ],
    matchResults: [
      {
        id: "match-1",
        scrimId: "scrim-val-2",
        winnerTeamId: "team-prx",
        teamAName: "Paper Rex Academy",
        teamBName: "Fnatic Rising",
        scoreTeamA: 13,
        scoreTeamB: 11,
        details: "Map: Ascent. Pertandingan ketat overtime! MVP: PRX f0rsakeN (28/14/8 KDA)",
        proofUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop",
        recordedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    ],
  },
];

export const MOCK_TEAMS = [
  {
    id: "team-prx",
    name: "Paper Rex Academy",
    tag: "PRX",
    game: "VALORANT" as GameType,
    description: "Tim akademi resmi Paper Rex divisi VCT Pacific. Agresif, W-gaming!",
    logo: "https://api.dicebear.com/7.x/identicon/svg?seed=PRXTEAM",
    inviteCode: "PRX2026",
    captainId: "captain-prx",
    captain: {
      id: "captain-prx",
      name: "Jason 'f0rsakeN' Susanto",
      gameTag: "PRX f0rsakeN#WIB",
      discordUsername: "f0rsaken#1234",
    },
    members: [
      {
        id: "tm-1",
        userId: "captain-prx",
        roleInTeam: "CAPTAIN" as TeamRole,
        gameTag: "PRX f0rsakeN#WIB",
        user: { name: "Jason 'f0rsakeN' Susanto", image: "https://api.dicebear.com/7.x/bottts/svg?seed=PRXf0rsakeN" },
      },
      {
        id: "tm-2",
        userId: "member-jinggg",
        roleInTeam: "PLAYER" as TeamRole,
        gameTag: "PRX Jinggg#DUO",
        user: { name: "Rendy 'Jinggg' Wang", image: "https://api.dicebear.com/7.x/bottts/svg?seed=JingggPRX" },
      },
      {
        id: "tm-3",
        userId: "member-smth",
        roleInTeam: "PLAYER" as TeamRole,
        gameTag: "PRX smth#RUS",
        user: { name: "Ilya 'something' Petrov", image: "https://api.dicebear.com/7.x/bottts/svg?seed=somethingPRX" },
      },
    ],
    registrations: [] as any[],
  },
  {
    id: "team-rrq",
    name: "RRQ Sena",
    tag: "RRQ",
    game: "MOBILE_LEGENDS" as GameType,
    description: "Tim MDL Indonesia divisi Mobile Legends RRQ Kingdom.",
    logo: "https://api.dicebear.com/7.x/identicon/svg?seed=RRQTEAM",
    inviteCode: "RRQ2026",
    captainId: "captain-rrq",
    captain: {
      id: "captain-rrq",
      name: "Muhammad 'Lemon' Ikhsan",
      gameTag: "RRQ Lemon#MLBB",
      discordUsername: "lemonalien#7777",
    },
    members: [
      {
        id: "tm-4",
        userId: "captain-rrq",
        roleInTeam: "CAPTAIN" as TeamRole,
        gameTag: "RRQ Lemon#MLBB",
        user: { name: "Muhammad 'Lemon' Ikhsan", image: "https://api.dicebear.com/7.x/bottts/svg?seed=LemonAlien" },
      },
    ],
    registrations: [] as any[],
  },
  {
    id: "team-btr",
    name: "Bigetron Knights",
    tag: "BTR",
    game: "PUBG_MOBILE" as GameType,
    description: "Divisi squad PUBG Mobile Bigetron Esports.",
    logo: "https://api.dicebear.com/7.x/identicon/svg?seed=BTRTEAM",
    inviteCode: "BTR2026",
    captainId: "captain-btr",
    captain: {
      id: "captain-btr",
      name: "Muhammad 'Ryzen' Albi",
      gameTag: "BTR Ryzen#PUBG",
      discordUsername: "ryzenbtr#8888",
    },
    members: [
      {
        id: "tm-5",
        userId: "captain-btr",
        roleInTeam: "CAPTAIN" as TeamRole,
        gameTag: "BTR Ryzen#PUBG",
        user: { name: "Muhammad 'Ryzen' Albi", image: "https://api.dicebear.com/7.x/bottts/svg?seed=BTRRyzen" },
      },
    ],
    registrations: [] as any[],
  },
];

export async function getScrims({
  game,
  status,
}: {
  game?: string;
  status?: string;
} = {}) {
  try {
    const where: Record<string, any> = {};
    if (game && game !== "ALL") {
      where.game = game as GameType;
    }
    if (status && status !== "ALL") {
      where.status = status as ScrimStatus;
    }

    const scrims = await prisma.scrim.findMany({
      where,
      orderBy: { startTime: "asc" },
      include: {
        registrations: {
          include: { team: true },
        },
        matchResults: true,
      },
    });

    if (scrims && scrims.length > 0) return scrims;
    return filterMockScrims(game, status);
  } catch {
    return filterMockScrims(game, status);
  }
}

function filterMockScrims(game?: string, status?: string) {
  let list = [...MOCK_SCRIMS];
  if (game && game !== "ALL") {
    list = list.filter((s) => s.game === game);
  }
  if (status && status !== "ALL") {
    list = list.filter((s) => s.status === status);
  }
  return list;
}

export async function getScrimById(id: string) {
  try {
    const scrim = await prisma.scrim.findUnique({
      where: { id },
      include: {
        registrations: {
          include: {
            team: {
              include: {
                captain: true,
                members: { include: { user: true } },
              },
            },
          },
        },
        matchResults: true,
      },
    });
    if (scrim) return scrim;
    return MOCK_SCRIMS.find((s) => s.id === id) || null;
  } catch {
    return MOCK_SCRIMS.find((s) => s.id === id) || null;
  }
}

export async function getTeams({ game }: { game?: string } = {}) {
  try {
    const where: Record<string, any> = {};
    if (game && game !== "ALL") {
      where.game = game as GameType;
    }

    const teams = await prisma.team.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        captain: true,
        members: { include: { user: true } },
        registrations: { include: { scrim: true } },
      },
    });

    if (teams && teams.length > 0) return teams;
    return MOCK_TEAMS;
  } catch {
    return MOCK_TEAMS;
  }
}

export async function getTeamById(id: string) {
  try {
    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        captain: true,
        members: { include: { user: true } },
        registrations: { include: { scrim: true } },
      },
    });
    if (team) return team;
    return MOCK_TEAMS.find((t) => t.id === id) || null;
  } catch {
    return MOCK_TEAMS.find((t) => t.id === id) || null;
  }
}

export async function getUserTeams(userId: string) {
  try {
    const teams = await prisma.team.findMany({
      where: {
        OR: [
          { captainId: userId },
          { members: { some: { userId } } },
        ],
      },
      include: {
        captain: true,
        members: { include: { user: true } },
      },
    });
    return teams;
  } catch {
    return [];
  }
}
