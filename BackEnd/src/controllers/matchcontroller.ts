import { Request, Response } from 'express';
import prisma from '../db/client';

export const createMatch = async (req: Request, res: Response): Promise<void> => {
  const { players, matchUsername } = req.body;
  if (!players || !Array.isArray(players) || players.length === 0) {
    res.status(400).json({ error: 'Invalid players array' });
    return;
  }

  if (!matchUsername || typeof matchUsername !== 'string') {
    res.status(400).json({ error: 'Missing matchUsername' });
    return;
  }

  try {
    const match = await prisma.match.create({
      data: { username: matchUsername },
    });

    const usernames = players.map((p) => p.username);
    const users = await prisma.user.findMany({
      where: { username: { in: usernames } },
    });

    const userMap = Object.fromEntries(users.map((u) => [u.username, u.id]));

    const matchPlayersData = players.map((player) => ({
      matchId: match.id,
      userId: userMap[player.username],
      score: player.score,
    }));

    await prisma.matchPlayer.createMany({ data: matchPlayersData });

    res.json({ success: true, matchId: match.id });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getUserMatchHistoryByUserId = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  if (!userId) {
    res.status(400).json({ error: 'Missing userId' });
    return;
  }

  try {
    const history = await prisma.matchPlayer.findMany({
      where: { userId },
      include: {
        match: {
          include: {
            players: {
              include: { user: true },
            },
          },
        },
      },
      orderBy: { match: { playedAt: 'desc' } },
    });

    res.json({ userId, history });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch match history' });
  }
};
