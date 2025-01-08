import { defineComponent ,ref } from "vue";

export default defineComponent({
    name: "MobileMenu",
    setup() {
        const isMenuOpen = ref(false);

        const toggleMenu = () => {
            isMenuOpen.value = !isMenuOpen.value;
        };

        return {
            isMenuOpen,
            toggleMenu,
        };
    },
});

