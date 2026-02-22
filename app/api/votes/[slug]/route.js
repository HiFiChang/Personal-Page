import { NextResponse } from 'next/server';

// Lazy-init Redis client so local dev without env vars doesn't crash
let redis = null;

async function getRedis() {
    if (redis) return redis;
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
        return null; // local dev fallback
    }
    const { Redis } = await import('@upstash/redis');
    redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    return redis;
}

// In-memory fallback for local development
const localStore = {};

async function getVotes(slug) {
    const r = await getRedis();
    if (r) {
        const up = (await r.get(`vote:${slug}:up`)) ?? 0;
        const down = (await r.get(`vote:${slug}:down`)) ?? 0;
        return { up: Number(up), down: Number(down) };
    }
    return localStore[slug] ?? { up: 0, down: 0 };
}

async function incrementVote(slug, type) {
    const r = await getRedis();
    if (r) {
        const val = await r.incr(`vote:${slug}:${type}`);
        const other = (await r.get(`vote:${slug}:${type === 'up' ? 'down' : 'up'}`)) ?? 0;
        return type === 'up'
            ? { up: Number(val), down: Number(other) }
            : { up: Number(other), down: Number(val) };
    }
    // local fallback
    if (!localStore[slug]) localStore[slug] = { up: 0, down: 0 };
    localStore[slug][type] += 1;
    return localStore[slug];
}

export async function GET(request, { params }) {
    const { slug } = await params;
    const votes = await getVotes(slug);
    return NextResponse.json(votes);
}

export async function POST(request, { params }) {
    const { slug } = await params;
    const { type } = await request.json();

    if (type !== 'up' && type !== 'down') {
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const updated = await incrementVote(slug, type);
    return NextResponse.json(updated);
}
