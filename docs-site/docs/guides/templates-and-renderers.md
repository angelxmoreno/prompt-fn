***

id: templates-and-renderers
sidebar\_position: 1
title: Templates & Renderers
----------------------------

prompt-fn ships with two rendering paths:

1. **Template functions** (default) – pass a function that receives the validated input and returns a string. Great for lightweight prompts and when you want to leverage TypeScript autocomplete.
2. **Eta templates** – hand Eta an input object plus a template name and let Eta render loops/partials.

Template functions
------------------

```ts
const prompt = definePrompt({
  ...,
  template: ({customer, issue}) => `Customer: ${customer}\nIssue: ${issue}`,
});
```

Because `template` is a function, TypeScript enforces the same structure as your `inputSchema`. No stringly-typed placeholders.

Eta templates
-------------

```ts
import {Eta} from 'eta';

const eta = new Eta({ views: path.join(import.meta.dir, 'templates') });

const prompt = definePrompt({
  ...,
  template: 'product-brief',
  eta,
});
```

* `template` becomes the Eta view name.
* Prompt input is passed as the Eta context (`<%= it.body %>` etc.).
* Use Eta when you need conditionals, loops, or shared partials. See `examples/templates/product-brief.eta` for a full example.

Tips
----

* Keep templates small and push reuse into helpers so TypeDoc docs stay readable.
* Avoid telling the LLM to “respond as JSON”; the AI SDK handles that instruction under the hood when you supply an `outputSchema`.
* When a template contains long text snippets, store them under `examples/templates` or `src/prompts` and load them via Eta to keep your TypeScript files tidy.
