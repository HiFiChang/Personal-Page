import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import { getPostBySlug, getAllSlugs } from '@/lib/posts';
import styles from './post.module.css';

export async function generateStaticParams() {
    const slugs = getAllSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    return {
        title: `${post.title} — Chang Haofei`,
        description: post.description || `A blog post by Chang Haofei`,
    };
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export default async function PostPage({ params }) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    const mdxOptions = {
        mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeHighlight, rehypeSlug],
        },
    };

    return (
        <article className={styles.post}>
            <header className={styles.header}>
                <Link href="/blog" className={styles.back}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5" />
                        <path d="M12 19l-7-7 7-7" />
                    </svg>
                    <span>Back to Blog</span>
                </Link>

                <h1 className={styles.title}>{post.title}</h1>

                <div className={styles.meta}>
                    {post.date && (
                        <time className={styles.date}>{formatDate(post.date)}</time>
                    )}
                    <span className={styles.dot}>·</span>
                    <span className={styles.readTime}>{post.readingTime} min read</span>
                </div>

                {post.tags && post.tags.length > 0 && (
                    <div className={styles.tags}>
                        {post.tags.map((tag) => (
                            <span key={tag} className={styles.tag}>{tag}</span>
                        ))}
                    </div>
                )}
            </header>

            <div className={`prose ${styles.content}`}>
                <MDXRemote source={post.content} options={mdxOptions} />
            </div>
        </article>
    );
}
