### S4 round 1 — wf_56f00358-6bc (27 agent, 154,474 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 37 | 23,914 | 74 | 3,670,774 | 408 |
| review:conventions | claude-opus-5-5 | 20 | 15,854 | 40 | 1,764,360 | 216 |
| review:measurement | claude-opus-5-5 | 17 | 15,220 | 34 | 1,245,521 | 205 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 12,275 | 6 | 46,507 | 544 |
| machine:bash _acceptance/release-3-0-0/vi-phan-h | claude-haiku-5-5 | 10 | 11,083 | 20 | 433,284 | 781 |
| synthesize:report | claude-sonnet-5-5 | 2 | 10,878 | 4 | 57,182 | 61 |
| judge:E10:spec-alignment | claude-sonnet-5-5 | 6 | 9,308 | 12 | 325,156 | 66 |
| judge:E10:domain-correctness | claude-sonnet-5-5 | 8 | 9,179 | 16 | 512,593 | 68 |
| judge:E10:operational-feasibility | claude-sonnet-5-5 | 9 | 8,332 | 18 | 583,188 | 67 |
| triage | claude-sonnet-5-5 | 2 | 5,541 | 4 | 40,303 | 39 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 4,172 | 16 | 272,836 | 987 |
| machine:bash _acceptance/release-3-0-0/cay-kich- | claude-haiku-5-5 | 4 | 4,051 | 8 | 130,831 | 195 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 5 | 3,791 | 10 | 132,610 | 711 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 3 | 3,473 | 6 | 84,322 | 29 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 4 | 2,959 | 8 | 130,293 | 117 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 2,408 | 12 | 177,765 | 882 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,985 | 4 | 37,683 | 99 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,823 | 4 | 37,683 | 14 |
| machine:bash _acceptance/release-3-0-0/hang-loi. | claude-haiku-5-5 | 2 | 1,512 | 4 | 37,734 | 16 |
| machine:bash _acceptance/release-3-0-0/guide-ci. | claude-haiku-5-5 | 2 | 1,447 | 4 | 37,734 | 28 |
| machine:GIT_GLOB_PATHSPECS=1 bash _acceptance/re | claude-haiku-5-5 | 2 | 1,065 | 4 | 37,830 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 960 | 4 | 34,323 | 195 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 859 | 4 | 37,692 | 253 |
| machine:bash _acceptance/release-3-0-0/don-dau-v | claude-haiku-5-5 | 2 | 801 | 4 | 37,699 | 33 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 612 | 4 | 37,739 | 118 |
| machine:node plugins/acceptance-gate/scripts/pro | claude-haiku-5-5 | 2 | 605 | 4 | 37,699 | 5 |
| capture:provenance | claude-sonnet-5-5 | 2 | 367 | 4 | 33,060 | 5 |


wall: 3516s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| review | 3 | 54,988 | 6,680,655 | 417 | 17:17:24 | 17:24:21 |
| baseline | 1 | 12,275 | 46,507 | 544 | 17:17:24 | 17:26:28 |
| machine | 17 | 43,606 | 1,735,757 | 3411 | 17:17:24 | 18:14:15 |
| judge | 3 | 26,819 | 1,420,937 | 68 | 17:17:24 | 17:18:32 |
| triage | 1 | 5,541 | 40,303 | 39 | 18:14:15 | 18:14:54 |
| capture | 1 | 367 | 33,060 | 5 | 18:14:54 | 18:14:59 |
| synthesize | 1 | 10,878 | 57,182 | 61 | 18:14:59 | 18:16:00 |

- **claude-opus-5-5**: 3 agent · 74 calls · out 54,988 · in 148 · cache_read 6,680,655 · cache_create 354,010
- **claude-sonnet-5-5**: 7 agent · 32 calls · out 55,880 · in 64 · cache_read 1,597,989 · cache_create 579,433
- **claude-haiku-5-5**: 17 agent · 60 calls · out 43,606 · in 120 · cache_read 1,735,757 · cache_create 816,274

### S4 round 2 — wf_afc2c095-3b2 (25 agent, 107,284 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 19 | 11,412 | 38 | 1,267,786 | 184 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 11,106 | 6 | 45,398 | 537 |
| synthesize:report | claude-sonnet-5-5 | 4 | 10,201 | 8 | 194,779 | 60 |
| judge:E10:domain-correctness | claude-sonnet-5-5 | 6 | 9,560 | 12 | 332,023 | 66 |
| judge:E10:operational-feasibility | claude-sonnet-5-5 | 6 | 8,872 | 12 | 316,787 | 61 |
| judge:E10:spec-alignment | claude-sonnet-5-5 | 8 | 8,459 | 16 | 494,272 | 60 |
| review:measurement | claude-opus-5-5 | 9 | 8,028 | 18 | 452,251 | 99 |
| review:conventions | claude-opus-5-5 | 9 | 5,632 | 18 | 445,316 | 76 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 4,489 | 14 | 228,490 | 832 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs | claude-haiku-5-5 | 4 | 3,732 | 8 | 130,369 | 199 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 3 | 3,667 | 6 | 84,387 | 28 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 4 | 3,591 | 8 | 89,202 | 716 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 3,590 | 14 | 223,386 | 977 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 3 | 2,221 | 6 | 84,453 | 113 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,951 | 4 | 37,656 | 97 |
| triage | claude-sonnet-5-5 | 2 | 1,807 | 4 | 36,961 | 15 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,751 | 4 | 37,656 | 14 |
| machine:bash _acceptance/release-3-0-0/hang-loi. | claude-haiku-5-5 | 2 | 1,547 | 4 | 37,707 | 17 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,266 | 4 | 37,665 | 239 |
| machine:bash _acceptance/release-3-0-0/duong-cu- | claude-haiku-5-5 | 2 | 968 | 4 | 37,709 | 34 |
| machine:GIT_GLOB_PATHSPECS=1 bash _acceptance/re | claude-haiku-5-5 | 2 | 891 | 4 | 37,803 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 877 | 4 | 34,296 | 195 |
| machine:node plugins/acceptance-gate/scripts/pro | claude-haiku-5-5 | 2 | 702 | 4 | 37,672 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 599 | 4 | 37,712 | 110 |
| capture:provenance | claude-sonnet-5-5 | 2 | 365 | 4 | 33,033 | 5 |


wall: 3407s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| review | 3 | 25,072 | 2,165,353 | 187 | 22:46:21 | 22:49:28 |
| baseline | 1 | 11,106 | 45,398 | 537 | 22:46:21 | 22:55:19 |
| judge | 3 | 26,891 | 1,143,082 | 66 | 22:46:21 | 22:47:27 |
| machine | 15 | 31,842 | 1,176,163 | 3327 | 22:46:21 | 23:41:48 |
| triage | 1 | 1,807 | 36,961 | 15 | 23:41:48 | 23:42:03 |
| capture | 1 | 365 | 33,033 | 5 | 23:42:03 | 23:42:08 |
| synthesize | 1 | 10,201 | 194,779 | 60 | 23:42:08 | 23:43:08 |

- **claude-opus-5-5**: 3 agent · 37 calls · out 25,072 · in 74 · cache_read 2,165,353 · cache_create 229,002
- **claude-sonnet-5-5**: 7 agent · 31 calls · out 50,370 · in 62 · cache_read 1,453,253 · cache_create 563,768
- **claude-haiku-5-5**: 15 agent · 46 calls · out 31,842 · in 92 · cache_read 1,176,163 · cache_create 726,636

### S4 round 3 — wf_2c95af56-a1f (21 agent, 76,664 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| judge:E10:operational-feasibility | claude-sonnet-5-5 | 11 | 9,388 | 22 | 798,955 | 72 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 9,294 | 6 | 43,836 | 529 |
| judge:E10:spec-alignment | claude-sonnet-5-5 | 7 | 8,389 | 14 | 397,467 | 58 |
| synthesize:report | claude-sonnet-5-5 | 2 | 8,085 | 4 | 51,249 | 47 |
| judge:E10:domain-correctness | claude-sonnet-5-5 | 9 | 7,449 | 18 | 521,678 | 55 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 5,644 | 16 | 270,193 | 1021 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 4,491 | 12 | 177,547 | 905 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 3 | 3,629 | 6 | 84,699 | 30 |
| review:bugs | claude-opus-5-5 | 7 | 3,471 | 14 | 306,785 | 234 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 4 | 3,219 | 8 | 130,601 | 124 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,058 | 4 | 37,782 | 97 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,788 | 4 | 37,782 | 15 |
| review:measurement | claude-opus-5-5 | 4 | 1,657 | 8 | 125,350 | 28 |
| review:conventions | claude-opus-5-5 | 5 | 1,618 | 10 | 168,502 | 29 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 4 | 1,455 | 8 | 89,115 | 744 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,361 | 4 | 37,791 | 245 |
| machine:GIT_GLOB_PATHSPECS=1 bash _acceptance/re | claude-haiku-5-5 | 2 | 960 | 4 | 37,929 | 6 |
| machine:node plugins/acceptance-gate/scripts/pro | claude-haiku-5-5 | 2 | 900 | 4 | 37,798 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 855 | 4 | 34,422 | 190 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 593 | 4 | 37,838 | 131 |
| capture:provenance | claude-sonnet-5-5 | 2 | 360 | 4 | 33,159 | 5 |


wall: 3559s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 9,294 | 43,836 | 529 | 00:17:51 | 00:26:40 |
| judge | 3 | 25,226 | 1,718,100 | 73 | 00:17:51 | 00:19:04 |
| machine | 12 | 26,953 | 1,013,497 | 3507 | 00:17:51 | 01:16:18 |
| review | 3 | 6,746 | 600,637 | 237 | 00:17:51 | 00:21:48 |
| capture | 1 | 360 | 33,159 | 5 | 01:16:18 | 01:16:23 |
| synthesize | 1 | 8,085 | 51,249 | 47 | 01:16:23 | 01:17:10 |

- **claude-sonnet-5-5**: 6 agent · 34 calls · out 42,965 · in 68 · cache_read 1,846,344 · cache_create 503,689
- **claude-haiku-5-5**: 12 agent · 39 calls · out 26,953 · in 78 · cache_read 1,013,497 · cache_create 601,209
- **claude-opus-5-5**: 3 agent · 16 calls · out 6,746 · in 32 · cache_read 600,637 · cache_create 151,852

