import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

export function getAllPosts() {
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(postsDirectory)
        .filter(f => f.endsWith('.md') && !f.endsWith('.zh.md'));

    const posts = fileNames.map((fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);

        // Check if Chinese version exists
        const zhPath = path.join(postsDirectory, `${slug}.zh.md`);
        const hasZh = fs.existsSync(zhPath);

        return {
            slug,
            title: data.title || slug,
            date: data.date || '',
            description: data.description || '',
            tags: data.tags || [],
            hasZh,
        };
    });

    return posts.sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(b.date) - new Date(a.date);
    });
}

export function getPostBySlug(slug) {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Estimate reading time
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    // Check for Chinese version
    const zhPath = path.join(postsDirectory, `${slug}.zh.md`);
    let contentZh = null;
    let titleZh = null;
    let hasZh = false;

    if (fs.existsSync(zhPath)) {
        const zhContents = fs.readFileSync(zhPath, 'utf8');
        const zhParsed = matter(zhContents);
        contentZh = zhParsed.content;
        titleZh = zhParsed.data.title || null;
        hasZh = true;
    }

    return {
        slug,
        title: data.title || slug,
        titleZh,
        date: data.date || '',
        description: data.description || '',
        tags: data.tags || [],
        content,
        contentZh,
        hasZh,
        readingTime,
    };
}

export function getAllSlugs() {
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    return fs.readdirSync(postsDirectory)
        .filter(f => f.endsWith('.md') && !f.endsWith('.zh.md'))
        .map(f => f.replace(/\.md$/, ''));
}
