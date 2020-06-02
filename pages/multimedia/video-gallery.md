---
permalink: /multimedia/video-gallery
layout: topic
title: Video Gallery
category: Multimedia
---

{% for item in site.data.videos.contents %}
<div class="row m-3">
  <div class="col-sm-12">
    <div class="usa-embed-container" aria-label="16:9">
      <a href="{%if item.href %} {{ item.href }} {% else %} {{ item.src }} {% endif %}" target="_blank">
        <object class="card-img-top" playsinline="playsinline" autoplay="autoplay" muted="muted" loop="loop">
        <embed src="{{ item.src }}" autoplay="autoplay" muted="muted" loop="loop" type="video/mp4">
        </object>
      </a>
    </div>
  </div>
</div>
{% endfor %}
