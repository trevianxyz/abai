---
permalink: /multimedia/kazakh-cinema
layout: topic
title: Kazakh Cinema
filter-directory: "cinema"
category: Multimedia
---


<div class="row">
{% for item in site.data.cinema.contents %}
  <div class="col-sm-12 col-md-6">
  <div class="d-flex flex-column">
    <div class="video-title-text p-5">{{ item.title }}</div>
  </div>
      <a href="{{ item.src }}" target="_blank">
        <div class="video-card m-2 p-2">
        <video class="card-img-top" playsinline="playsinline" autoplay="autoplay" muted="muted" loop="loop">
          <source src="{{ item.src }}" type="video/mp4">
        </video>
        <div class="vid-meta p-1"><span class="catagory p-1">{{ item.category }}</span><span class="language p-1">{{ item.language }}</span></div>
        </div>
      </a>
  </div>
  {% endfor %}
</div>
