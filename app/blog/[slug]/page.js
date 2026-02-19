import { getPostBySlug, getAllSlugs } from '@/lib/posts';
import { markdownToHtml } from '@/lib/markdown';
import PostContent from './PostContent';
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

export default async function PostPage({ params }) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    // Render markdown to HTML on the server
    const htmlEn = await markdownToHtml(post.content);
    const htmlZh = post.hasZh && post.contentZh
        ? await markdownToHtml(post.contentZh)
        : null;

    return (
        <article className={styles.post}>
            <PostContent
                title={post.title}
                titleZh={post.titleZh}
                date={post.date}
                readingTime={post.readingTime}
                tags={post.tags}
                htmlEn={htmlEn}
                htmlZh={htmlZh}
                hasZh={post.hasZh}
            />
        </article>
    );
}
