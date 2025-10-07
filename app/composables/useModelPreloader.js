import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const cache = new Map()

export async function useModelPreloader(urls = []) {
    const loader = new GLTFLoader()
    const loadPromises = urls.map(url => {
        if (cache.has(url)) return cache.get(url)
        const p = loader.loadAsync(url)
        cache.set(url, p)
        return p
    })
    await Promise.all(loadPromises)
    return cache
}
