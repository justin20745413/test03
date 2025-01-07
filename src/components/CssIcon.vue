<template>
    <div class="icon-container">
        <div class="Battery"></div>
        <div class="water"></div>
        <div class="triangle"></div>
        <div class="water_droplets"></div>
        <div class="square"></div>
        <div class="loading"></div>
    </div>
</template>

<script lang="ts" setup></script>
<style lang="scss" scoped>
.icon-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}

/* Battery */
.Battery {
    width: 80px;
    height: 40px;
    color: var(--q-secondary);
    border: 2px solid currentColor;
    border-right-color: transparent;
    padding: 3px;
    background: repeating-linear-gradient(90deg, currentColor 0 10px, #0000 0 15px) 0/0% no-repeat
        content-box content-box;
    position: relative;
    box-sizing: border-box;
    animation: l5 2s infinite steps(6);
    cursor: pointer;
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.1);
    }
}
.Battery::before {
    content: '';
    position: absolute;
    top: -2px;
    bottom: -2px;
    left: 100%;
    width: 10px;
    background:
        linear-gradient(
                #0000 calc(50% - 7px),
                currentColor 0 calc(50% - 5px),
                #0000 0 calc(50% + 5px),
                currentColor 0 calc(50% + 7px),
                #0000 0
            )
            left / 100% 100%,
        linear-gradient(currentColor calc(50% - 5px), #0000 0 calc(50% + 5px), currentColor 0)
            left / 2px 100%,
        linear-gradient(#0000 calc(50% - 5px), currentColor 0 calc(50% + 5px), #0000 0) right/2px
            100%;
    background-repeat: no-repeat;
}
@keyframes l5 {
    100% {
        background-size: 120%;
    }
}

/* water:  */
.water {
    --r1: 154%;
    --r2: 68.5%;
    width: 60px;
    aspect-ratio: 1;
    border-radius: 50%;
    background: radial-gradient(var(--r1) var(--r2) at top, #0000 79.5%, #269af2 80%),
        radial-gradient(var(--r1) var(--r2) at bottom, #269af2 79.5%, #0000 80%),
        radial-gradient(var(--r1) var(--r2) at top, #0000 79.5%, #269af2 80%), #ccc;
    background-size: 50.5% 220%;
    background-position:
        -100% 0%,
        0% 0%,
        100% 0%;
    background-repeat: no-repeat;
    animation: l9 2s infinite linear;
    cursor: pointer;
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.1);
    }
}
@keyframes l9 {
    33% {
        background-position:
            0% 33%,
            100% 33%,
            200% 33%;
    }
    66% {
        background-position:
            -100% 66%,
            0% 66%,
            100% 66%;
    }
    100% {
        background-position:
            0% 100%,
            100% 100%,
            200% 100%;
    }
}

/* triangle: */
.triangle {
    width: 80px;
    aspect-ratio: 1.154;
    clip-path: polygon(50% 0, 100% 100%, 0 100%);
    --c: no-repeat linear-gradient(var(--q-negative) 0 0);
    background: var(--c), var(--c), var(--c), var(--c), var(--c);
    background-size: 100% calc(100% / 5 + 1px);
    animation: l15 2s infinite;
    cursor: pointer;
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.1);
    }
}
@keyframes l15 {
    0% {
        background-position:
            0 calc(-2 * 100% / 4),
            0 calc(-2 * 100% / 4),
            0 calc(-2 * 100% / 4),
            0 calc(-2 * 100% / 4),
            0 calc(-2 * 100% / 4);
    }
    20% {
        background-position:
            0 calc(4 * 100% / 4),
            0 calc(-2 * 100% / 4),
            0 calc(-2 * 100% / 4),
            0 calc(-2 * 100% / 4),
            0 calc(-2 * 100% / 4);
    }
    40% {
        background-position:
            0 calc(4 * 100% / 4),
            0 calc(3 * 100% / 4),
            0 calc(-2 * 100% / 4),
            0 calc(-2 * 100% / 4),
            0 calc(-2 * 100% / 4);
    }
    60% {
        background-position:
            0 calc(4 * 100% / 4),
            0 calc(3 * 100% / 4),
            0 calc(2 * 100% / 4),
            0 calc(-2 * 100% / 4),
            0 calc(-2 * 100% / 4);
    }
    80% {
        background-position:
            0 calc(4 * 100% / 4),
            0 calc(3 * 100% / 4),
            0 calc(2 * 100% / 4),
            0 calc(1 * 100% / 4),
            0 calc(-2 * 100% / 4);
    }
    100% {
        background-position:
            0 calc(4 * 100% / 4),
            0 calc(3 * 100% / 4),
            0 calc(2 * 100% / 4),
            0 calc(1 * 100% / 4),
            0 calc(0 * 100% / 4);
    }
}

/* HTML: */
.water_droplets {
    width: 100px;
    aspect-ratio: 1;
    padding: 10px;
    box-sizing: border-box;
    display: grid;
    background: #fff;
    filter: blur(5px) contrast(10);
    mix-blend-mode: darken;
    cursor: pointer;
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.1);
    }
}
.water_droplets:before,
.water_droplets:after {
    content: '';
    grid-area: 1/1;
    background:
        linear-gradient(var(--q-info) 0 0) left,
        linear-gradient(var(--q-info) 0 0) right;
    background-size: 20px 40px;
    background-origin: content-box;
    background-repeat: no-repeat;
}
.water_droplets:after {
    height: 20px;
    width: 20px;
    margin: auto 0;
    border-radius: 50%;
    background: var(--q-info);
    animation: l10 1s infinite;
}
@keyframes l10 {
    90%,
    100% {
        transform: translate(300%);
    }
}

/* HTML:  */
.square {
    width: 60px;
    aspect-ratio: 1;
    --g: conic-gradient(from -90deg at 10px 10px, var(--q-accent) 90deg, #0000 0);
    background: var(--g), var(--g), var(--g);
    background-size: 50% 50%;
    animation: l16 1s infinite;
}
@keyframes l16 {
    0% {
        background-position:
            0 0,
            10px 10px,
            20px 20px;
    }
    50% {
        background-position:
            0 20px,
            10px 10px,
            20px 0;
    }
    100% {
        background-position:
            20px 20px,
            10px 10px,
            0 0;
    }
}
/* HTML:  */
.loading {
    width: fit-content;
    font-size: 40px;
    font-family: system-ui, sans-serif;
    font-weight: bold;
    text-transform: uppercase;
    color: #0000;
    -webkit-text-stroke: 1px #000;
    background: linear-gradient(90deg, #0000 33%, #000 0 67%, #0000 0) 0/300% 100% no-repeat text;
    animation: l2 2s linear infinite;
}
.loading:before {
    content: 'Loading';
}
@keyframes l2 {
    0% {
        background-position: 100%;
    }
}

@media (min-width: 1530px) {
    .icon-container {
        grid-template-columns: repeat(6, 1fr);
        gap: 19px;
        padding: 20px;
    }
}

@media (max-width: 1530px) {
    .icon-container {
        gap: 64px;
        padding: 16px;
    }

    .Battery {
        width: 60px;
        height: 30px;
    }

    .water {
        width: 50px;
    }

    .triangle {
        width: 60px;
    }

    .water_droplets {
        width: 80px;
    }

    .square {
        width: 50px;
    }

    .loading {
        font-size: 32px;
    }
}

@media (max-width: 480px) {
    .icon-container {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        padding: 12px;
    }

    .Battery {
        width: 50px;
        height: 25px;
    }

    .water {
        width: 40px;
    }

    .triangle {
        width: 50px;
    }

    .water_droplets {
        width: 60px;
    }

    .square {
        width: 40px;
    }

    .loading {
        font-size: 24px;
    }
}
</style>
