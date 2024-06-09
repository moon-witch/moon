interface Translation {
    id: number;
    Blogposts_id: number;
    languages_code: string;
    title: string;
    slug: string;
    description: string;
    content: string;
}

export type Post = {
    id: number,
    status: string,
    date_created: string,
    date_updated: string,
    author: string,
    category: string,
    image: string,
    translations: Translation[]
}