---
layout: page
title: Archive
---

### Blog Posts

{% for post in site.posts %}
* {{ post.date | date: "%b. %e, %Y" }} - [{{ post.title }}]({{ post.url }})
{% endfor %}
