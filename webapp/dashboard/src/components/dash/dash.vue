<template>
    <div class="min-h-full">
        <nav class="border-b border-gray-200 bg-[#343434]">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="flex h-16 justify-between">
                    <div class="flex">
                        <div class="flex shrink-0 items-center">
                            <img class="block h-16 w-auto lg:hidden" src="../../assets/logo_pine.png"
                                alt="Dashboard mobile">
                            <img class="hidden h-16 w-auto lg:block" src="../../assets/logo_pine.png"
                                alt="Dashboard web">
                        </div>
                        <div class="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                            <a href="#"
                                class="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-300 hover:border-yellow-500 hover:text-gray-300">Dashboard</a>
                            <!-- <a href="#"
                                class="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-300 hover:border-yellow-500 hover:text-gray-300">Team</a>
                            <a href="#"
                                class="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-300 hover:border-yellow-500 hover:text-gray-300">Projects</a>
                            <a href="#"
                                class="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-300 hover:border-yellow-500 hover:text-gray-300">Calendar</a> -->
                        </div>
                    </div>
                    <div class="hidden sm:ml-6 sm:flex sm:items-center">
                        <!-- Profile dropdown -->
                        <div class="relative ml-3">
                            <div>
                                <button type="button"
                                    class="relative flex max-w-xs items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    id="user-menu-button" aria-expanded="false" aria-haspopup="true"
                                    @click="toggleMenu">
                                    <span class="absolute -inset-1.5"></span>
                                    <span class="sr-only">Open user menu</span>
                                    <span class="inline-block size-10 overflow-hidden rounded-full bg-gray-100">
                                        <svg class="size-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                            <path
                                                d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </span>
                                </button>
                            </div>
                            <div v-if="isMenuOpen" @click="logout"
                                class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
                                role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button"
                                tabindex="-1">
                                <a href="#" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1"
                                    id="user-menu-item-2">
                                    <span v-text="$t('pt.dash.sign_out')" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="-mr-2 flex items-center sm:hidden">
                        <!-- Mobile menu button -->
                        <button type="button"
                            class="relative flex max-w-xs items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            id="user-menu-button" aria-expanded="false" aria-haspopup="true" @click="toggleMenu">
                            <span class="absolute -inset-1.5"></span>
                            <span class="sr-only">Open user menu</span>
                            <span class="inline-block size-10 overflow-hidden rounded-full bg-gray-100">
                                <svg class="size-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Mobile menu, show/hide based on menu state. -->
            <div class="sm:hidden" id="mobile-menu">
                <!-- <div class="space-y-1 pb-3 pt-2">
                    <a href="#"
                        class="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-300 hover:border-yellow-500 hover:text-gray-300">Dashboard</a>
                    <a href="#"
                        class="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-300 hover:border-yellow-500 hover:text-gray-300">Team</a>
                    <a href="#"
                        class="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-300 hover:border-yellow-500 hover:text-gray-300">Projects</a>
                    <a href="#"
                        class="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-300 hover:border-yellow-500 hover:text-gray-300">Calendar</a>
                </div> -->
                <div class="relative ml-3">
                    <div v-if="isMenuOpen" @click="logout"
                        class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
                        role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
                        <a href="#" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1"
                            id="user-menu-item-2">
                            <span v-text="$t('pt.dash.sign_out')" />
                        </a>
                    </div>
                </div>
            </div>
        </nav>

        <div class="py-10">
            <header>
                <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Stats />
                </div>
            </header>
            <main>
                <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <Board />
                </div>
            </main>
        </div>
    </div>

</template>

<script lang="ts" src="./dash.component.ts"></script>

<style scoped></style>

