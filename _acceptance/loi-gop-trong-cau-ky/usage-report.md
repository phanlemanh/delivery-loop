### S3 execute-parallel (việc 2, việc 3) — wf_6e13e6ab-28f (2 agent, 228,673 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| exec:Task 3 | claude-fable-5-2 | 75 | 141,363 | 150 | 21,735,578 | 3006 |
| exec:Task 2 | claude-fable-5-2 | 61 | 87,310 | 124 | 15,397,148 | 2261 |


wall: 3007s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| exec | 2 | 228,673 | 37,132,726 | 3007 | 02:40:41 | 03:30:47 |

- **claude-fable-5-2**: 2 agent · 136 calls · out 228,673 · in 274 · cache_read 37,132,726 · cache_create 1,747,133

### S4 round 1 — wf_390bfc5b-a79 (24 agent, 75,901 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-opus-5-5 | 22 | 15,002 | 44 | 1,758,970 | 228 |
| review:bugs | claude-opus-5-5 | 18 | 14,877 | 36 | 1,264,264 | 217 |
| review:measurement | claude-opus-5-5 | 6 | 9,064 | 12 | 435,380 | 117 |
| synthesize:report | claude-sonnet-5-5 | 2 | 9,014 | 4 | 57,189 | 55 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 6,544 | 6 | 94,768 | 47 |
| triage | claude-sonnet-5-5 | 2 | 2,579 | 4 | 38,275 | 19 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 1,384 | 4 | 37,334 | 131 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 1,270 | 4 | 37,363 | 50 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,228 | 4 | 37,235 | 10 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,200 | 4 | 37,221 | 11 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,193 | 4 | 37,235 | 11 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,192 | 4 | 37,277 | 10 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,138 | 4 | 37,221 | 8 |
| machine:bash -c 'LGCK_CASES=LG-AC2-im,LG-dot-bie | claude-haiku-5-5 | 2 | 1,135 | 4 | 37,300 | 203 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,128 | 4 | 37,277 | 11 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,101 | 4 | 37,235 | 12 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,046 | 4 | 33,814 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,026 | 4 | 37,277 | 9 |
| machine:bash -c 'LGCK_CASES=LG-AC1-bat,LG-AC3-kh | claude-haiku-5-5 | 2 | 1,022 | 4 | 37,358 | 109 |
| machine:bash -c 'LGCK_CASES=LG-AC4-luat,LG-AC4-p | claude-haiku-5-5 | 2 | 987 | 4 | 37,325 | 9 |
| machine:bash -c 'LGCK_CASES=LG-AC5-vong-khep,LG- | claude-haiku-5-5 | 2 | 889 | 4 | 37,322 | 8 |
| machine:node plugins/acceptance-gate/scripts/pro | claude-haiku-5-5 | 2 | 846 | 4 | 37,237 | 11 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 732 | 4 | 37,247 | 10 |
| capture:provenance | claude-sonnet-5-5 | 2 | 304 | 4 | 32,569 | 5 |


wall: 308s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| review | 3 | 38,943 | 3,458,614 | 228 | 03:36:27 | 03:40:15 |
| baseline | 1 | 6,544 | 94,768 | 48 | 03:36:27 | 03:37:14 |
| machine | 17 | 18,517 | 630,278 | 205 | 03:36:27 | 03:39:51 |
| triage | 1 | 2,579 | 38,275 | 19 | 03:40:15 | 03:40:34 |
| capture | 1 | 304 | 32,569 | 5 | 03:40:34 | 03:40:40 |
| synthesize | 1 | 9,014 | 57,189 | 55 | 03:40:40 | 03:41:34 |

- **claude-opus-5-5**: 3 agent · 46 calls · out 38,943 · in 92 · cache_read 3,458,614 · cache_create 329,825
- **claude-sonnet-5-5**: 4 agent · 9 calls · out 18,441 · in 18 · cache_read 222,801 · cache_create 222,359
- **claude-haiku-5-5**: 17 agent · 34 calls · out 18,517 · in 68 · cache_read 630,278 · cache_create 659,411

### S4 round 2 — wf_22ecd32b-019 (16 agent, 30,199 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 10 | 5,819 | 20 | 353,375 | 1128 |
| synthesize:report | claude-sonnet-5-5 | 2 | 4,566 | 4 | 53,366 | 26 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 4,101 | 14 | 221,408 | 1070 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 3,733 | 12 | 174,941 | 799 |
| review:bugs | claude-opus-5-5 | 6 | 2,829 | 12 | 231,489 | 44 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,500 | 4 | 37,257 | 14 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,224 | 4 | 37,257 | 99 |
| review:conventions | claude-opus-5-5 | 4 | 1,131 | 8 | 121,848 | 21 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 951 | 4 | 33,850 | 280 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 787 | 4 | 37,313 | 218 |
| review:measurement | claude-opus-5-5 | 3 | 755 | 6 | 79,536 | 17 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 705 | 4 | 37,283 | 5 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 676 | 4 | 37,313 | 150 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 641 | 4 | 37,313 | 108 |
| machine:node plugins/acceptance-gate/scripts/pro | claude-haiku-5-5 | 2 | 474 | 4 | 37,273 | 5 |
| capture:provenance | claude-sonnet-5-5 | 2 | 307 | 4 | 32,605 | 4 |


wall: 3909s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 11 | 20,611 | 1,044,583 | 3878 | 03:49:21 | 04:53:59 |
| review | 3 | 4,715 | 432,873 | 47 | 03:49:21 | 03:50:08 |
| capture | 1 | 307 | 32,605 | 5 | 04:53:59 | 04:54:04 |
| synthesize | 1 | 4,566 | 53,366 | 26 | 04:54:04 | 04:54:30 |

- **claude-haiku-5-5**: 11 agent · 39 calls · out 20,611 · in 78 · cache_read 1,044,583 · cache_create 546,338
- **claude-sonnet-5-5**: 2 agent · 4 calls · out 4,873 · in 8 · cache_read 85,971 · cache_create 109,417
- **claude-opus-5-5**: 3 agent · 13 calls · out 4,715 · in 26 · cache_read 432,873 · cache_create 145,199

