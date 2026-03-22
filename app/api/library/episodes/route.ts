import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const userId = (session.user as any).id
    const { searchParams } = new URL(request.url)
    const watchlistId = searchParams.get('watchlistId')

    if (!watchlistId) {
      return NextResponse.json({ error: 'Watchlist ID is required' }, { status: 400 })
    }

    const watchlistItem = await prisma.watchlist.findFirst({
      where: { id: watchlistId, userId }
    })

    if (!watchlistItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    const episodes = await prisma.watchedEpisode.findMany({
      where: { watchlistId, userId },
      orderBy: { episodeNum: 'asc' }
    })

    return NextResponse.json(episodes)
  } catch (error) {
    console.error('Error fetching episodes:', error)
    return NextResponse.json({ error: 'Failed to fetch episodes' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const userId = (session.user as any).id
    const { watchlistId, episodeNum } = await request.json()

    if (!watchlistId || episodeNum === undefined) {
      return NextResponse.json({ error: 'Watchlist ID and episode number are required' }, { status: 400 })
    }

    const watchlistItem = await prisma.watchlist.findFirst({
      where: { id: watchlistId, userId }
    })

    if (!watchlistItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    const existing = await prisma.watchedEpisode.findUnique({
      where: {
        watchlistId_episodeNum: {
          watchlistId,
          episodeNum: parseInt(episodeNum)
        }
      }
    })

    if (existing) {
      return NextResponse.json({ error: 'Episode already marked as watched' }, { status: 400 })
    }

    const episode = await prisma.watchedEpisode.create({
      data: {
        userId,
        watchlistId,
        episodeNum: parseInt(episodeNum)
      }
    })

    return NextResponse.json(episode, { status: 201 })
  } catch (error) {
    console.error('Error adding watched episode:', error)
    return NextResponse.json({ error: 'Failed to add episode' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const userId = (session.user as any).id
    const { searchParams } = new URL(request.url)
    const watchlistId = searchParams.get('watchlistId')
    const episodeNum = searchParams.get('episodeNum')

    if (!watchlistId || episodeNum === null) {
      return NextResponse.json({ error: 'Watchlist ID and episode number are required' }, { status: 400 })
    }

    const watchlistItem = await prisma.watchlist.findFirst({
      where: { id: watchlistId, userId }
    })

    if (!watchlistItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    await prisma.watchedEpisode.deleteMany({
      where: {
        watchlistId,
        userId,
        episodeNum: parseInt(episodeNum)
      }
    })

    return NextResponse.json({ message: 'Episode unmarked' })
  } catch (error) {
    console.error('Error removing watched episode:', error)
    return NextResponse.json({ error: 'Failed to remove episode' }, { status: 500 })
  }
}
