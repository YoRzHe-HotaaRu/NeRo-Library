import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const userId = (session.user as any).id

    const watchlist = await prisma.watchlist.findMany({
      where: { userId },
      include: {
        watchedEpisodes: {
          orderBy: { episodeNum: 'asc' }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json(watchlist)
  } catch (error) {
    console.error('Error fetching watchlist:', error)
    return NextResponse.json({ error: 'Failed to fetch watchlist' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const userId = (session.user as any).id
    const { animeId, title, imageUrl, status = 'plan_to_watch' } = await request.json()

    if (!animeId || !title) {
      return NextResponse.json({ error: 'Anime ID and title are required' }, { status: 400 })
    }

    const existing = await prisma.watchlist.findUnique({
      where: {
        userId_animeId: {
          userId,
          animeId: parseInt(animeId)
        }
      }
    })

    if (existing) {
      return NextResponse.json({ error: 'Anime already in library' }, { status: 400 })
    }

    const item = await prisma.watchlist.create({
      data: {
        userId,
        animeId: parseInt(animeId),
        title,
        imageUrl,
        status
      }
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Error adding to watchlist:', error)
    return NextResponse.json({ error: 'Failed to add to library' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const userId = (session.user as any).id
    const { id, status, score, notes } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Watchlist ID is required' }, { status: 400 })
    }

    const item = await prisma.watchlist.findFirst({
      where: { id, userId }
    })

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    const updated = await prisma.watchlist.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(score !== undefined && { score: score ? parseFloat(score) : null }),
        ...(notes !== undefined && { notes })
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating watchlist:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
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
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Watchlist ID is required' }, { status: 400 })
    }

    const item = await prisma.watchlist.findFirst({
      where: { id, userId }
    })

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    await prisma.watchlist.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Removed from library' })
  } catch (error) {
    console.error('Error deleting from watchlist:', error)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
