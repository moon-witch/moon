export const getImageUrl = (runtime: any, imageId: string) => {
    return `${runtime.public.directusUrl}/assets/${imageId}`;
};