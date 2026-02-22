import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const redis = Redis.fromEnv();

export async function GET(request, { params }) {
    const { slug } = await params;
    const up = (await redis.get(`vote:${slug}:up`)) ?? 0;
    const down = (await redis.get(`vote:${slug}:down`)) ?? 0;
    return NextResponse.json({ up: Number(up), down: Number(down) });
}

export async function POST(request, { params }) {
    const { slug } = await params;
    const { type } = await request.json();

    if (type !== 'up' && type !== 'down') {
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const val = await redis.incr(`vote:${slug}:${type}`);
    const other = (await redis.get(`vote:${slug}:${type === 'up' ? 'down' : 'up'}`)) ?? 0;
    const result = type === 'up'
        ? { up: Number(val), down: Number(other) }
        : { up: Number(other), down: Number(val) };

    return NextResponse.json(result);
}
