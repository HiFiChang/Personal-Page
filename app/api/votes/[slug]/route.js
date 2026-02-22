import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const votesFile = path.join(process.cwd(), 'data', 'votes.json');

function readVotes() {
    try {
        const raw = fs.readFileSync(votesFile, 'utf8');
        return JSON.parse(raw);
    } catch {
        return {};
    }
}

function writeVotes(data) {
    fs.writeFileSync(votesFile, JSON.stringify(data, null, 2));
}

export async function GET(request, { params }) {
    const { slug } = await params;
    const votes = readVotes();
    const entry = votes[slug] || { up: 0, down: 0 };
    return NextResponse.json(entry);
}

export async function POST(request, { params }) {
    const { slug } = await params;
    const { type } = await request.json();

    if (type !== 'up' && type !== 'down') {
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const votes = readVotes();
    if (!votes[slug]) {
        votes[slug] = { up: 0, down: 0 };
    }
    votes[slug][type] += 1;
    writeVotes(votes);

    return NextResponse.json(votes[slug]);
}
