<script setup lang="ts">
const { data: page } = await useAsyncData('home', () =>
  queryCollection('content').path('/').first(),
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({
  title: page.value.title,
  description: page.value.description,
  ogTitle: page.value.title,
  ogDescription: page.value.description,
  ogImage: '/apoa-logo-512.png',
})

const year = new Date().getFullYear()
const tel = (n: string) => `tel:${n.replace(/[^\d+]/g, '')}`
const mapUrl = computed(() =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(page.value!.contact.mapQuery)}`,
)

const icons: Record<string, string> = {
  secretariat: 'M4 5h16v14H4z M4 9h16 M8 13h5 M8 16h8',
  development: 'M4 19h16 M6 15l4-4 3 3 5-6 M15 8h3v3',
  events: 'M4 6h16v14H4z M4 10h16 M8 3v5 M16 3v5 M8 14h3v3H8z',
  education: 'M2 9l10-5 10 5-10 5z M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5 M22 9v6',
  digital: 'M3 5h18v11H3z M8 20h8 M12 16v4 M9 9l-2 1.5L9 12 M15 9l2 1.5-2 1.5',
}
</script>

<template>
  <div v-if="page">
    <NuxtRouteAnnouncer />

    <header class="site-header">
      <div class="container header-inner">
        <a href="#top" class="brand">
          <img src="/apoa-logo-512.png" alt="" width="44" height="44">
          <span>APOA Events</span>
        </a>
        <nav aria-label="Main">
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>

    <main id="top">
      <section class="hero">
        <HeroSlider :slides="page.hero.slides" />
        <div class="container hero-inner">
          <div>
            <p class="eyebrow">{{ page.hero.eyebrow }}</p>
            <h1>{{ page.hero.headline }}</h1>
            <p class="lead">{{ page.hero.lead }}</p>
            <div class="actions">
              <a class="btn btn-primary" :href="`mailto:${page.contact.email}`">Email us</a>
              <a class="btn btn-ghost" :href="page.apoaUrl" target="_blank" rel="noopener">Visit apoaonline.com ↗</a>
            </div>
          </div>
          <div class="hero-logo">
            <img src="/apoa-logo.png" alt="Asia Pacific Orthopaedic Association logo, established 1962" width="420" height="420">
          </div>
        </div>
      </section>

      <section id="about" class="section">
        <div class="container narrow prose">
          <ContentRenderer :value="page" />
        </div>
      </section>

      <section id="services" class="section section-tint">
        <div class="container">
          <h2 class="section-title">What we do</h2>
          <div class="cards">
            <article v-for="s in page.services" :key="s.title" class="card">
              <svg class="card-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path :d="icons[s.icon]" />
              </svg>
              <h3>{{ s.title }}</h3>
              <p>{{ s.description }}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="contact" class="section">
        <div class="container">
          <h2 class="section-title">Contact</h2>
          <div class="contact-grid">
            <div class="contact-block">
              <h3>Office</h3>
              <address>
                <strong>{{ page.contact.company }}</strong><br>
                <template v-for="line in page.contact.address" :key="line">{{ line }}<br></template>
              </address>
              <a class="link" :href="mapUrl" target="_blank" rel="noopener">Open in Google Maps ↗</a>
            </div>
            <div class="contact-block">
              <h3>Telephone</h3>
              <ul>
                <li v-for="p in page.contact.phones" :key="p"><a :href="tel(p)">{{ p }}</a></li>
              </ul>
            </div>
            <div class="contact-block">
              <h3>Email</h3>
              <a class="email" :href="`mailto:${page.contact.email}`">{{ page.contact.email }}</a>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="container footer-inner">
        <span>© {{ year }} {{ page.contact.company }}</span>
        <a :href="page.apoaUrl" target="_blank" rel="noopener">Asia Pacific Orthopaedic Association</a>
      </div>
    </footer>
  </div>
</template>
