---
permalink: /multimedia/video-gallery
layout: topic
title: Video Gallery
category: Multimedia
---

<div class="row">
{% for item in site.data.videos.contents %}
  <div class="col-sm-12 col-md-6">
    <div class=
    "d-flex flex-column">
      <a href="{%if item.href %} {{ item.href }} {% else %} {{ item.src }} {% endif %}" target="_blank">
        <object class="card-img-top" playsinline="playsinline" autoplay="autoplay" muted="muted" loop="loop">
          <embed src="{{ item.src }}" autoplay="autoplay" muted="muted" loop="loop" type="video/mp4">
        </object>
      <div class="vid-meta p-1">
      <span class="catagory p-1">{{ item.category }}
      </span>
      <span class="language p-1">{{ item.language }}
      </span>
      </div>
      </a>
  </div>
  </div>
  {% endfor %}
</div>
