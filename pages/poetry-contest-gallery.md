---
permalink: /poetry-contest-gallery
layout: page
title: 'Abai Poetry Video Gallery'
image: /assets/images/abai_video_contest.png
descrip: "We appreciate everyone's submission to the Abai poetry reading video celebration."
---
[Submit a Video](/poetry-video-submission)

<div class="row">
{% for item in site.data.video-contest.contents %}
  <div class="col-sm-12 col-md-6">
  <div class="d-flex flex-column">
    <h2 class="p-2 text-center underlinzz">{{ item.title }}</h2>
    <div class="poem-meta p-1 text-center underlinzz-2">
    <em>
    "{{ item.poem-name }}"
    </em>
    </div>
    <a href="{%if item.href %} {{ item.href }} {% else %} {{ item.src }} {% endif %}" target="_blank">
      <div class="video-card m-2 p-2">
      <video class="card-img-top" width="100%" height="350px" playsinline="playsinline" autoplay="autoplay" muted="muted" loop="loop">
        <source src="{{ item.src }}" type="video/mp4">
      </video>
      <div class="vid-meta p-1">
      <span class="catagory p-1">{{ item.category }}
      </span>
      <span class="language p-1">{{ item.language }}
      </span>
      </div>
      </div>
    </a>
  </div>
  </div>
  {% endfor %}
</div>
