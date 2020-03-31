---
layout: page
title: Kazakhstan & Central Asia through the eyes of Western Travelers
permalink: /kazakhstan-through-eyes-of-western-travelers
---

{% assign articles = site.data.eyes.contents %}

{% for item in articles %}

<blockquote class="blockquote">
    <a href="{{ item.href }}">
    <h4 class="m-0">{{ item.title }}</h4>
    </a>
    <div class="row">
        <p class="my-0">
    {% if item.author %}
        by 
    {% endif %}
        <span class="">{{ item.author }}</span> <span><em>{{ item.publication }}</em></span>
        </p>
    </div>
</blockquote>

{% endfor %}