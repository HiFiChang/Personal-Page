import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import styles from './blog.module.css';

export const metadata = {
    title: 'Blog — Chang Haofei',
    description: 'Thoughts on computer science, AI, and building things.',
};

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export default function BlogPage() {
    const posts = getAllPosts();

    return (
        <div className={styles.blog}>
            <header className={styles.header}>
                <h1 className={`${styles.title} animate-fade-in-up`}>Blog</h1>
                <p className={`${styles.subtitle} animate-fade-in-up delay-1`}>
                    Writing about things I learn and build.
                </p>
            </header>

            <div className={`${styles.postList} animate-fade-in-up delay-2`}>
                {posts.length === 0 ? (
                    <p className={styles.empty}>No posts yet. Stay tuned.</p>
                ) : (
                    posts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className={styles.postItem}
                        >
                            <div className={styles.postContent}>
                                <h2 className={styles.postTitle}>{post.title}</h2>
                                {post.description && (
                                    <p className={styles.postDescription}>{post.description}</p>
                                )}
                            </div>
                            <time className={styles.postDate}>{formatDate(post.date)}</time>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
