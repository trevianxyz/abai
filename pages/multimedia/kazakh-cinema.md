---
permalink: /multimedia/kazakh-cinema
layout: topic
title: Kazakh Cinema
filter-directory: "cinema"
category: Multimedia
---

{% for item in site.data.cinema.contents %}
<div class="row m-3">
  <div class="col-sm-12">
  <a href="{%if item.href %} {{ item.href }} {% else %} {{ item.src }} {% endif %}" target="_blank">
<h2>{{ item.title }}</h2>
    <div class="usa-embed-container" aria-label="16:9">
        <object class="card-img-top" playsinline="playsinline" muted="muted">
        <embed src="{{ item.src }}" muted="muted" loop="loop" type="video/mp4">
        </object>
      </div>
    </a>
  </div>
</div>
{% endfor %}
