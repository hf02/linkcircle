# Changes in v2

## What's new?

### Total rewrite

It's new. Uses TypeScript, has a bundler, and has a repo. More modern-JavaScripty in a way.

### Different link member detection and removed referral detection

Before in v1, you added just added a `data-linkshuffle` to a group of links. Now, you just add slugs to links.

v1 also had a slugs system, but it was optional. It's mandatory in v2.

```html
<!-- v1 -->
<ol data-linkcircle>
  <li><a href="https://member.example.com">Some member</a></li>
  <li><a href="https://cool.example.com">Cool website</a></li>
  <li><a href="https://awesome.example.com">Awesome website</a></li>
</ol>

<!-- v2 -->
<ol>
  <li>
    <a href="https://member.example.com" data-slug="member">Some member</a>
  </li>
  <li>
    <a href="https://cool.example.com" data-slug="cool">Cool website</a>
  </li>
  <li>
    <a href="https://awesome.example.com" data-slug="awesome">
      Awesome website
    </a>
  </li>
</ol>
```

### More options

There's just more options to change now.

### Different action links

You now have an explicit link option for those that use search parameters:

```
https://you.example.com/webring.html?lc=yourslug-next
```

The usual implicit links from v1 remain alongside explicit links, and have changed their formatting:

```
https://you.example.com/webring.html?yourslug-next
```

## Dropped features

-   Adding members based solely on their URL (referral detection)
-   The cross-page feature (`data-list`)

## Migration guide from v1 to v2

Change your HTML and add slugs:

```diff
- <ol data-linkcircle>
+ <ol>
-   <li><a href="https://member.example.com">Some member</a></li>
+   <li><a href="https://member.example.com" data-slug="member">Some member</a></li>
-   <li><a href="https://cool.example.com">Cool website</a></li>
+   <li><a href="https://cool.example.com" data-slug="cool">Cool website</a></li>
-   <li><a href="https://awesome.example.com">Awesome website</a></li>
+   <li><a href="https://awesome.example.com" data-slug="awesome">Awesome website</a></li>
  </ol>
```

If you already had slugs, update them too:

```diff
- <li><a href="https://member.example.com" data-lc-slug="member">Some member</a></li>
+ <li><a href="https://member.example.com" data-slug="member">Some member</a></li>
```

Have your members change their links:

> [!Note]
> This is obviously a huge ask, so I will be looking into solutions to make this not as terrible.

```diff
- <a href="https://you.example.com/webring.html?prev">Back</a>
- <a href="https://you.example.com/webring.html?random">Random</a>
- <a href="https://you.example.com/webring.html">Nice Webring</a>
- <a href="https://you.example.com/webring.html?next">Next</a>
+ <a href="https://you.example.com/webring.html?cool-previous">Back</a>
+ <a href="https://you.example.com/webring.html?cool-random">Random</a>
+ <a href="https://you.example.com/webring.html">Nice Webring</a>
+ <a href="https://you.example.com/webring.html?cool-next">Next</a>
```

And if you already used slugs:

```diff
- <a href="https://you.example.com/webring.html?prev=cool">Back</a>
- <a href="https://you.example.com/webring.html?random=cool">Random</a>
- <a href="https://you.example.com/webring.html">Nice Webring</a>
- <a href="https://you.example.com/webring.html?next=cool">Next</a>
+ <a href="https://you.example.com/webring.html?cool-previous">Back</a>
+ <a href="https://you.example.com/webring.html?cool-random">Random</a>
+ <a href="https://you.example.com/webring.html">Nice Webring</a>
+ <a href="https://you.example.com/webring.html?cool-next">Next</a>
```
