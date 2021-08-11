---
layout: page
title: Abai Center Series
permalink: /abai-center-series
image: /assets/images/ac_series/abai_center_series-header.gif
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
<div class="row m-2 mb-5">
  <div class="col-sm-12 col-md-9">
  <div id="{{ item.id }}"></div>
    <a href="{%if item.href %} {{ item.href }} {% else %} {% endif %}" target="_blank">
<h2 class="media-link">{{ item.title }}</h2>
  <div class="usa-embed-container" aria-label="16:9">
  {% if item.format == 'video' %}
  <video class="card-img-top" autoplay controls playsinline="playsinline" muted="muted">
  <source src="{{ item.src }}" muted="muted" loop="loop" type="video/mp4">
  </video>
 {% elsif item.format == 'iframe' %}
  {{ item.src }}
  {% else %}
  <img src="{{ item.src }}"/>
  {% endif %}
  </div></a>
  </div>
</div>
{% endfor %}
