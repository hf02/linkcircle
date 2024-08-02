# Linkcircle

Really easy webring creator that runs in your browser. All you need to know is HTML.

[What's new in v2](./docs/v2-changes.md)

## Getting started

### Step 1 - Add the script to your page

Download the script and put it as reasonably high as you can on your webring's page. It being at the top is critical to its performance.

```html
https://you.example.com/my-webring.html
<html>
  <head>
    <script src="/linkcircle.js"></script>
    <!-- ... -->
  </head>
  <body></body>
</html>
```

### Step 2 - Add your members

List your members anywhere on your page as links in your HTML. Then, make a slug for each member in a `data-slug=""`. A slug is a unique code for each member, and they'll use that code when making their widget.

You can put the links anywhere. Linkcircle does not care what they are, where they are, or what more they have. They just have to have the `href` and `data-slug`.

```html
https://you.example.com/my-webring.html
<html>
  <head>
    <script src="/linkcircle.js"></script>
    <!-- ... -->
  </head>
  <body>
    <a href="https://dude.example.com" data-slug="cooldude">Cool dude</a>
    <a href="https://somebody.example.com" data-slug="somebody">Somebody</a>

    <!-- This also works! -->
    <custom-link
      href="https://dev.example.com"
      data-slug="dev"
    ></custom-link>
  </body>
</html>
```

### Step 3 - You got a webring!

That's all the setup you have to do. Members can make their own widgets by linking your page like so:

```html
https://cool-dude.example.com/
<a href="https://you.example.com/my-webring.html?cooldude-previous">Previous</a>
<a href="https://you.example.com/my-webring.html?cooldude-random">Random</a>
<a href="https://you.example.com/my-webring.html">Homepage</a>
<a href="https://you.example.com/my-webring.html?cooldude-next">Next</a>
```

## Documentation

**More in-depth and technical**. You likely won't have to go into here if you're just casually using Linkcircle.

### Options

You can set options by adding attributes to the script tag. They internally parse using JSON, so use JSON for the values:

```html
https://you.example.com/my-webring.html
<script
  src="/linkcircle.js"
  data-cache-lifespan="0"
  data-next-name='"proceed"'
  data-show-debug="true"
></script>
```

| Option                          | Description                                                                                                    | Default                                                                    |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `data-next-name`                | The name used for the next action. (like `?person-next`)                                                       | `"next"`                                                                   |
| `data-previous-name`            | The name used for the previous action. (like `?person-previous`)                                               | `"previous"`                                                               |
| `data-random-name`              | The name used for the random action. (like `?person-random`)                                                   | `"random"`                                                                 |
| `data-hide-page`                | Hides the page as Linkcircle waits for it to load when an action is being taken.                               | `true`                                                                     |
| `data-use-implicit-url`         | Allows for the use of implicit URLs (like `?person-next`).                                                     | `true`                                                                     |
| `data-explicit-url-key`         | The key used for explicit URLs (like `?lc=person-next`)                                                        | `"lc"`                                                                     |
| `data-show-error-message`       | Shows an error message when a member isn't found.                                                              | `true`                                                                     |
| `data-member-not-found-message` | The error message used when a member isn't found.                                                              | `"Webring error. This is likely an issue with the site you are visiting."` |
| `data-cache-lifespan`           | How long the cache lasts for in milliseconds.                                                                  | `1800000` (30 minutes)                                                     |
| `data-storage-prefix`           | The prefix used for the cache stored in localStorage.                                                          | `"linkcircle"`                                                             |
| `data-slug-attribute-name`      | The name used for the slug attribute you add to member links. Make sure to also update `data-member-selector`. | `"data-slug"`                                                              |
| `data-href-attribute-name`      | The name used for the href attribute you add to member links. Make sure to also update `data-member-selector`. | `"href"`                                                                   |
| `data-member-selector`          | The selector used to find member links.                                                                        | `"[href][data-slug]"`                                                      |
| `data-show-debug`               | Prints debug information into the console, like members found.                                                 | `false`                                                                    |
| `data-dry-run`                  | Runs like normal but won't redirect. Useful with `data-show-debug`.                                            | `false`                                                                    |

### Actions links (what the widget uses)

Action links tell Linkcircle to go next, previous, or random. It's just the `https://you.example.com/my-webring.html?cooldude-next` members add to their page to make their widget.

The main part is the `cooldude-next`. The first part is the slug, and the second part is the action. They're separated with the final dash found (so `cool-dude-next` works fine).

There are two types, implicit and explicit.

#### Implicit action link

```
https://example.com/?cooldude-next
```

They're shorter and arguably easier to understand for people not knowledgeable with URLs. This is ideal for people on the personal web with just a static site.

How Linkcircle reads it is by going through each search parameter's key and seeing if it matches an action. So, you can still add more search parameters, and Linkcircle will work fine:

```
https://example.com/?cooldude-next&whatever=you-want
```

If you use search parameters on your site more often, consider explicit action links. You can disable implicit links by setting `data-use-implicit-url` to `false`.

#### Explicit action link

```
https://example.com/?lc=cooldude-next
```

They're slightly longer, but are less confusing to work with when using search parameters. This feature works alongside implicit action links for any members that may want to use it.

You can change the key with `data-explicit-url-key`.

### Members

By default, you can make members by adding an element with both a `href` and a `data-slug`. The `href` is the member's URL to link to, and `data-slug` is a unique id each member uses in their action link. It's explained better in Getting Started.

At first, Linkcircle will wait for the page to load. If it didn't find any elements that matches the criteria, it'll then just wait for such elements to appear. This lets it support Zonelets!

Linkcircle will also hide the page as it loads if it detects an action link. This is done by `display: none`ing the `html` element. You can disable this by setting `data-hide-page` to `false`.

#### Caching

Having to wait for the entire page to load each time would suck, so Linkcircle caches any members it finds into LocalStorage. This is why you should put the script tag at the very top of your page; after the first run Linkcircle does not depend on the page to load and can get out fast.

The cache is updated when:

-   It's invalidated after a certain amount of time (default is 30 minutes).
-   It couldn't find a member in the cache.
-   The webring page is opened without an action link.
-   Linkcircle encounters an internal error.
