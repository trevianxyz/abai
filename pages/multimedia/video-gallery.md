---
permalink: /multimedia/video-gallery
layout: topic
title: Video Gallery
category: Multimedia
---

<div class="row">
{% for item in site.data.videos.contents %}
  <div class="col-sm-12 col-md-6">
  <div class="d-flex flex-column">
    <div class="video-title-text p-5">{{ item.title }}</div>
  </div>
      <a href="{%if item.href %} {{ item.href }} {% else %} {{ item.src }} {% endif %}" target="_blank">
        <div class="video-card m-2 p-2">
        <video class="card-img-top" playsinline="playsinline" autoplay="autoplay" muted="muted" loop="loop" src="{{ item.src }}" type="video/mp4">
        </video>
        <div class="vid-meta p-1"><span class="catagory p-1">{{ item.category }}</span><span class="language p-1">{{ item.language }}</span></div>
        </div>
      </a>
  </div>
  {% endfor %}
</div>
