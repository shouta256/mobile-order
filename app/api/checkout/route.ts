import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'You must be logged in to place an order' },
        { status: 401 }
      );
    }
    
    const { items, total, deliveryAddress, note } = await request.json();
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }
    
    // Validate items and fetch current prices
    const itemIds = items.map(item => item.id);
    const menuItems = await prisma.menuItem.findMany({
      where: {
        id: {
          in: itemIds
        }
      }
    });
    
    if (menuItems.length !== itemIds.length) {
      return NextResponse.json(
        { error: 'One or more items are no longer available' },
        { status: 400 }
      );
    }
    
    // Create transaction
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total: total,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        paymentMethod: 'CARD', // Default payment method
        deliveryAddress,
        note,
        orderItems: {
          create: items.map(item => ({
            menuItemId: item.id,
            quantity: item.quantity,
            price: menuItems.find(mi => mi.id === item.id)?.price!,
            note: item.note
          }))
        }
      },
      include: {
        orderItems: true
      }
    });
    
    // Update challenge progress if applicable
    await updateChallengeProgress(user.id, total);
    
    return NextResponse.json({ 
      success: true, 
      orderId: order.id 
    });
    
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'An error occurred during checkout' },
      { status: 500 }
    );
  }
}

async function updateChallengeProgress(userId: string, orderTotal: number) {
  // Find active challenges
  const activeChallenges = await prisma.challenge.findMany({
    where: {
      active: true,
      startDate: { lte: new Date() },
      endDate: { gte: new Date() }
    }
  });
  
  for (const challenge of activeChallenges) {
    // Get or create user progress for this challenge
    const userProgress = await prisma.challengeProgress.upsert({
      where: {
        userId_challengeId: {
          userId,
          challengeId: challenge.id
        }
      },
      update: {},
      create: {
        userId,
        challengeId: challenge.id,
        progress: 0,
        completed: false,
        rewardClaimed: false
      }
    });
    
    // Update progress based on challenge type
    if (challenge.type === 'ORDER_COUNT') {
      await prisma.challengeProgress.update({
        where: { id: userProgress.id },
        data: {
          progress: { increment: 1 },
          completed: userProgress.progress + 1 >= challenge.target
        }
      });
    } else if (challenge.type === 'SPEND_AMOUNT') {
      const newProgress = userProgress.progress + Number(orderTotal);
      await prisma.challengeProgress.update({
        where: { id: userProgress.id },
        data: {
          progress: newProgress,
          completed: newProgress >= challenge.target
        }
      });
    }
    
    // For SPECIFIC_ITEMS type, we would need to check order items against the target items
    // This would require additional data structure in the challenge model
  }
}