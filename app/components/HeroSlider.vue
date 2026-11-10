<script setup lang="ts">
interface Slide { src: string, alt: string, caption?: string }

const props = withDefaults(defineProps<{ slides: Slide[], interval?: number }>(), {
  interval: 6000,
})

const current = ref(0)
// Every slide is in the server HTML (so `nuxt generate` prerenders all image sizes),
// but slides not yet in this set are display:none. Lazy images inside display:none
// aren't fetched, so the browser downloads one photo up front, and each later one
// just before it is shown.
const rendered = ref(new Set<number>([0]))
const paused = ref(false)
let timer: ReturnType<typeof setInterval> | undefined

function go(i: number) {
  const n = props.slides.length
  const next = (i + n) % n
  rendered.value.add(next)
  rendered.value.add((next + 1) % n) // warm up the following slide
  current.value = next
}

function start() {
  stop()
  if (props.slides.length < 2) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  timer = setInterval(() => { if (!paused.value) go(current.value + 1) }, props.interval)
}
function stop() { if (timer) clearInterval(timer) }

function onVisibility() { paused.value = document.hidden }

onMounted(() => {
  rendered.value.add(1 % props.slides.length)
  start()
  document.addEventListener('visibilitychange', onVisibility)
})
onBeforeUnmount(() => {
  stop()
  document.removeEventListener('visibilitychange', onVisibility)
})
</script>

<template>
  <div class="slider" aria-roledescription="carousel" aria-label="Photos from APOA events">
    <div
      v-for="(s, i) in slides"
      :key="s.src"
      class="slide"
      :class="{ active: i === current, pending: !rendered.has(i) }"
      role="group"
      aria-roledescription="slide"
      :aria-label="`${i + 1} of ${slides.length}`"
      :aria-hidden="i !== current"
    >
      <NuxtImg
        :src="s.src"
        :alt="s.alt"
        sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
        densities="x1"
        format="webp"
        :loading="i === 0 ? 'eager' : 'lazy'"
        :fetchpriority="i === 0 ? 'high' : 'low'"
        :preload="i === 0"
      />
      <p v-if="s.caption" class="caption">{{ s.caption }}</p>
    </div>

    <div v-if="slides.length > 1" class="dots">
      <button
        v-for="(s, i) in slides"
        :key="s.src"
        type="button"
        :class="{ active: i === current }"
        :aria-label="`Show photo ${i + 1}`"
        :aria-current="i === current"
        @click="go(i); start()"
        @focus="paused = true"
        @blur="paused = false"
      />
    </div>
  </div>
</template>

<style scoped>
.slider { position: absolute; inset: 0; overflow: hidden; }
.slide { position: absolute; inset: 0; opacity: 0; transition: opacity 1.2s ease; }
.slide.active { opacity: 1; }
.slide.pending { display: none; }
.slide img {
  width: 100%; height: 100%; object-fit: cover;
  transform: scale(1.04);
  transition: transform 7s ease-out;
}
.slide.active img { transform: scale(1); }

/* Darkening overlay keeps the headline readable on any photo. */
.slider::after {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background:
    linear-gradient(90deg, rgba(8, 36, 45, .92) 0%, rgba(8, 36, 45, .7) 45%, rgba(8, 36, 45, .35) 100%),
    linear-gradient(0deg, rgba(8, 36, 45, .6), transparent 40%);
}

.caption {
  position: absolute; right: 16px; bottom: 14px; z-index: 2; margin: 0;
  font-size: .78rem; letter-spacing: .04em; color: rgba(255, 255, 255, .8);
}

.dots { position: absolute; left: 50%; bottom: 18px; z-index: 3; transform: translateX(-50%); display: flex; gap: 8px; }
.dots button {
  width: 10px; height: 10px; padding: 0; border-radius: 999px; cursor: pointer;
  border: 1.5px solid rgba(255, 255, 255, .8); background: transparent;
  transition: width .3s, background .3s;
}
.dots button.active { width: 28px; background: #fff; }
.dots button:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

@media (prefers-reduced-motion: reduce) {
  .slide, .slide img { transition: none; transform: none; }
}
@media (max-width: 860px) {
  .slider::after { background: linear-gradient(0deg, rgba(8, 36, 45, .92) 20%, rgba(8, 36, 45, .55)); }
  .caption { display: none; }
}
</style>
