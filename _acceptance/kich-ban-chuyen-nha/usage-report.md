### S4 round 1 — wf_2444d1c7-c5f (30 agent, 110,810 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 15 | 20,487 | 32 | 1,348,467 | 231 |
| review:measurement | claude-opus-5-5 | 14 | 19,160 | 28 | 1,194,317 | 260 |
| review:conventions | claude-opus-5-5 | 13 | 16,004 | 26 | 1,112,204 | 180 |
| synthesize:report | claude-sonnet-5-5 | 2 | 14,482 | 4 | 62,211 | 82 |
| triage | claude-sonnet-5-5 | 2 | 5,452 | 4 | 42,616 | 41 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 4,732 | 6 | 91,042 | 44 |
| judge:E10j:domain-correctness | claude-sonnet-5-5 | 3 | 2,110 | 8 | 88,566 | 25 |
| judge:E10j:spec-alignment | claude-sonnet-5-5 | 3 | 1,993 | 8 | 92,182 | 24 |
| judge:E10j:operational-feasibility | claude-sonnet-5-5 | 2 | 1,819 | 4 | 37,943 | 20 |
| refute:don-nha.test.mjs | claude-sonnet-5-5 | 5 | 1,743 | 10 | 166,247 | 24 |
| machine:node migration/kich-ban/thuoc-that.mjs | claude-haiku-5-5 | 2 | 1,688 | 4 | 37,939 | 29 |
| refute:don-nha.test.mjs | claude-sonnet-5-5 | 7 | 1,647 | 14 | 260,469 | 35 |
| refute:lop-do.mjs | claude-sonnet-5-5 | 4 | 1,591 | 8 | 128,485 | 23 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,436 | 4 | 37,945 | 8 |
| machine:node --test migration/kich-ban/don-nha.t | claude-haiku-5-5 | 2 | 1,343 | 4 | 37,939 | 36 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,337 | 4 | 37,945 | 8 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,263 | 4 | 37,931 | 8 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,227 | 4 | 37,945 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,206 | 4 | 37,987 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,200 | 4 | 37,987 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,163 | 4 | 37,987 | 7 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,059 | 4 | 34,640 | 7 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,031 | 4 | 37,931 | 7 |
| refute:evals.yaml | claude-sonnet-5-5 | 3 | 1,020 | 6 | 80,937 | 15 |
| refute:don-nha.mjs | claude-sonnet-5-5 | 3 | 1,015 | 6 | 80,858 | 20 |
| machine:node migration/kich-ban/thuoc-that.mjs - | claude-haiku-5-5 | 2 | 969 | 4 | 37,943 | 61 |
| machine:node migration/kich-ban/thuoc-that.mjs - | claude-haiku-5-5 | 2 | 809 | 4 | 37,945 | 31 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 806 | 4 | 37,957 | 7 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 660 | 4 | 37,932 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 358 | 4 | 33,424 | 8 |


wall: 430s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 4,732 | 91,042 | 44 | 13:34:35 | 13:35:19 |
| judge | 3 | 5,922 | 218,691 | 27 | 13:34:35 | 13:35:02 |
| machine | 15 | 17,197 | 565,953 | 80 | 13:34:35 | 13:35:55 |
| review | 3 | 55,651 | 3,654,988 | 262 | 13:34:35 | 13:38:57 |
| triage | 1 | 5,452 | 42,616 | 41 | 13:38:57 | 13:39:38 |
| refute | 5 | 7,016 | 716,996 | 36 | 13:39:39 | 13:40:15 |
| capture | 1 | 358 | 33,424 | 8 | 13:40:15 | 13:40:23 |
| synthesize | 1 | 14,482 | 62,211 | 82 | 13:40:23 | 13:41:45 |

- **claude-opus-5-5**: 3 agent · 42 calls · out 55,651 · in 86 · cache_read 3,654,988 · cache_create 370,648
- **claude-sonnet-5-5**: 12 agent · 39 calls · out 37,962 · in 82 · cache_read 1,164,980 · cache_create 604,830
- **claude-haiku-5-5**: 15 agent · 30 calls · out 17,197 · in 60 · cache_read 565,953 · cache_create 595,140

### S4 round 2 — wf_304d110c-c13 (26 agent, 91,735 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 12 | 15,879 | 24 | 859,778 | 238 |
| review:measurement | claude-opus-5-5 | 11 | 11,992 | 22 | 712,795 | 142 |
| review:conventions | claude-opus-5-5 | 13 | 11,917 | 26 | 733,779 | 142 |
| synthesize:report | claude-sonnet-5-5 | 2 | 10,089 | 4 | 57,057 | 62 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 5,506 | 16 | 270,766 | 996 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 4,732 | 6 | 91,564 | 36 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 4,187 | 12 | 181,010 | 836 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 4 | 3,896 | 8 | 90,728 | 788 |
| triage | claude-sonnet-5-5 | 2 | 2,316 | 4 | 38,016 | 22 |
| judge:E10j:spec-alignment | claude-sonnet-5-5 | 3 | 2,063 | 6 | 92,695 | 22 |
| judge:E10j:operational-feasibility | claude-sonnet-5-5 | 2 | 1,987 | 4 | 38,204 | 19 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,962 | 4 | 38,192 | 99 |
| judge:E10j:domain-correctness | claude-sonnet-5-5 | 2 | 1,927 | 4 | 34,586 | 19 |
| refute:kiem-cho.mjs | claude-sonnet-5-5 | 3 | 1,772 | 6 | 79,851 | 25 |
| machine:node migration/kich-ban/thuoc-that.mjs | claude-haiku-5-5 | 2 | 1,543 | 4 | 38,200 | 43 |
| machine:node --test migration/kich-ban/don-nha.t | claude-haiku-5-5 | 2 | 1,413 | 4 | 38,200 | 46 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,347 | 4 | 34,901 | 247 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,041 | 4 | 38,248 | 90 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 982 | 4 | 38,192 | 12 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 963 | 4 | 38,248 | 170 |
| machine:node migration/kich-ban/thuoc-that.mjs - | claude-haiku-5-5 | 2 | 924 | 4 | 38,204 | 69 |
| machine:node migration/kich-ban/thuoc-that.mjs - | claude-haiku-5-5 | 2 | 858 | 4 | 38,206 | 11 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 753 | 4 | 38,218 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 699 | 4 | 38,248 | 118 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 627 | 4 | 38,193 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 360 | 4 | 33,685 | 8 |


wall: 3487s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| review | 3 | 39,788 | 2,306,352 | 240 | 13:57:26 | 14:01:26 |
| machine | 15 | 26,701 | 997,754 | 3369 | 13:57:26 | 14:53:34 |
| baseline | 1 | 4,732 | 91,564 | 36 | 13:57:26 | 13:58:02 |
| judge | 3 | 5,977 | 165,485 | 25 | 13:57:26 | 13:57:51 |
| triage | 1 | 2,316 | 38,016 | 22 | 14:53:35 | 14:53:57 |
| refute | 1 | 1,772 | 79,851 | 25 | 14:53:57 | 14:54:22 |
| capture | 1 | 360 | 33,685 | 8 | 14:54:22 | 14:54:31 |
| synthesize | 1 | 10,089 | 57,057 | 62 | 14:54:31 | 14:55:33 |

- **claude-opus-5-5**: 3 agent · 36 calls · out 39,788 · in 72 · cache_read 2,306,352 · cache_create 262,484
- **claude-sonnet-5-5**: 8 agent · 19 calls · out 25,246 · in 38 · cache_read 465,658 · cache_create 424,356
- **claude-haiku-5-5**: 15 agent · 42 calls · out 26,701 · in 84 · cache_read 997,754 · cache_create 721,621

### S4 round 3 — wf_f94fe252-52e (25 agent, 110,717 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 11 | 17,745 | 22 | 883,886 | 201 |
| review:measurement | claude-opus-5-5 | 13 | 17,459 | 26 | 1,180,880 | 473 |
| review:conventions | claude-opus-5-5 | 13 | 15,856 | 26 | 1,129,045 | 193 |
| synthesize:report | claude-sonnet-5-5 | 3 | 11,855 | 6 | 133,127 | 65 |
| triage | claude-sonnet-5-5 | 3 | 9,469 | 6 | 99,895 | 145 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 9 | 5,836 | 18 | 317,314 | 952 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 4,771 | 6 | 91,171 | 29 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 5 | 3,809 | 10 | 134,148 | 792 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 5 | 2,671 | 10 | 134,446 | 755 |
| judge:E10j:domain-correctness | claude-sonnet-5-5 | 3 | 2,284 | 8 | 91,955 | 19 |
| machine:node migration/kich-ban/thuoc-that.mjs | claude-haiku-5-5 | 2 | 2,139 | 4 | 37,988 | 69 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,900 | 4 | 37,980 | 98 |
| judge:E10j:spec-alignment | claude-sonnet-5-5 | 3 | 1,887 | 8 | 95,571 | 16 |
| judge:E10j:operational-feasibility | claude-sonnet-5-5 | 3 | 1,802 | 8 | 95,575 | 16 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,755 | 4 | 37,980 | 14 |
| machine:node --test migration/kich-ban/don-nha.t | claude-haiku-5-5 | 2 | 1,719 | 4 | 37,988 | 153 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,178 | 4 | 34,689 | 246 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,060 | 4 | 38,036 | 162 |
| machine:node migration/kich-ban/thuoc-that.mjs - | claude-haiku-5-5 | 2 | 1,030 | 4 | 37,994 | 115 |
| machine:node migration/kich-ban/thuoc-that.mjs - | claude-haiku-5-5 | 2 | 903 | 4 | 37,992 | 102 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 859 | 4 | 37,981 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 835 | 4 | 38,036 | 97 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 818 | 4 | 38,036 | 112 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 716 | 4 | 38,006 | 7 |
| capture:provenance | claude-sonnet-5-5 | 2 | 361 | 4 | 33,473 | 6 |


wall: 3460s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| review | 3 | 51,060 | 3,193,811 | 476 | 04:19:23 | 04:27:18 |
| machine | 15 | 27,228 | 1,038,614 | 3244 | 04:19:23 | 05:13:27 |
| baseline | 1 | 4,771 | 91,171 | 29 | 04:19:23 | 04:19:52 |
| judge | 3 | 5,973 | 283,101 | 19 | 04:19:23 | 04:19:42 |
| triage | 1 | 9,469 | 99,895 | 145 | 05:13:27 | 05:15:52 |
| capture | 1 | 361 | 33,473 | 6 | 05:15:52 | 05:15:58 |
| synthesize | 1 | 11,855 | 133,127 | 65 | 05:15:58 | 05:17:03 |

- **claude-opus-5-5**: 3 agent · 37 calls · out 51,060 · in 74 · cache_read 3,193,811 · cache_create 396,569
- **claude-sonnet-5-5**: 7 agent · 20 calls · out 32,429 · in 46 · cache_read 640,767 · cache_create 393,981
- **claude-haiku-5-5**: 15 agent · 43 calls · out 27,228 · in 86 · cache_read 1,038,614 · cache_create 719,572

