# Relay: landing-page design

**Deliverable:** a page design and implementation handoff. The requested endpoint is this plan; implementation comes later.

## 1. What visitors should understand and do

A visitor should understand that Relay is a browser tool for small service businesses to collect customer requests, assign responsibility, and see request status. Their next action is **Request access**. These are product requirements reported in [BRIEF.md](BRIEF.md).

The page should answer four questions in order:

1. **Is this relevant to my business?** Show the audience, the customer-request problem, and Relay’s purpose together.
2. **How would I use it?** Follow one illustrative request through collection, assignment, and status tracking.
3. **What information stays with a request?** Show the request, owner, status, and conversation in a compact, comparable format.
4. **How do I take the next step?** Offer one access-request form, explain what submission means, and acknowledge that pricing is undecided.

**Working audience hypothesis:** the visitor manages or coordinates requests in a small service business and is evaluating whether Relay fits that work. The supplied notes identify the business type, but provide no audience interviews, traffic data, or observed usage. This proposed reading path is a design judgment.

## 2. Evidence and boundaries

| Status | Material | Consequence for this design |
| --- | --- | --- |
| Reported requirement | Relay collects customer requests, assigns responsibility, and shows status; the first action is to request access. [BRIEF.md](BRIEF.md) | These capabilities organize the page and its primary action. |
| Observed in supplied copy | “Requests arrive through messages and get lost,” “Give each request an owner,” “See what is waiting,” and “Keep the conversation together.” [BRIEF.md](BRIEF.md) | Preserve these meanings in the introduction, example, and information summary. Conversation support is a stated copy intention that the product owner should confirm before publication. |
| Observed draft claim; unsupported as a result | “Teams resolve requests twice as fast.” The brief supplies no study or customer evidence. [BRIEF.md](BRIEF.md) | Exclude this sentence, percentages, and speed guarantees from publishable copy. |
| Reported constraint | Pricing is undecided; brand assets are unavailable. [BRIEF.md](BRIEF.md) | Use an honest pricing note and a provisional typographic identity. |
| Reported preferences | Compact comparable columns, three annotated steps, and visible location in a hierarchy. [BRIEF.md](BRIEF.md) | Transfer each useful function as described below. |
| Unknown | Actual collection channels, integration behavior, exact status vocabulary, access availability, response timing, and submission service. | Avoid promises about automation, integrations, immediate activation, or delivery deadlines. Record the operating dependencies in section 8. |

Only the descriptive fragments in the brief were inspected. No original reference websites, screenshots, or live Relay interface were supplied or visited.

## 3. How the references inform the page

| Liked fragment | Useful function | Transfer to Relay | Boundary and rationale |
| --- | --- | --- | --- |
| Pricing columns with comparable inclusions | Scan the same attributes across several choices | A compact “What stays with each request” summary, using the same labels for each information type | There are no established tiers or prices to compare. The summary makes the product’s contents legible without presenting commercial packages. |
| One task explained in three annotated steps | Understand a concrete sequence | Use one fictional customer request across three numbered steps; annotate the part that changes at each step | Show product concepts with a clearly labeled illustration. Avoid presenting fabricated screenshots as evidence of existing behavior. |
| Nested documentation with visible location | Know where you are and where to continue | Descriptive section headings, direct section links, and a current-section indication on wider layouts | This page contains a short, linear explanation. There is no established parent–child content hierarchy requiring a documentation tree or breadcrumbs. |

These choices combine explanation, comparison, and orientation in one coherent page. They are contextual design decisions rather than measured usability findings.

## 4. Page structure and draft copy

### Header and orientation

Use a text wordmark **Relay**, links **How it works** (`#how-it-works`) and **What stays together** (`#request-details`), plus a visually prominent **Request access** link (`#request-access`). The wordmark returns to `#top`.

Each destination has a matching heading. On desktop, a compact header can remain visible and underline the current section, with an accessible current-location indication. Scrolling updates this visual indication without moving focus or adding browser-history entries. Explicit section links use normal URL fragments so direct entry and Back/Forward remain meaningful. Account for the header when positioning an anchor target.

### A. Hero — understand the product

**Eyebrow:** “Customer requests for small service businesses”

**Heading:** “Give every customer request an owner.”

**Body:** “Relay brings customer requests, responsibility, and status into one browser tool. See what needs attention and keep the conversation with the request.”

**Primary action:** “Request access”

**Secondary text link:** “See how it works”

**Access note:** “Pricing is still being decided.”

Place the audience, heading, explanation, and primary action together. Beside them on a wide screen, show an illustrative request containing a title, an owner, a status, and a short conversation excerpt. Label it **Illustrative request**. On small screens, put it after the introduction and primary action.

The draft conversation sentence depends on the product owner’s confirmation of the supplied copy intention. If that capability is not available, revise both this sentence and the conversation portion of the illustration before publication.

### B. How it works — explain one concrete task

**Heading:** “Follow one request from arrival to resolution.”

**Introduction:** “When requests arrive through messages, it can be hard to keep track of who is handling each one. Here is how a request can be organized in Relay.”

Use the same fictional request throughout: **“Replace the reception light.”** Keep the example compact and visible; no carousel, autoplay, or separate demo action is needed.

| Step | Draft explanation | Illustration and annotation |
| --- | --- | --- |
| **1. Collect the request** | “Keep what the customer needs in a request you can follow.” | Show the request title and a brief description. Annotation: **Request — what needs doing**. Depict a recorded request without implying a particular import method or channel integration. |
| **2. Give it an owner** | “Make responsibility visible to the team.” | Retain the same title; add **Owner: Sam**. Annotation: **Owner — who is responsible**. |
| **3. See what is waiting** | “Use the status and conversation to follow the next step.” | Retain the same request and owner; show **Status: Waiting** and the example note **“Waiting for a preferred visit time.”** Annotation: **Status — where the work stands**. A small final example label **Resolved** explains the intended endpoint. |

“Sam,” the request text, the conversation excerpt, and “Waiting”/“Resolved” are illustrative content. The product owner must confirm the actual status labels. This sequence does not promise automatic status changes or automatic resolution.

### C. What stays with each request — compare information clearly

**Heading:** “See the parts of a request together.”

**Introduction:** “Each part answers a practical question about the work.”

Present the following as aligned columns on desktop. Keep each label and its explanation visible. This is a concise information summary; each column has the same two attributes, rather than a separate feature page.

| Attribute | Request | Owner | Status | Conversation |
| --- | --- | --- | --- | --- |
| **Question answered** | What needs doing? | Who is responsible? | Where does the work stand? | What has been discussed? |
| **Illustrative content** | Replace the reception light | Sam | Waiting | Preferred visit time |

On mobile, stack the four items in this order, repeating **Question answered** and **Illustrative content** within each item. Preserve all information and a logical reading sequence. If implemented as a table, maintain programmatic header associations; if it becomes a labeled list, retain the same relationships in text. [W1]

### D. Request access — complete the visitor’s task

**Heading:** “Request access to Relay”

**Introduction:** “Leave your email so we can contact you about access.”

**Visible expectation:** “Pricing is still being decided. Sending a request does not activate an account.”

Use one inline form with a required **Email address** field and an optional **Business name** field. Mark the optional field explicitly. The business name gives the access team context; it must not become a qualification gate without a product decision. Accept an appropriate personal or business email address rather than restricting email domains.

**Submit label:** “Request access”

**Privacy text:** link to the product’s actual privacy notice when supplied; its wording and destination are publication dependencies. Do not invent a live legal URL or an unrelated marketing opt-in.

Every access CTA reaches this same form. There is no additional pricing step, checkout, account-password step, or booking requirement in the design. Visitors can read other sections and return while retaining form input in the current document.

### Footer

Use the Relay wordmark and the verified privacy destination. Add a contact link only when a working address is supplied. Keep unsupported customer logos, testimonials, security badges, and adoption counts out of the page.

## 5. Access-request behavior and recovery

This is planned behavior. No form service or runtime has been built or exercised.

| State or event | Visitor sees and can do | Data and transition |
| --- | --- | --- |
| Initial entry, including a direct `#request-access` link | Form heading, access/pricing explanation, labeled fields, and submit action | All context needed to submit is present at the destination. |
| Access CTA selected | Move to the access heading, making it the programmatic focus target; the next form control follows in keyboard order | Keep existing input. A plain anchor remains a usable fallback. |
| Missing or invalid email | Show a specific message beside Email address and an error summary with a link to that field | Preserve all input; associate the message with the field and focus the summary. Example: “Enter an email address, such as name@example.com.” |
| Sending | Show “Sending your request…” and a busy state on the form | Keep input and prevent repeated submissions while this attempt is pending. The rest of the page remains available. |
| Confirmed receipt | Show “Request received” and “We’ll contact [email] about access.” | Show success only after the service confirms receipt. Present the email as text, announce the result, and provide “Use a different email” to return to an editable form with the business name retained. |
| Failure or uncertain response | Show “We couldn’t confirm your request. Your details are still here. Try again.” | Preserve input and re-enable submission. Retry must reuse a stable submission identifier so a timeout does not create duplicate requests. |
| Existing request for that email | Show the same receipt acknowledgement if the service accepts it | Reuse/update the existing request rather than creating repeated leads. Do not expose account-membership details. |
| Leaving and returning | Normal browser navigation remains available | Preserve input during same-document section navigation and resizing. Cross-page/session restoration is not promised; do not persist email in browser storage by default. |

The email follow-up is a proposed operating model and requires an accountable access team. Do not promise a response date, an invitation, a free plan, or an automatic email until those processes exist. Clear success and correction feedback follow the W3C form-notification guidance. [W2]

## 6. Presentation, mobile behavior, and accessibility

**Provisional visual direction:** a calm, work-focused page using a text wordmark, a system sans-serif font, white content surfaces, dark ink, and a restrained teal accent. Illustrative request content carries the visual story; decorative photography is unnecessary for the supplied material.

| Token | Value | Intended use |
| --- | --- | --- |
| Main text | `#16202A` | Headings and body text on white |
| Secondary text | `#4B5563` | Supporting copy on white |
| Accent | `#006A60` | White-text primary actions; selected-section text on white |
| Page surface | `#F7F8FA` | Background outside white content surfaces |
| Content surface | `#FFFFFF` | Form and example surfaces |

Use a readable content width of approximately 1120 CSS pixels with flexible outer padding. This is a provisional layout choice. The hero uses two columns when its copy and example fit comfortably; the three-step explanation uses three aligned items. Both stack in reading order as available space narrows. Let content determine the breakpoint.

On small screens, place Relay and the access action in a first row and the two section links below. Keep this header in normal document flow so enlarged text and the on-screen keyboard retain usable space. The form stays a single column, and its submit action remains in document flow. All explanatory content stays visible.

Use one `h1`, descriptive section headings, meaningful landmarks, visible form labels, and a logical source order. Every action must work with a keyboard and have visible focus; status must remain understandable without color. Allow text enlargement and reflow without losing information or actions. Check the finished page against the applicable WCAG 2.2 criteria, including relationships, reading sequence, contrast, keyboard access, focus, reflow, errors, and status messages. [W1] These are design requirements; complete accessibility has not been verified.

## 7. Review and acceptance checks

### Checks performed on this plan

| Expectation | Method and conditions | Observation | Status |
| --- | --- | --- | --- |
| Required meanings have a place | Compare the full supplied BRIEF.md with sections 1–6 | Collection, ownership, waiting/status, conversation, access request, undecided pricing, and each reference preference are mapped. Conversation and exact statuses retain confirmation dependencies. | `supported_in_conditions` |
| Each reference is transferred with a task rationale | Review the three supplied descriptions against section 3 | Comparable information, a three-step example, and visible orientation each have a defined role. No original reference site is claimed as inspected. | `supported_in_conditions` |
| A visitor can understand the product and reach the proposed action | Document walkthrough from hero and from direct access entry | The plan includes product explanation, one consistent CTA destination, form context, and confirmation after receipt. | `supported_in_conditions` |
| Meaningful recovery is specified | Document walkthrough for invalid email, pending submission, failure, timeout, repeat submission, and email correction | The plan specifies feedback, retained input, and continuation for each named case. Backend support remains a dependency. | `supported_in_conditions` |
| Copy respects evidence | Review proposed visitor-facing copy and the evidence table | No unsupported speed metric, tariff, integration, or activation deadline appears as publishable fact. | `supported_in_conditions` |
| Artifact structure is consistent | Python inspection of the saved Markdown | One document title, eight numbered sections, all three planned steps, resolvable local Markdown links, and consistent column counts in each table were confirmed. | `supported_in_conditions` |
| Proposed text-color pairs are readable by the contrast calculation | Calculate relative luminance for the three specified foreground/background pairs | Main text on white: **16.48:1**; secondary text on white: **7.56:1**; white text on teal: **6.50:1**. This verifies these proposed pairs only; rendered states, focus styling, and other combinations remain unverified. | `supported_in_conditions` |

These are checks of a written design. They do not establish visitor comprehension, conversion, real submission behavior, or accessibility of an implementation.

### Checks for the later implementation

All observations below remain empty because implementation is a later step.

| Expectation | Method | Conditions | Observation | Status |
| --- | --- | --- | --- | --- |
| Every CTA and section link reaches the correct destination; Back/Forward remains coherent | Browser navigation and keyboard walkthrough | Desktop and mobile widths; direct fragment entry and same-document navigation | | `unverified` |
| Submission and recovery follow section 5 | Exercise actual service responses and controlled failure cases | Valid, invalid, duplicate, delayed, failed, and uncertain submissions | | `unverified` |
| Content, form values, and actions survive layout changes | Resize, enlarge text, and check narrow reflow | Real browser; long copy; approximately 320 CSS-pixel viewport; mobile keyboard visible | | `unverified` |
| Labels, sequence, focus, errors, and notifications are exposed accessibly | Inspect DOM/accessibility tree; keyboard and screen-reader checks | The complete access path and changing form states | | `unverified` |
| The audience understands what Relay does and what an access request means | Short task observation with relevant business representatives | Ask them to explain the product and pursue access without directing their choices | | `unverified` |

No browser execution was attempted in this planning task. No usable local browser is available, and the project has no implemented interface. The planned runtime checks need the future build and a supported browser environment.

## 8. Dependencies and handoff

| Owner | Resolve before publication | Effect |
| --- | --- | --- |
| Product owner | Confirm conversation support, collection behavior, and status terminology | Finalize the example and ensure the page matches available product behavior. |
| Access owner | Confirm who receives requests, who follows up, and what access is available | Make the proposed email follow-up and success copy operationally true. No deadline is assumed. |
| Implementation owner | Provide a real form endpoint, receipt confirmation, duplicate protection, and controlled failure behavior | Make the form states work without falsely confirming delivery. |
| Product/legal owner | Supply a valid privacy notice and approved data-use wording | Complete the form and footer links. |
| Design/implementation owner | Apply or revise the provisional type, color, and layout choices; perform the planned checks | Turn this design into an accessible responsive page. |

Undecided pricing does not block this design: the page states that decision openly. Implementation can proceed from this handoff when requested, with the publication dependencies resolved before the relevant copy and form are released.

## Sources

- **Project evidence:** [BRIEF.md](BRIEF.md), inspected in full. The three reference fragments are descriptions only.
- **Design workflow:** the supplied local `design-interface` skill and its resolved `inspect-interface`, `plan-interface`, and `check-interface` modules; relevant materials, structure, forms/states, web, and evidence guidance were read. These guide the process and do not constitute audience research.
- **[W1]** [W3C — Web Content Accessibility Guidelines 2.2](https://www.w3.org/TR/WCAG22/), consulted for the web-specific accessibility requirements and future check scope.
- **[W2]** [W3C WAI — Forms Tutorial: User Notifications](https://www.w3.org/WAI/tutorials/forms/notifications/), consulted for success feedback, specific errors, and correction links.
