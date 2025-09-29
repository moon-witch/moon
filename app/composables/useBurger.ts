export function useBurger() {
    const menuOpen = ref(false)

    const openMenu = () => {
        menuOpen.value = true
    }

    const closeMenu = () => {
        menuOpen.value = false
    }

    return { menuOpen, openMenu, closeMenu };
}