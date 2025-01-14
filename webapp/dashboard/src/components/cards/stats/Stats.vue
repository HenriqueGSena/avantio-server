<template>
    <div>
        <h3 class="text-2xl font-semibold text-gray-900">
            <span v-text="$t('pt.dash.calls')" />
        </h3>
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt class="truncate text-sm font-medium text-gray-500">Tempo Maximo</dt>
                <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">71,89</dd>
            </div>
            <div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt class="truncate text-sm font-medium text-gray-500">Tempo Medio</dt>
                <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">58.16</dd>
            </div>
            <div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt class="truncate text-sm font-medium text-gray-500">Tempo Minimo</dt>
                <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">24.57</dd>
            </div>
        </dl>
    </div>
</template>

<script lang="ts" src="./stats.component.ts"></script>
