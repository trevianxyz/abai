---
layout: page
title: "Kazakhstan & Central Asia: Through the Eyes of Western Travelers"
permalink: /kazakhstan-through-eyes-of-western-travelers
---

{% assign articles = site.data.eyes.contents %}

{% for item in articles %}
<div class="row align-items-center">
    <div class="col-sm-12 col-md-4 media_center">
    {% if item.image %}
        <img src="{{ item.image }}" class="img-fluid news_thumbnail mx-auto" alt="Image" />
    {% else %}
    <img src="assets/images/pen_quill.png" class="img-fluid news_thumbnail mx-auto" alt="Image" />
    {% endif %}
    </div>

<div class="col-sm-12 col-md-8 media_center">
    <h2 class="briefing-statement__title_allnews">
    <a class="media-link" href="{{ item.href }}" target="_blank" title="{{ item.title }}">
    "{{ item.title }}"
    </a>
    </h2>
<div class="meta__pub ml-5">
{% if item.author %} 
By {{ item.author }}
{% endif %}
{% if item.publication %}
<em><b> {{ item.publication }}</b></em>
{% endif %}
{% if item.date %} 
<p>{{ item.date }}</p>
{% endif %}
</div>
</div>
</div>

{% endfor %}

 