---
layout: page
title: Abai Center Series
permalink: /abai-center-series
---

<style>
.media-link {
color: black;
text-decoration: underline !important;
text-decoration-color: #a29bfe !important;
text-decoration-style: solid !important;
font-weight: bold;
}
</style>

{% for item in site.data.ac_series.contents %}
<div class="row m-3 mb-5">
  <div class="col-sm-12 col-md-8">
  {% if item.format == "video" %}
<h2 class="media-link">{{ item.title }}</h2>
  <div class="usa-embed-container" aria-label="16:9">
      <video class="card-img-top" autoplay controls playsinline="playsinline" muted="muted">
      <source src="{{ item.src }}" muted="muted" loop="loop" type="video/mp4">
      </video>
  </div>
{% else %}
<a href="{%if item.href %} {{ item.href }} {% else %} {% endif %}" target="_blank">
<h2 class="media-link">{{ item.title }}</h2>
  <div class="usa-embed-container">
    <div class="card-img-top">
    <img src="{{ item.src }}" type="image">
    </div>
  </div>
</a>
{% endif %}
  </div>
</div>

{% endfor %}
