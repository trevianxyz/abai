---
layout: page
title: "Kazakhstan & Central Asia: Through the Eyes of Western Travelers"
permalink: "/kazakhstan-through-eyes-of-western-travelers"
image: "/assets/images/western-eyes/western-eyes-mobile.png"
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

{% assign articles = site.data.eyes.contents %}

{% for item in articles %}
<div class="row align-items-center">
    <div class="col-sm-12 col-md-4 media_center">
    {% if item.image %}
    <a class="media-link" href="{{ item.href }}" title="{{ item.title }}">  <img src="{{ item.image }}" class="img-fluid news_thumbnail mx-auto" alt="Image" /></a>
    {% else %}
    <img src="assets/images/pen_quill.png" class="img-fluid news_thumbnail mx-auto" alt="Image" />
    {% endif %}
    </div>

<div class="col-sm-12 col-md-8 media_center">
<div class="align-middle">
 {% assign article_id = item.title | slugify %}
    <h2 class="briefing-statement__title_allnews mt-0" id="{{ article_id }}">
    <a class="media-link" href="{{ item.href }}" title="{{ item.title }}" >
    {{ item.title }}
    </a>
    </h2>
    <div class="meta__pub ml-5">
        {% if item.author %} 
        By {{ item.author }}
        {% endif %}
        {% if item.publication %}
        <em><b><span class="mx-2">{{ item.publication }}</span></b></em>
        {% endif %}
        <br>
        {% if item.date %} 
      <span class="text-secondary mx-3">  {{ item.date }} </span>
        {% endif %}
    </div>
</div>
</div>
</div>
<hr class="my-0">
{% endfor %}