---
layout: page
title: Kazakhstan & Central Asia through the eyes of Western Travelers
permalink: /kazakhstan-through-eyes-of-western-travelers
---

{% assign articles = site.data.eyes.contents %}

{% for item in articles %}

<blockquote class="blockquote">
    <a href="/sons-of-the-steppe">
    <h3 class="m-0">{{ item.title }}</h3>
    </a>
    <div class="row">
        <p>
        <span class="">{{ item.author }}</span> <span>{{ item.publication }}</span>
        </p>
    </div>
</blockquote>

{% endfor %}