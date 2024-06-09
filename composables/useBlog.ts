import type { Post } from '~/types/post.type'

export function useBlog() {
    const { $directus, $readItem, $readItems } = useNuxtApp()
    const blogPosts = ref<Post[] | null>(null)

    const getPosts = async (locale: string) => {
        try {
            blogPosts.value = await $directus.request<Post[]>(
                $readItems('Blogposts', {
                    fields: ['*', { translations: ['*'] }],
                    deep: {
                        translations: {
                            _filter: {
                                _and: [
                                    {
                                        languages_code: { _eq: locale }
                                    }
                                ]
                            }
                        }
                    }
                })
            );
        } catch (e) {
            console.error("Failed to fetch items:", e);
        }
    }

    const getSinglePost = async (id: string, locale: string) : Promise<Post | null> =>{
        try {
            return await $directus.request<Post>(
                $readItem('Blogposts', id, {
                    fields: ['*', { translations: ['*'] }],
                    deep: {
                        translations: {
                            _filter: {
                                _and: [
                                    {
                                        languages_code: { _eq: locale }
                                    }
                                ]
                            }
                        }
                    }
                })
            );
        } catch(e) {
            console.error("Failed to fetch single post:", e)
            return null;
        }
    }

    return { blogPosts, getPosts, getSinglePost };
}