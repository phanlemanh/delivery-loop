### S4 round 1 — wf_e17c9e05-943 (31 agent, 85,236 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-opus-5-5 | 14 | 13,086 | 28 | 1,002,776 | 190 |
| review:bugs | claude-opus-5-5 | 12 | 12,986 | 24 | 827,892 | 284 |
| synthesize:report | claude-sonnet-5-5 | 2 | 9,191 | 4 | 52,229 | 55 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 8,345 | 6 | 98,588 | 238 |
| review:measurement | claude-opus-5-5 | 6 | 6,367 | 12 | 312,684 | 132 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 5,103 | 12 | 171,743 | 810 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 3,935 | 14 | 213,769 | 972 |
| triage | claude-sonnet-5-5 | 2 | 3,006 | 4 | 37,978 | 22 |
| judge:E3:operational-feasibility | claude-sonnet-5-5 | 4 | 2,486 | 8 | 137,388 | 23 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 2,454 | 12 | 169,792 | 877 |
| judge:E3:domain-correctness | claude-sonnet-5-5 | 3 | 1,934 | 6 | 82,632 | 18 |
| judge:E3:spec-alignment | claude-sonnet-5-5 | 3 | 1,850 | 6 | 86,248 | 17 |
| machine:bash _acceptance/doi-soat-ban-giao/rang/ | claude-haiku-5-5 | 2 | 1,278 | 4 | 37,974 | 56 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,077 | 4 | 3,497 | 456 |
| machine:bash _acceptance/doi-soat-ban-giao/rang/ | claude-haiku-5-5 | 2 | 1,033 | 4 | 37,974 | 36 |
| machine:bash _acceptance/doi-soat-ban-giao/rang/ | claude-haiku-5-5 | 2 | 1,026 | 4 | 37,974 | 59 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 977 | 4 | 37,951 | 95 |
| machine:bash _acceptance/doi-soat-ban-giao/rang/ | claude-haiku-5-5 | 2 | 875 | 4 | 37,974 | 9 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 863 | 4 | 38,007 | 166 |
| machine:bash _acceptance/doi-soat-ban-giao/rang/ | claude-haiku-5-5 | 2 | 778 | 4 | 37,974 | 91 |
| machine:bash _acceptance/doi-soat-ban-giao/rang/ | claude-haiku-5-5 | 2 | 767 | 4 | 37,974 | 12 |
| machine:bash _acceptance/doi-soat-ban-giao/rang/ | claude-haiku-5-5 | 2 | 733 | 4 | 37,974 | 35 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 705 | 4 | 37,977 | 7 |
| machine:bash _acceptance/doi-soat-ban-giao/rang/ | claude-haiku-5-5 | 2 | 700 | 4 | 37,974 | 253 |
| machine:node tests/dieu-phoi/chay-buoc-ci.mjs | claude-haiku-5-5 | 2 | 646 | 4 | 6,994 | 495 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 630 | 4 | 38,007 | 104 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 529 | 4 | 37,951 | 12 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 522 | 4 | 38,007 | 112 |
| machine:node plugins/acceptance-gate/scripts/pro | claude-haiku-5-5 | 2 | 501 | 4 | 37,967 | 6 |
| machine:bash _acceptance/doi-soat-ban-giao/rang/ | claude-haiku-5-5 | 2 | 500 | 4 | 37,974 | 147 |
| capture:provenance | claude-sonnet-5-5 | 2 | 353 | 4 | 33,220 | 5 |


wall: 3700s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 8,345 | 98,588 | 239 | 07:54:14 | 07:58:13 |
| machine | 21 | 25,632 | 1,173,428 | 3618 | 07:54:14 | 08:54:32 |
| judge | 3 | 6,270 | 306,268 | 35 | 07:54:25 | 07:55:00 |
| review | 3 | 32,439 | 2,143,352 | 286 | 07:54:52 | 07:59:37 |
| triage | 1 | 3,006 | 37,978 | 22 | 08:54:32 | 08:54:54 |
| capture | 1 | 353 | 33,220 | 5 | 08:54:54 | 08:55:00 |
| synthesize | 1 | 9,191 | 52,229 | 55 | 08:55:00 | 08:55:55 |

- **claude-opus-5-5**: 3 agent · 32 calls · out 32,439 · in 64 · cache_read 2,143,352 · cache_create 292,870
- **claude-sonnet-5-5**: 7 agent · 19 calls · out 27,165 · in 38 · cache_read 528,283 · cache_create 361,661
- **claude-haiku-5-5**: 21 agent · 55 calls · out 25,632 · in 110 · cache_read 1,173,428 · cache_create 964,313

