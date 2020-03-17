---
permalink: /multimedia/virtual-gallery/mausoleum-of-khoja-ahmed-yasawi-360
layout: topic
title: Mausoleum of Khoja Ahmed Yasawi 360
filter-directory: "virtual-gallery"
category: Multimedia
parent: Virtual Gallery
---

<div class="row">
{% for item in site.data.virtual-videos.contents %}
  <div class="col-sm-12 col-md-6">
  <div class="d-flex flex-column">
   <!--<div class="video-title-text p-5">{{ item.title }}</div>-->
  </div>
      <a href="{{ item.src }}" target="_blank">
        <div class="video-card m-2 p-1">
        <video width="600px" playsinline="playsinline" autoplay="autoplay" muted="muted" loop="loop">
          <source src="{{ item.src }}" type="video/mp4">
        </video>
        <div class="vid-meta p-1"><span class="catagory p-1">{{ item.category }}</span><span class="language p-1">{{ item.language }}</span></div>
        </div>
      </a>
  </div>
  {% endfor %}
</div>
 