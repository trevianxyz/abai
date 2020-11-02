---
layout: page
title: Abai Center Series
permalink: /abai-center-series
---

<style>
a.media-link {
color: black;
text-decoration: underline !important;
text-decoration-color: #a29bfe !important;
text-decoration-style: solid !important;
font-weight: bold;
}
</style>


{% for item in site.data.ac_series.contents %}
<div class="row m-3">
  <div class="col-sm-12">
  <a href="{%if item.href %} {{ item.href }} {% else %} {{ item.src }} {% endif %}" target="_blank">
<h2>{{ item.title }}</h2>
    <div class="usa-embed-container" aria-label="16:9">
        <video class="card-img-top" autoplay controls playsinline="playsinline" muted="muted">
        <source src="{{ item.src }}" muted="muted" loop="loop" type="video/mp4">
        </video>
    </div>
    </a>
  </div>
</div>
{% endfor %}
