---
permalink: /multimedia/photo-gallery
layout: topic
title: Photo Gallery
filter-directory: "photo-gallery"
category: Multimedia
image_graphic-slider: "photo-gallery"
---

<div class="tile-grid d-flex flex-wrap">

{% for image in site.static_files %}
  {% if image.path contains page.filter-directory %}
    <div class="col-6">  
      <div class="tile-grid-item p-2">
        <img src="{{ site.baseurl }}{{ image.path }}" alt="image" />
      </div>
    </div>
  {% endif %}
{% endfor %}
</div>
