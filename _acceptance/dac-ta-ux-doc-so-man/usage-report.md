### S4 round 1 — wf_62034127-ba0 (29 agent, 94,852 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 20 | 17,108 | 40 | 1,752,955 | 240 |
| review:conventions | claude-opus-5-5 | 21 | 14,703 | 42 | 1,832,154 | 206 |
| review:measurement | claude-opus-5-5 | 8 | 12,648 | 16 | 620,111 | 141 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 9,107 | 6 | 100,889 | 51 |
| synthesize:report | claude-sonnet-5-5 | 2 | 8,202 | 4 | 51,262 | 49 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 5,303 | 16 | 262,049 | 1059 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 4,815 | 14 | 216,719 | 900 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 4,418 | 16 | 297,135 | 949 |
| triage | claude-sonnet-5-5 | 2 | 3,144 | 4 | 37,838 | 30 |
| machine:bash _acceptance/dac-ta-ux-doc-so-man/ra | claude-haiku-5-5 | 2 | 1,778 | 4 | 38,077 | 10 |
| machine:node _acceptance/dac-ta-ux-doc-so-man/ra | claude-haiku-5-5 | 2 | 1,645 | 4 | 38,075 | 74 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,313 | 4 | 34,559 | 253 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,012 | 4 | 38,047 | 106 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 808 | 4 | 38,047 | 12 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 783 | 4 | 38,103 | 185 |
| machine:bash _acceptance/dac-ta-ux-doc-so-man/ra | claude-haiku-5-5 | 2 | 701 | 4 | 38,077 | 9 |
| machine:bash _acceptance/dac-ta-ux-doc-so-man/ra | claude-haiku-5-5 | 2 | 694 | 4 | 38,077 | 9 |
| machine:bash _acceptance/dac-ta-ux-doc-so-man/ra | claude-haiku-5-5 | 2 | 631 | 4 | 38,077 | 8 |
| machine:bash _acceptance/dac-ta-ux-doc-so-man/ra | claude-haiku-5-5 | 2 | 617 | 4 | 38,077 | 9 |
| machine:bash _acceptance/dac-ta-ux-doc-so-man/ra | claude-haiku-5-5 | 2 | 610 | 4 | 38,077 | 7 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 603 | 4 | 38,073 | 6 |
| machine:bash _acceptance/dac-ta-ux-doc-so-man/ra | claude-haiku-5-5 | 2 | 597 | 4 | 38,077 | 8 |
| machine:bash _acceptance/dac-ta-ux-doc-so-man/ra | claude-haiku-5-5 | 2 | 595 | 4 | 38,077 | 7 |
| machine:node plugins/acceptance-gate/scripts/pro | claude-haiku-5-5 | 2 | 559 | 4 | 38,063 | 6 |
| machine:bash _acceptance/dac-ta-ux-doc-so-man/ra | claude-haiku-5-5 | 2 | 547 | 4 | 38,077 | 19 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 533 | 4 | 38,103 | 105 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 531 | 4 | 38,103 | 127 |
| machine:bash _acceptance/dac-ta-ux-doc-so-man/ra | claude-haiku-5-5 | 2 | 475 | 4 | 38,077 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 372 | 4 | 33,320 | 8 |


wall: 3796s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 9,107 | 100,889 | 51 | 00:16:23 | 00:17:14 |
| machine | 22 | 29,568 | 1,495,846 | 3709 | 00:16:23 | 01:18:12 |
| review | 3 | 44,459 | 4,205,220 | 242 | 00:16:31 | 00:20:33 |
| triage | 1 | 3,144 | 37,838 | 30 | 01:18:13 | 01:18:43 |
| capture | 1 | 372 | 33,320 | 8 | 01:18:43 | 01:18:50 |
| synthesize | 1 | 8,202 | 51,262 | 49 | 01:18:51 | 01:19:40 |

- **claude-opus-5-5**: 3 agent · 49 calls · out 44,459 · in 98 · cache_read 4,205,220 · cache_create 368,952
- **claude-sonnet-5-5**: 4 agent · 9 calls · out 20,825 · in 18 · cache_read 223,309 · cache_create 211,824
- **claude-haiku-5-5**: 22 agent · 61 calls · out 29,568 · in 122 · cache_read 1,495,846 · cache_create 958,052

